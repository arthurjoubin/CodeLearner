import React from 'react';
import { CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { getLearningPathInfo, type LearningPathId } from '../data/modules';

interface PrerequisiteBannerProps {
  pathId: LearningPathId;
  completedPaths: string[];
  compact?: boolean;
}

export const PrerequisiteBanner: React.FC<PrerequisiteBannerProps> = ({
  pathId,
  completedPaths,
  compact = false,
}) => {
  const pathInfo = getLearningPathInfo(pathId);
  const prerequisites = pathInfo?.prerequisites || [];

  if (prerequisites.length === 0) {
    return null;
  }

  const allCompleted = prerequisites.every(p => completedPaths.includes(p));

  if (compact) {
    return (
      <div className={`flex items-center gap-2 text-sm ${allCompleted ? 'text-green-600' : 'text-amber-600'}`}>
        {allCompleted ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          <Lock className="w-4 h-4" />
        )}
        <span>
          {allCompleted
            ? 'Prerequisites met'
            : `Requires: ${prerequisites.map(p => getLearningPathInfo(p as LearningPathId)?.name || p).join(', ')}`}
        </span>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border-2 p-4 ${allCompleted ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
      <div className="flex items-start gap-3">
        {allCompleted ? (
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        )}
        <div className="flex-1">
          <h4 className={`font-semibold mb-2 ${allCompleted ? 'text-green-800' : 'text-amber-800'}`}>
            {allCompleted ? 'Prerequisites Complete' : 'Prerequisites Required'}
          </h4>
          <div className="space-y-2">
            {prerequisites.map(prereqId => {
              const prereqInfo = getLearningPathInfo(prereqId as LearningPathId);
              const isCompleted = completedPaths.includes(prereqId);
              return (
                <div
                  key={prereqId}
                  className={`flex items-center justify-between p-2 rounded border ${
                    isCompleted
                      ? 'bg-white border-green-200'
                      : 'bg-amber-100/50 border-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-amber-500" />
                    )}
                    <span className={isCompleted ? 'text-green-700' : 'text-amber-700'}>
                      {prereqInfo?.name || prereqId}
                    </span>
                  </div>
                  {!isCompleted && (
                    <a
                      href={`/learning-path/${prereqId}`}
                      className="text-sm text-amber-700 hover:text-amber-900 underline"
                    >
                      Start →
                    </a>
                  )}
                </div>
              );
            })}
          </div>
          {!allCompleted && (
            <p className="mt-3 text-sm text-amber-700">
              Complete all prerequisites to unlock this learning path. You can still explore the content, but we recommend finishing the basics first.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
