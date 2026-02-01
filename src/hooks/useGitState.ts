import { useState, useCallback, useRef } from 'react';
import type { GitScenarioInitialState } from '../types';

export interface GitFile {
  id: string;
  name: string;
  status: 'untracked' | 'modified' | 'staged' | 'committed';
  content?: string;
}

export interface GitCommitData {
  id: string;
  hash: string;
  message: string;
  files: string[];
  parent?: string;
  branch: string;
}

export interface GitBranchData {
  name: string;
  head: string;
  color: string;
}

export interface GitState {
  files: GitFile[];
  commits: GitCommitData[];
  branches: GitBranchData[];
  currentBranch: string;
  isInitialized: boolean;
}

export interface TerminalEntry {
  command: string;
  output: string;
}

const branchColors = [
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-green-400 to-green-600',
  'from-orange-400 to-orange-600',
];

function generateHash(): string {
  return Math.random().toString(36).substring(2, 9);
}

function hydrateState(initial: GitScenarioInitialState): GitState {
  const branches: GitBranchData[] = initial.branches.map((name, i) => ({
    name,
    head: '',
    color: branchColors[i % branchColors.length],
  }));

  const commits: GitCommitData[] = [];
  for (const c of initial.commits) {
    const hash = generateHash();
    const branch = c.branch || initial.currentBranch;
    commits.push({
      id: hash,
      hash,
      message: c.message,
      files: c.files,
      branch,
    });
    const branchEntry = branches.find(b => b.name === branch);
    if (branchEntry) branchEntry.head = hash;
  }

  const files: GitFile[] = initial.files.map((f, i) => ({
    id: String(i + 1),
    name: f.name,
    status: f.status,
    content: f.content,
  }));

  return {
    files,
    commits,
    branches,
    currentBranch: initial.currentBranch,
    isInitialized: initial.isInitialized,
  };
}

export function useGitState(initialState: GitScenarioInitialState) {
  const initialRef = useRef(initialState);
  const [state, setState] = useState<GitState>(() => hydrateState(initialState));
  const [terminalHistory, setTerminalHistory] = useState<TerminalEntry[]>([]);
  const [lastAction, setLastAction] = useState<string>('');

  const addOutput = useCallback((command: string, output: string) => {
    setTerminalHistory(prev => [...prev, { command, output }]);
  }, []);

  const executeCommand = useCallback((cmd: string): void => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const lower = trimmed.toLowerCase();

    // git init
    if (lower === 'git init') {
      setState(prev => {
        if (prev.isInitialized) {
          addOutput(trimmed, 'Reinitialized existing Git repository');
          return prev;
        }
        addOutput(trimmed, 'Initialized empty Git repository in /project/.git/');
        setLastAction('init');
        return {
          ...prev,
          isInitialized: true,
          branches: [{ name: 'main', head: '', color: branchColors[0] }],
          currentBranch: 'main',
        };
      });
      return;
    }

    // Must be initialized for other git commands
    if (lower.startsWith('git ') && lower !== 'git init') {
      setState(prev => {
        if (!prev.isInitialized) {
          addOutput(trimmed, 'fatal: not a git repository (or any of the parent directories): .git');
          return prev;
        }
        return prev;
      });
      // If not initialized, check synchronously
      if (!state.isInitialized && lower !== 'git init') {
        // state might be stale in the callback, use a direct check
      }
    }

    // git status
    if (lower === 'git status') {
      setState(prev => {
        if (!prev.isInitialized) {
          addOutput(trimmed, 'fatal: not a git repository (or any of the parent directories): .git');
          return prev;
        }
        const untracked = prev.files.filter(f => f.status === 'untracked');
        const modified = prev.files.filter(f => f.status === 'modified');
        const staged = prev.files.filter(f => f.status === 'staged');

        let output = `On branch ${prev.currentBranch}\n`;
        if (staged.length === 0 && modified.length === 0 && untracked.length === 0) {
          output += 'nothing to commit, working tree clean';
        } else {
          if (staged.length > 0) {
            output += '\nChanges to be committed:\n';
            staged.forEach(f => { output += `  new file:   ${f.name}\n`; });
          }
          if (modified.length > 0) {
            output += '\nChanges not staged for commit:\n';
            modified.forEach(f => { output += `  modified:   ${f.name}\n`; });
          }
          if (untracked.length > 0) {
            output += '\nUntracked files:\n';
            untracked.forEach(f => { output += `  ${f.name}\n`; });
          }
        }
        addOutput(trimmed, output.trimEnd());
        return prev;
      });
      return;
    }

    // git log
    if (lower === 'git log' || lower === 'git log --oneline') {
      setState(prev => {
        if (!prev.isInitialized) {
          addOutput(trimmed, 'fatal: not a git repository (or any of the parent directories): .git');
          return prev;
        }
        if (prev.commits.length === 0) {
          addOutput(trimmed, 'fatal: your current branch \'main\' does not have any commits yet');
          return prev;
        }
        const branchCommits = prev.commits.filter(c => c.branch === prev.currentBranch);
        const lines = branchCommits.slice().reverse().map(c => {
          if (lower.includes('--oneline')) {
            return `${c.hash.substring(0, 7)} ${c.message}`;
          }
          return `commit ${c.hash}\n    ${c.message}`;
        });
        addOutput(trimmed, lines.join('\n'));
        return prev;
      });
      return;
    }

    // git diff
    if (lower === 'git diff' || lower === 'git diff --staged') {
      setState(prev => {
        if (!prev.isInitialized) {
          addOutput(trimmed, 'fatal: not a git repository (or any of the parent directories): .git');
          return prev;
        }
        if (lower === 'git diff --staged') {
          const staged = prev.files.filter(f => f.status === 'staged');
          if (staged.length === 0) {
            addOutput(trimmed, '');
          } else {
            const lines = staged.map(f => `diff --git a/${f.name} b/${f.name}\n+++ b/${f.name}`);
            addOutput(trimmed, lines.join('\n'));
          }
        } else {
          const modified = prev.files.filter(f => f.status === 'modified');
          if (modified.length === 0) {
            addOutput(trimmed, '');
          } else {
            const lines = modified.map(f => `diff --git a/${f.name} b/${f.name}\n--- a/${f.name}\n+++ b/${f.name}`);
            addOutput(trimmed, lines.join('\n'));
          }
        }
        return prev;
      });
      return;
    }

    // git add
    if (lower === 'git add .' || lower === 'git add -a' || lower.startsWith('git add ')) {
      setState(prev => {
        if (!prev.isInitialized) {
          addOutput(trimmed, 'fatal: not a git repository (or any of the parent directories): .git');
          return prev;
        }

        if (lower === 'git add .' || lower === 'git add -a') {
          const hasFilesToStage = prev.files.some(f => f.status === 'untracked' || f.status === 'modified');
          if (!hasFilesToStage) {
            addOutput(trimmed, '');
            return prev;
          }
          addOutput(trimmed, '');
          setLastAction('stage');
          return {
            ...prev,
            files: prev.files.map(f =>
              f.status === 'untracked' || f.status === 'modified'
                ? { ...f, status: 'staged' as const }
                : f
            ),
          };
        }

        // git add <specific file>
        const fileName = trimmed.replace(/^git add\s+/i, '').trim();
        const file = prev.files.find(f => f.name === fileName);
        if (!file) {
          addOutput(trimmed, `fatal: pathspec '${fileName}' did not match any files`);
          return prev;
        }
        if (file.status !== 'untracked' && file.status !== 'modified') {
          addOutput(trimmed, '');
          return prev;
        }
        addOutput(trimmed, '');
        setLastAction('stage');
        return {
          ...prev,
          files: prev.files.map(f =>
            f.name === fileName && (f.status === 'untracked' || f.status === 'modified')
              ? { ...f, status: 'staged' as const }
              : f
          ),
        };
      });
      return;
    }

    // git commit
    if (lower.startsWith('git commit')) {
      const messageMatch = trimmed.match(/-m\s+["'](.+?)["']/);
      const message = messageMatch ? messageMatch[1] : '';

      if (!message) {
        addOutput(trimmed, 'error: switch `m\' requires a value');
        return;
      }

      setState(prev => {
        if (!prev.isInitialized) {
          addOutput(trimmed, 'fatal: not a git repository (or any of the parent directories): .git');
          return prev;
        }
        const stagedFiles = prev.files.filter(f => f.status === 'staged');
        if (stagedFiles.length === 0) {
          addOutput(trimmed, 'nothing to commit, working tree clean');
          return prev;
        }

        const hash = generateHash();
        const newCommit: GitCommitData = {
          id: hash,
          hash,
          message,
          files: stagedFiles.map(f => f.name),
          branch: prev.currentBranch,
        };

        addOutput(trimmed, `[${prev.currentBranch} ${hash.substring(0, 7)}] ${message}\n ${stagedFiles.length} file(s) changed`);
        setLastAction('commit');

        return {
          ...prev,
          commits: [...prev.commits, newCommit],
          files: prev.files.map(f =>
            f.status === 'staged' ? { ...f, status: 'committed' as const } : f
          ),
          branches: prev.branches.map(b =>
            b.name === prev.currentBranch ? { ...b, head: hash } : b
          ),
        };
      });
      return;
    }

    // git branch (list or create)
    if (lower === 'git branch') {
      setState(prev => {
        if (!prev.isInitialized) {
          addOutput(trimmed, 'fatal: not a git repository (or any of the parent directories): .git');
          return prev;
        }
        const lines = prev.branches.map(b =>
          b.name === prev.currentBranch ? `* ${b.name}` : `  ${b.name}`
        );
        addOutput(trimmed, lines.join('\n'));
        return prev;
      });
      return;
    }

    if (lower.startsWith('git branch ') && !lower.includes('-d') && !lower.includes('-D')) {
      const branchName = trimmed.split(/\s+/)[2];
      if (!branchName) {
        addOutput(trimmed, 'fatal: branch name required');
        return;
      }

      setState(prev => {
        if (!prev.isInitialized) {
          addOutput(trimmed, 'fatal: not a git repository (or any of the parent directories): .git');
          return prev;
        }
        if (prev.branches.some(b => b.name === branchName)) {
          addOutput(trimmed, `fatal: a branch named '${branchName}' already exists`);
          return prev;
        }

        addOutput(trimmed, '');
        setLastAction('branch');
        return {
          ...prev,
          branches: [
            ...prev.branches,
            {
              name: branchName,
              head: prev.branches.find(b => b.name === prev.currentBranch)?.head || '',
              color: branchColors[prev.branches.length % branchColors.length],
            },
          ],
        };
      });
      return;
    }

    // git branch -d / -D
    if (lower.startsWith('git branch -d ') || lower.startsWith('git branch -D ')) {
      const parts = trimmed.split(/\s+/);
      const branchName = parts[3];

      setState(prev => {
        if (!prev.isInitialized) {
          addOutput(trimmed, 'fatal: not a git repository');
          return prev;
        }
        if (!prev.branches.some(b => b.name === branchName)) {
          addOutput(trimmed, `error: branch '${branchName}' not found`);
          return prev;
        }
        if (branchName === prev.currentBranch) {
          addOutput(trimmed, `error: Cannot delete branch '${branchName}' checked out`);
          return prev;
        }
        addOutput(trimmed, `Deleted branch ${branchName}`);
        return {
          ...prev,
          branches: prev.branches.filter(b => b.name !== branchName),
        };
      });
      return;
    }

    // git checkout / git switch
    if (lower.startsWith('git checkout -b ') || lower.startsWith('git switch -c ')) {
      const parts = trimmed.split(/\s+/);
      const branchName = parts[parts.length - 1];

      setState(prev => {
        if (!prev.isInitialized) {
          addOutput(trimmed, 'fatal: not a git repository');
          return prev;
        }
        if (prev.branches.some(b => b.name === branchName)) {
          addOutput(trimmed, `fatal: a branch named '${branchName}' already exists`);
          return prev;
        }

        addOutput(trimmed, `Switched to a new branch '${branchName}'`);
        setLastAction('checkout');
        return {
          ...prev,
          branches: [
            ...prev.branches,
            {
              name: branchName,
              head: prev.branches.find(b => b.name === prev.currentBranch)?.head || '',
              color: branchColors[prev.branches.length % branchColors.length],
            },
          ],
          currentBranch: branchName,
        };
      });
      return;
    }

    if (lower.startsWith('git checkout ') || lower.startsWith('git switch ')) {
      const parts = trimmed.split(/\s+/);
      const branchName = parts[parts.length - 1];

      setState(prev => {
        if (!prev.isInitialized) {
          addOutput(trimmed, 'fatal: not a git repository');
          return prev;
        }
        if (!prev.branches.some(b => b.name === branchName)) {
          addOutput(trimmed, `error: pathspec '${branchName}' did not match any file(s) known to git`);
          return prev;
        }
        if (branchName === prev.currentBranch) {
          addOutput(trimmed, `Already on '${branchName}'`);
          return prev;
        }

        addOutput(trimmed, `Switched to branch '${branchName}'`);
        setLastAction('checkout');
        return { ...prev, currentBranch: branchName };
      });
      return;
    }

    // git merge
    if (lower.startsWith('git merge ')) {
      const parts = trimmed.split(/\s+/);
      const branchName = parts[2];

      if (lower.includes('--abort')) {
        addOutput(trimmed, 'Merge aborted');
        return;
      }

      setState(prev => {
        if (!prev.isInitialized) {
          addOutput(trimmed, 'fatal: not a git repository');
          return prev;
        }
        if (!prev.branches.some(b => b.name === branchName)) {
          addOutput(trimmed, `merge: ${branchName} - not something we can merge`);
          return prev;
        }
        if (branchName === prev.currentBranch) {
          addOutput(trimmed, `Already up to date.`);
          return prev;
        }

        // Find commits on the source branch
        const sourceBranchCommits = prev.commits.filter(c => c.branch === branchName);
        if (sourceBranchCommits.length === 0) {
          addOutput(trimmed, 'Already up to date.');
          return prev;
        }

        // Create merge commit
        const hash = generateHash();
        const mergeCommit: GitCommitData = {
          id: hash,
          hash,
          message: `Merge branch '${branchName}' into ${prev.currentBranch}`,
          files: [],
          branch: prev.currentBranch,
        };

        // Duplicate source-branch-only commits onto current branch
        const newCommits = sourceBranchCommits.map(c => ({
          ...c,
          id: c.id + '-merged',
          branch: prev.currentBranch,
        }));

        addOutput(trimmed, `Merge made by the 'ort' strategy.\n${sourceBranchCommits.length} commit(s) merged.`);
        setLastAction('commit');

        return {
          ...prev,
          commits: [...prev.commits, ...newCommits, mergeCommit],
          branches: prev.branches.map(b =>
            b.name === prev.currentBranch ? { ...b, head: hash } : b
          ),
        };
      });
      return;
    }

    // git restore --staged
    if (lower.startsWith('git restore --staged')) {
      const target = trimmed.replace(/^git restore --staged\s*/i, '').trim();

      setState(prev => {
        if (!prev.isInitialized) {
          addOutput(trimmed, 'fatal: not a git repository');
          return prev;
        }
        if (target === '.' || !target) {
          addOutput(trimmed, '');
          setLastAction('unstage');
          return {
            ...prev,
            files: prev.files.map(f =>
              f.status === 'staged' ? { ...f, status: 'modified' as const } : f
            ),
          };
        }
        const file = prev.files.find(f => f.name === target);
        if (!file) {
          addOutput(trimmed, `fatal: pathspec '${target}' did not match any file(s)`);
          return prev;
        }
        addOutput(trimmed, '');
        setLastAction('unstage');
        return {
          ...prev,
          files: prev.files.map(f =>
            f.name === target && f.status === 'staged' ? { ...f, status: 'modified' as const } : f
          ),
        };
      });
      return;
    }

    // git restore
    if (lower.startsWith('git restore')) {
      const target = trimmed.replace(/^git restore\s*/i, '').trim();

      setState(prev => {
        if (!prev.isInitialized) {
          addOutput(trimmed, 'fatal: not a git repository');
          return prev;
        }
        if (target === '.') {
          addOutput(trimmed, '');
          setLastAction('restore');
          return {
            ...prev,
            files: prev.files.map(f =>
              f.status === 'modified' ? { ...f, status: 'committed' as const } : f
            ),
          };
        }
        addOutput(trimmed, '');
        setLastAction('restore');
        return {
          ...prev,
          files: prev.files.map(f =>
            f.name === target && f.status === 'modified' ? { ...f, status: 'committed' as const } : f
          ),
        };
      });
      return;
    }

    // Unknown command
    addOutput(trimmed, `bash: ${trimmed.split(' ')[0]}: command not found`);
  }, [state.isInitialized, addOutput]);

  const reset = useCallback(() => {
    setState(hydrateState(initialRef.current));
    setTerminalHistory([]);
    setLastAction('');
  }, []);

  return { state, terminalHistory, executeCommand, reset, lastAction };
}
