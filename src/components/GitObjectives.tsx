import { useMemo, useState } from 'react';
import { CheckCircle, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import type { GitObjective } from '../types';
import type { GitState } from '../hooks/useGitState';
import { checkAllObjectives } from '../utils/gitValidation';

interface GitObjectivesProps {
  objectives: GitObjective[];
  state: GitState;
}

export default function GitObjectives({ objectives, state }: GitObjectivesProps) {
  const [showAll, setShowAll] = useState(false);
  
  const results = useMemo(
    () => checkAllObjectives(state, objectives),
    [state, objectives]
  );

  const completedCount = results.filter(r => r.passed).length;
  const allDone = completedCount === results.length;
  
  // Trouver l'objectif en cours (premier non complété)
  const currentObjectiveIndex = results.findIndex(r => !r.passed);
  const currentObjective = currentObjectiveIndex !== -1 ? results[currentObjectiveIndex] : null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-2.5 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-xs font-bold text-gray-700 uppercase">Objectives</h3>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          allDone
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-600'
        }`}>
          {completedCount}/{results.length}
        </span>
      </div>
      
      <div className="p-2">
        {showAll ? (
          // Mode accordéon - afficher tous les objectifs
          <div className="space-y-1">
            {results.map((result, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 p-1.5 rounded transition-all duration-300 ${
                  result.passed
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                {result.passed ? (
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-gray-300 shrink-0 mt-0.5" />
                )}
                <span className={`text-xs ${
                  result.passed ? 'text-green-700 line-through' : 'text-gray-700'
                }`}>
                  {result.objective.description}
                </span>
              </div>
            ))}
            <button
              onClick={() => setShowAll(false)}
              className="w-full flex items-center justify-center gap-1 pt-1 text-[10px] font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ChevronUp className="w-3 h-3" />
              Show current only
            </button>
          </div>
        ) : (
          // Mode compact - afficher seulement l'objectif en cours
          <div>
            {currentObjective ? (
              <div className="flex items-start gap-2 p-1.5 rounded bg-primary-50 border border-primary-200">
                <Circle className="w-3.5 h-3.5 text-primary-500 shrink-0 mt-0.5 animate-pulse" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-0.5">Current objective:</p>
                  <p className="text-xs text-gray-800 font-medium">{currentObjective.objective.description}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-1.5 rounded bg-green-50 border border-green-200">
                <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                <span className="text-xs text-green-700 font-medium">All objectives completed!</span>
              </div>
            )}
            {results.length > 1 && !allDone && (
              <button
                onClick={() => setShowAll(true)}
                className="w-full flex items-center justify-center gap-1 pt-1.5 text-[10px] font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ChevronDown className="w-3 h-3" />
                Show all {results.length} objectives
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
