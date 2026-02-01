import { useState, useEffect, useCallback } from 'react';
import { FileText, GitCommit, GitBranch, Folder, ArrowRight, Check, Undo2 } from 'lucide-react';

export interface GitFile {
  id: string;
  name: string;
  status: 'untracked' | 'modified' | 'staged' | 'committed';
  content?: string;
}

export interface GitCommit_data {
  id: string;
  hash: string;
  message: string;
  files: string[];
  parent?: string;
  branch: string;
}

export interface GitBranch_data {
  name: string;
  head: string;
  color: string;
}

export interface GitState {
  files: GitFile[];
  commits: GitCommit_data[];
  branches: GitBranch_data[];
  currentBranch: string;
  isInitialized: boolean;
}

interface GitSimulatorProps {
  command?: string;
  onStateChange?: (state: GitState) => void;
  initialState?: GitState;
}

const defaultState: GitState = {
  files: [
    { id: '1', name: 'README.md', status: 'untracked', content: '# Mon Projet' },
    { id: '2', name: 'index.html', status: 'untracked', content: '<html></html>' },
  ],
  commits: [],
  branches: [],
  currentBranch: '',
  isInitialized: false,
};

const branchColors = [
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-green-400 to-green-600',
  'from-orange-400 to-orange-600',
];

export default function GitSimulator({ command, onStateChange, initialState }: GitSimulatorProps) {
  const [state, setState] = useState<GitState>(initialState || defaultState);
  const [lastAction, setLastAction] = useState<string>('');
  const [animating, setAnimating] = useState<string | null>(null);

  const executeCommand = useCallback((cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    if (trimmedCmd === 'git init') {
      setState(prev => ({
        ...prev,
        isInitialized: true,
        branches: [{ name: 'main', head: '', color: branchColors[0] }],
        currentBranch: 'main',
      }));
      setLastAction('Repository initialized');
      setAnimating('init');
    } else if (trimmedCmd === 'git add .' || trimmedCmd.startsWith('git add')) {
      setState(prev => ({
        ...prev,
        files: prev.files.map(f => 
          f.status === 'untracked' || f.status === 'modified' 
            ? { ...f, status: 'staged' } 
            : f
        ),
      }));
      setLastAction('Files staged');
      setAnimating('stage');
    } else if (trimmedCmd.startsWith('git commit')) {
      const messageMatch = cmd.match(/-m\s+["'](.+?)["']/);
      const message = messageMatch ? messageMatch[1] : 'New commit';
      const hash = Math.random().toString(36).substring(2, 8);
      
      setState(prev => {
        const stagedFiles = prev.files.filter(f => f.status === 'staged');
        if (stagedFiles.length === 0) return prev;

        const newCommit: GitCommit_data = {
          id: hash,
          hash,
          message,
          files: stagedFiles.map(f => f.name),
          branch: prev.currentBranch,
        };

        return {
          ...prev,
          commits: [...prev.commits, newCommit],
          files: prev.files.map(f => 
            f.status === 'staged' ? { ...f, status: 'committed' } : f
          ),
          branches: prev.branches.map(b => 
            b.name === prev.currentBranch 
              ? { ...b, head: hash } 
              : b
          ),
        };
      });
      setLastAction(`Commit created: ${message}`);
      setAnimating('commit');
    } else if (trimmedCmd.startsWith('git branch')) {
      const parts = trimmedCmd.split(' ');
      if (parts.length >= 3 && parts[2] !== '-d' && parts[2] !== '-D') {
        const branchName = parts[2];
        setState(prev => ({
          ...prev,
          branches: [
            ...prev.branches,
            { 
              name: branchName, 
              head: prev.branches.find(b => b.name === prev.currentBranch)?.head || '',
              color: branchColors[prev.branches.length % branchColors.length]
            }
          ],
        }));
        setLastAction(`Branch created: ${branchName}`);
        setAnimating('branch');
      }
    } else if (trimmedCmd.startsWith('git checkout') || trimmedCmd.startsWith('git switch')) {
      const parts = trimmedCmd.split(' ');
      const branchName = parts[parts.length - 1];
      if (state.branches.some(b => b.name === branchName)) {
        setState(prev => ({ ...prev, currentBranch: branchName }));
        setLastAction(`Switched to branch: ${branchName}`);
        setAnimating('checkout');
      }
    } else if (trimmedCmd.startsWith('git restore --staged')) {
      setState(prev => ({
        ...prev,
        files: prev.files.map(f => 
          f.status === 'staged' ? { ...f, status: 'modified' } : f
        ),
      }));
      setLastAction('Files unstaged');
      setAnimating('unstage');
    } else if (trimmedCmd === 'git restore .' || trimmedCmd.startsWith('git restore')) {
      setState(prev => ({
        ...prev,
        files: prev.files.map(f => 
          f.status === 'modified' ? { ...f, status: 'committed' } : f
        ),
      }));
      setLastAction('Changes discarded');
      setAnimating('restore');
    }
  }, [state.branches]);

  useEffect(() => {
    if (command) {
      executeCommand(command);
    }
  }, [command, executeCommand]);

  useEffect(() => {
    if (animating) {
      const timer = setTimeout(() => setAnimating(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [animating]);

  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  const getFilesByStatus = (status: GitFile['status']) => 
    state.files.filter(f => f.status === status);

  const getCurrentBranchCommits = () => {
    return state.commits.filter(c => c.branch === state.currentBranch);
  };

  return (
    <div className="w-full h-full bg-gray-50 p-4 overflow-auto">
      {/* Status Bar */}
      <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {state.isInitialized ? (
                <>
                  <span className="text-primary-600">{state.currentBranch}</span>
                  <span className="text-gray-400 mx-2">|</span>
                  <span className="text-gray-500">{getCurrentBranchCommits().length} commits</span>
                </>
              ) : (
                <span className="text-gray-400">Not initialized</span>
              )}
            </span>
          </div>
          {lastAction && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <Check className="w-3 h-3" />
              {lastAction}
            </div>
          )}
        </div>
        
        {/* Branches */}
        {state.branches.length > 0 && (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400">Branches:</span>
            {state.branches.map((branch) => (
              <span
                key={branch.name}
                className={`text-xs px-2 py-0.5 rounded-full ${
                  branch.name === state.currentBranch
                    ? 'bg-primary-100 text-primary-700 border border-primary-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                {branch.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Git Areas */}
      <div className="space-y-3">
        {/* Working Directory */}
        <div className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
          animating === 'stage' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300 bg-white'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-bold text-gray-700">Working Directory</h3>
            </div>
            <span className="text-xs text-gray-400">
              {getFilesByStatus('untracked').length + getFilesByStatus('modified').length} files
            </span>
          </div>
          
          <div className="space-y-2 min-h-[60px]">
            {getFilesByStatus('untracked').map(file => (
              <div 
                key={file.id}
                className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-sm animate-pulse"
              >
                <FileText className="w-4 h-4 text-red-500" />
                <span className="text-red-700">{file.name}</span>
                <span className="text-xs text-red-400 ml-auto">untracked</span>
              </div>
            ))}
            {getFilesByStatus('modified').map(file => (
              <div 
                key={file.id}
                className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm"
              >
                <FileText className="w-4 h-4 text-orange-500" />
                <span className="text-orange-700">{file.name}</span>
                <Undo2 className="w-3 h-3 text-orange-400 ml-auto" />
              </div>
            ))}
            {getFilesByStatus('untracked').length === 0 && getFilesByStatus('modified').length === 0 && (
              <div className="text-center py-4 text-gray-400 text-sm">
                Clean working directory
              </div>
            )}
          </div>

          {/* Arrow to staging */}
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-gray-200 rounded-full p-1">
              <ArrowRight className="w-4 h-4 text-gray-500 rotate-90" />
            </div>
          </div>
        </div>

        {/* Staging Area */}
        <div className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
          animating === 'stage' ? 'border-green-400 bg-green-50' : 
          animating === 'commit' ? 'border-blue-400 bg-blue-50' :
          'border-gray-300 bg-white'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-yellow-500" />
              <h3 className="text-sm font-bold text-gray-700">Staging Area</h3>
            </div>
            <span className="text-xs text-gray-400">
              {getFilesByStatus('staged').length} files
            </span>
          </div>
          
          <div className="space-y-2 min-h-[60px]">
            {getFilesByStatus('staged').map(file => (
              <div 
                key={file.id}
                className={`flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded text-sm transition-all duration-500 ${
                  animating === 'commit' ? 'transform scale-95 opacity-50' : ''
                }`}
              >
                <FileText className="w-4 h-4 text-green-500" />
                <span className="text-green-700">{file.name}</span>
                <Check className="w-3 h-3 text-green-500 ml-auto" />
              </div>
            ))}
            {getFilesByStatus('staged').length === 0 && (
              <div className="text-center py-4 text-gray-400 text-sm">
                Nothing staged
              </div>
            )}
          </div>

          {/* Arrow to repository */}
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-gray-200 rounded-full p-1">
              <ArrowRight className="w-4 h-4 text-gray-500 rotate-90" />
            </div>
          </div>
        </div>

        {/* Repository */}
        <div className={`p-4 rounded-lg border-2 transition-all duration-300 ${
          animating === 'commit' ? 'border-purple-400 bg-purple-50' : 'border-gray-300 bg-white'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-bold text-gray-700">Repository</h3>
            </div>
            <span className="text-xs text-gray-400">
              {getCurrentBranchCommits().length} commits
            </span>
          </div>
          
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {getCurrentBranchCommits().length === 0 ? (
              <div className="text-center py-4 text-gray-400 text-sm">
                No commits yet
              </div>
            ) : (
              getCurrentBranchCommits().slice().reverse().map((commit, idx) => (
                <div 
                  key={commit.id}
                  className={`flex items-start gap-2 p-2 bg-gray-50 border border-gray-200 rounded text-sm ${
                    idx === 0 && animating === 'commit' ? 'ring-2 ring-purple-400 bg-purple-50' : ''
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${
                    state.branches.find(b => b.name === commit.branch)?.color || branchColors[0]
                  } flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {commit.hash.substring(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {commit.message}
                    </div>
                    <div className="text-xs text-gray-500">
                      {commit.hash} • {commit.files.length} files
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 p-3 bg-gray-100 rounded-lg">
        <div className="text-xs text-gray-500 font-medium mb-2">Legend:</div>
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-50 border border-red-200 rounded" />
            <span className="text-gray-600">Untracked</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-50 border border-orange-200 rounded" />
            <span className="text-gray-600">Modified</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-50 border border-green-200 rounded" />
            <span className="text-gray-600">Staged</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded" />
            <span className="text-gray-600">Committed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
