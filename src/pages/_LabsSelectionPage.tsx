import { useState, useMemo } from 'react';
import { useUser, UserProvider } from '../context/UserContext';
import { labs } from '../data/labs';

import { FlaskConical, Lock, ChevronRight, CheckCircle, Star } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PageTitle } from '../components/PageTitle';

function LabsSelectionPageContent() {
  const { user, loading, debugShowAll } = useUser();
  const [activeTech, setActiveTech] = useState<string>('All');

  // Extract unique technologies
  const allTechs = useMemo(() => {
    const techSet = new Set<string>();
    labs.forEach(lab => lab.technologies?.forEach(t => techSet.add(t)));
    return ['All', ...Array.from(techSet).sort()];
  }, []);

  const filteredLabs = activeTech === 'All'
    ? labs
    : labs.filter(lab => lab.technologies?.includes(activeTech));

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) return null;

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="mb-6">
        <PageTitle>
          <h1 className="text-2xl font-black uppercase mb-1 flex items-center gap-2 text-gray-900">
            <FlaskConical className="w-6 h-6 text-primary-600" /> Project Labs
          </h1>
        </PageTitle>
        <p className="text-sm text-gray-600 mt-1 max-w-lg">
          Guided mini-projects to practice what you learned. Each lab walks you through building something real, step by step, with AI validation.
        </p>
      </div>

      {/* Technology filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1 scrollbar-hide">
        {allTechs.map(tech => (
          <button
            key={tech}
            onClick={() => setActiveTech(tech)}
            className={`px-3 py-2 text-xs font-bold uppercase rounded-lg border-2 transition-all flex-shrink-0 ${
              activeTech === tech
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
            }`}
          >
            {tech}
          </button>
        ))}
      </div>

      {/* Labs Grid - single col on mobile, 2 cols on tablet+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredLabs.map((lab, index) => {
          const globalIndex = labs.indexOf(lab);
          const isLocked = !debugShowAll && user.level < lab.requiredLevel;
          const status = user.labProgress?.[lab.id];
          const isCompleted = status?.completed;
          const currentStep = status?.currentStep || 0;

          // Locked card
          if (isLocked) {
            return (
              <div
                key={lab.id}
                className="border-2 border-gray-200 bg-gradient-to-b from-gray-50 to-white p-4 sm:p-5 opacity-60 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-gray-400 rounded-lg flex-shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Lab {globalIndex + 1}</p>
                    </div>
                    <h3 className="font-bold text-gray-400 mb-1">{lab.title}</h3>
                    <p className="text-xs text-gray-400 mb-2 line-clamp-2">{lab.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {lab.technologies?.map(tech => (
                        <span key={tech} className="text-[10px] bg-gray-100 px-2 py-0.5 border border-gray-200 font-bold rounded text-gray-400">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                      <Lock className="w-3 h-3" />
                      <span>Level {lab.requiredLevel} required</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Unlocked card
          return (
            <a
              key={lab.id}
              href={`/labs/${lab.id}`}
              className={`group border-2 border-gray-200 rounded-lg p-4 sm:p-5 transition-all hover:border-primary-500 hover:shadow-md bg-gradient-to-b from-gray-50 to-white`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 flex items-center justify-center border-2 border-gray-200 rounded-lg transition-colors flex-shrink-0 ${isCompleted ? 'bg-primary-500 text-white border-primary-500' : 'bg-primary-100 group-hover:bg-primary-500 group-hover:text-white'}`}>
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : <FlaskConical className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-primary-500 rounded-full group-hover:scale-150 transition-transform" />
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Lab {globalIndex + 1}</p>
                    {isCompleted && (
                      <span className="text-[10px] text-primary-600 font-bold uppercase">Completed</span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">{lab.title}</h3>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{lab.description}</p>

                  {/* Tech tags */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    {lab.technologies?.map(tech => (
                      <span key={tech} className="text-[10px] bg-gray-100 px-2 py-0.5 border border-gray-200 font-bold rounded text-gray-600">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-gray-100 px-2 py-0.5 border border-gray-200 font-bold rounded">
                        {lab.steps.length} steps
                      </span>
                      <span className="text-[10px] bg-primary-100 px-2 py-0.5 border border-primary-500 font-bold flex items-center gap-1 text-primary-600 rounded">
                        <Star className="w-3 h-3" /> {lab.xpReward} XP
                      </span>
                    </div>

                    {!isCompleted && currentStep > 0 && (
                      <span className="text-[10px] text-gray-500 font-bold">
                        {currentStep}/{lab.steps.length}
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 group-hover:text-primary-600 transition-colors mt-1" />
              </div>
            </a>
          );
        })}
      </div>

      {filteredLabs.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="font-bold">No labs for this technology yet.</p>
          <p className="text-sm mt-1">More coming soon!</p>
        </div>
      )}
    </div>
  );
}

export default function LabsSelectionPage() {
  return (
    <UserProvider>
      <LabsSelectionPageContent />
    </UserProvider>
  );
}
