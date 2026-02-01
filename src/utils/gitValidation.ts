import type { GitObjective, GitObjectiveCheck } from '../types';
import type { GitState } from '../hooks/useGitState';

export function checkObjective(state: GitState, check: GitObjectiveCheck): boolean {
  switch (check.type) {
    case 'isInitialized':
      return state.isInitialized === (check.value !== false);

    case 'minCommits':
      return state.commits.length >= (check.value as number);

    case 'currentBranch':
      return state.currentBranch === check.value;

    case 'branchExists':
      return state.branches.some(b => b.name === check.value);

    case 'allFilesStaged':
      return state.files.length > 0 &&
        state.files.every(f => f.status === 'staged' || f.status === 'committed');

    case 'allFilesCommitted':
      return state.files.length > 0 &&
        state.files.every(f => f.status === 'committed');

    case 'fileStatus':
      if (!check.file || !check.status) return false;
      return state.files.some(f => f.name === check.file && f.status === check.status);

    case 'noUntrackedFiles':
      return !state.files.some(f => f.status === 'untracked');

    case 'commitMessageExists':
      return state.commits.some(c =>
        c.message.toLowerCase().includes((check.value as string).toLowerCase())
      );

    case 'mergedBranch': {
      const branchName = check.value as string;
      // A branch is "merged" if current branch has commits from that branch
      const sourceBranchCommits = state.commits.filter(c => c.branch === branchName);
      if (sourceBranchCommits.length === 0) return false;
      // Check if a merge commit exists referencing this branch
      return state.commits.some(
        c => c.branch === state.currentBranch && c.message.includes(`Merge branch '${branchName}'`)
      );
    }

    default:
      return false;
  }
}

export interface ObjectiveResult {
  objective: GitObjective;
  passed: boolean;
}

export function checkAllObjectives(
  state: GitState,
  objectives: GitObjective[]
): ObjectiveResult[] {
  return objectives.map(objective => ({
    objective,
    passed: checkObjective(state, objective.check),
  }));
}
