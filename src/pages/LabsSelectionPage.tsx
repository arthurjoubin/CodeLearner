import { useUser } from '../context/UserContext';
import { labs } from '../data/labs';
import { Link } from 'react-router-dom';
import { FlaskConical, Lock, ChevronRight, CheckCircle, Star } from 'lucide-react';

export default function LabsSelectionPage() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="loading-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="mb-6">
        <div className="relative inline-block group">
          <h1 className="text-2xl font-black uppercase mb-1 flex items-center gap-2 text-gray-900">
            <FlaskConical className="w-6 h-6 text-primary-600" /> Project Labs
          </h1>
          <span className="absolute -bottom-0.5 left-0 w-12 h-0.5 bg-primary-500 transition-all group-hover:w-full duration-300" />
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Guided projects to apply your React skills
        </p>
      </div>

      {/* Labs Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {labs.map((lab, index) => {
          const isLocked = user.level < lab.requiredLevel;
          const status = user.labProgress?.[lab.id];
          const isCompleted = status?.completed;
          const currentStep = status?.currentStep || 0;

          // Locked card - simple grey design
          if (isLocked) {
            return (
              <div
                key={lab.id}
                className="border border-gray-200 bg-gradient-to-b from-gray-50 to-white p-5 opacity-60 rounded-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-gray-400 rounded-lg">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Lab {index + 1}</p>
                    </div>
                    <h3 className="font-bold text-gray-400 mb-1">{lab.title}</h3>
                    <p className="text-xs text-gray-400 mb-3">{lab.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
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
            <Link
              key={lab.id}
              to={`/labs/${lab.id}`}
              className={`border border-gray-200 rounded-lg p-5 transition-all hover:border-primary-500 hover:shadow-md bg-gradient-to-b from-gray-50 to-white ${isCompleted ? '' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 flex items-center justify-center border border-gray-200 rounded-lg transition-colors ${isCompleted ? 'bg-primary-500 text-white' : 'bg-primary-100 group-hover:bg-primary-500 group-hover:text-white'}`}>
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : <FlaskConical className="w-5 h-5" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-primary-500 rounded-full group-hover:scale-150 transition-transform" />
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Lab {index + 1}</p>
                    {isCompleted && (
                      <span className="text-[10px] text-primary-600 font-bold uppercase">Completed</span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">{lab.title}</h3>
                  <p className="text-xs text-gray-600 mb-3">{lab.description}</p>

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

                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 group-hover:text-primary-600 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
