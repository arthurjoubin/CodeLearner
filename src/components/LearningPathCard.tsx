import React from 'react';

interface LearningPathCardProps {
  id: string;
  title: string;
  description: string;
  logo: string;
  difficulty?: 'beginner' | 'medium' | 'advanced';
  modules?: number;
  hours?: string;
  comingSoon?: boolean;
}

export function LearningPathCard({
  id,
  title,
  description,
  logo,
  difficulty,
  modules,
  hours,
  comingSoon = false
}: LearningPathCardProps) {
  if (comingSoon) {
    return (
      <div className="border-2 border-gray-200 rounded-lg p-5 bg-gray-50 opacity-60">
        <div className="flex items-center gap-3 mb-3">
          <img src={logo} alt={title} className="w-8 h-8 object-contain grayscale" />
          <h3 className="font-bold text-sm uppercase text-gray-500">{title}</h3>
        </div>
        <p className="text-xs text-gray-500 mb-3">{description}</p>
        <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase bg-gray-200 text-gray-500 border border-gray-300 rounded">
          Coming Soon
        </span>
      </div>
    );
  }

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700 border-green-300',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    advanced: 'bg-red-100 text-red-700 border-red-300'
  };

  return (
    <a
      href={`/learning-path/${id}`}
      className="border-2 border-gray-300 rounded-lg p-5 bg-white hover:border-primary-500 hover:shadow-md transition-all group block"
    >
      <div className="flex items-center gap-3 mb-3">
        <img src={logo} alt={title} className="w-8 h-8 object-contain" />
        <h3 className="font-bold text-sm uppercase text-gray-900 group-hover:text-primary-700 transition-colors">
          {title}
        </h3>
      </div>
      <p className="text-xs text-gray-600 mb-3">{description}</p>
      <div className="flex items-center gap-2">
        {difficulty && (
          <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase border rounded ${difficultyColors[difficulty]}`}>
            {difficulty === 'beginner' ? 'Beginner' : difficulty === 'medium' ? 'Intermediate' : 'Advanced'}
          </span>
        )}
        {modules && hours && (
          <span className="text-[10px] text-gray-500">
            {modules} modules • {hours}
          </span>
        )}
      </div>
    </a>
  );
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  logo: string;
  difficulty?: 'beginner' | 'medium' | 'advanced';
  modules?: number;
  hours?: string;
  comingSoon?: boolean;
}

interface LearningPathGridProps {
  paths: LearningPath[];
}

export function LearningPathGrid({ paths }: LearningPathGridProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {paths.map((path) => (
        <LearningPathCard key={path.id} {...path} />
      ))}
    </div>
  );
}
