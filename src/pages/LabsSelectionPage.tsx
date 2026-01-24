import { useUser } from '../context/UserContext';
import { labs } from '../data/labs';
import { Link } from 'react-router-dom';
import { FlaskConical, Lock, ChevronRight, CheckCircle, Star } from 'lucide-react';

export default function LabsSelectionPage() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black uppercase mb-1 flex items-center gap-2">
          <FlaskConical className="w-6 h-6" /> Project Labs
        </h1>
        <p className="text-sm text-gray-600">
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
                className="border-2 border-gray-200 bg-gray-50 p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Lab {index + 1}</p>
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
              className={`border-2 border-black p-5 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal ${isCompleted ? 'bg-primary-50 border-primary-500' : 'bg-white'
                }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 flex items-center justify-center border-2 border-black ${isCompleted ? 'bg-primary-500 text-white' : 'bg-yellow-400'
                  }`}>
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : <FlaskConical className="w-5 h-5" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Lab {index + 1}</p>
                    {isCompleted && (
                      <span className="text-[10px] text-primary-600 font-bold uppercase">Completed</span>
                    )}
                  </div>
                  <h3 className="font-bold text-black mb-1">{lab.title}</h3>
                  <p className="text-xs text-gray-600 mb-3">{lab.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-gray-100 px-2 py-0.5 border border-black font-bold">
                        {lab.steps.length} steps
                      </span>
                      <span className="text-[10px] bg-yellow-100 px-2 py-0.5 border border-yellow-600 font-bold flex items-center gap-1">
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

                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
