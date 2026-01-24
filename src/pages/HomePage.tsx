import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Star, Flame, Zap, Code, Play } from 'lucide-react';

const learningPaths = [
  { id: 'react', title: 'React', description: 'Apprenez React et TypeScript', logo: 'https://raw.githubusercontent.com/github/explore/main/topics/react/react.png' },
  { id: 'python', title: 'Python', description: 'Apprenez les bases de Python et la programmation', logo: 'https://raw.githubusercontent.com/github/explore/main/topics/python/python.png' },
  { id: 'javascript', title: 'JavaScript', description: 'Maîtrisez JavaScript avant React', logo: 'https://raw.githubusercontent.com/github/explore/main/topics/javascript/javascript.png' },
  { id: 'fastapi', title: 'FastAPI', description: 'Construisez des APIs modernes avec FastAPI', logo: 'https://raw.githubusercontent.com/github/explore/main/topics/fastapi/fastapi.png' },
  { id: 'git', title: 'Git', description: 'Maîtrisez le contrôle de version avec Git', logo: 'https://raw.githubusercontent.com/github/explore/main/topics/git/git.png' },
];

export default function HomePage() {
  const { user, updateStreak } = useUser();
  updateStreak();

  if (!user) return null;

  return (
    <div className="page-enter">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-black uppercase mb-2">Choose your Learning Path</h1>
        <p className="text-gray-600">Start your coding journey with one of our curated paths</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {learningPaths.map((path) => {
          const isAvailable = path.id === 'react';

          return (
            <Link
              key={path.id}
              to={isAvailable ? `/learning-path/${path.id}` : '#'}
              className={`border-2 border-black p-6 relative transition-all ${isAvailable 
                ? 'bg-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal cursor-pointer' 
                : 'bg-gray-100 opacity-60 grayscale cursor-not-allowed'
              }`}
            >
              {!isAvailable && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 bg-gray-300 text-gray-600 text-[10px] font-bold uppercase tracking-wider border border-gray-400">
                    Coming Soon
                  </span>
                </div>
              )}
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={path.logo} 
                  alt={path.title} 
                  className="w-14 h-14 object-contain"
                />
                <div>
                  <h3 className="font-bold text-xl uppercase">{path.title}</h3>
                  {isAvailable && (
                    <span className="text-xs text-green-600 font-bold">Available</span>
                  )}
                </div>
              </div>
              <p className="text-sm mb-4 text-gray-600">{path.description}</p>
              {isAvailable && (
                <div className="flex items-center gap-2 text-sm font-bold text-primary-600">
                  <Play className="w-4 h-4" />
                  Start Learning
                </div>
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-4 gap-3">
        {[
          { label: 'XP', value: user.xp, icon: Star },
          { label: 'Streak', value: user.streak, icon: Flame },
          { label: 'Lessons', value: user.completedLessons.length, icon: Zap },
          { label: 'Exercises', value: user.completedExercises.length, icon: Code },
        ].map((stat) => (
          <div key={stat.label} className="border-2 border-black p-3 text-center bg-white">
            <div className="text-2xl font-black">{stat.value}</div>
            <div className="text-[10px] text-gray-500 uppercase font-bold">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
