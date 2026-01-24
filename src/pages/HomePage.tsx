import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { BookOpen, Gamepad2, Zap } from 'lucide-react';

const learningPaths = [
  { id: 'react', title: 'React', description: 'Apprenez React et TypeScript', logo: 'https://raw.githubusercontent.com/github/explore/main/topics/react/react.png' },
  { id: 'python', title: 'Python', description: 'Apprenez les bases de Python et la programmation', logo: 'https://raw.githubusercontent.com/github/explore/main/topics/python/python.png' },
  { id: 'fastapi', title: 'FastAPI', description: 'Construisez des APIs modernes avec FastAPI', logo: 'https://raw.githubusercontent.com/github/explore/main/topics/fastapi/fastapi.png' },
  { id: 'git', title: 'Git', description: 'Maîtrisez le contrôle de version avec Git', logo: 'https://raw.githubusercontent.com/github/explore/main/topics/git/git.png' },
];

export default function HomePage() {
  const { user, updateStreak } = useUser();
  updateStreak();

  if (!user) return null;

  return (
    <div className="page-enter">
      <div className="bg-yellow-50 border-2 border-black p-4 mb-6">
        <h2 className="font-black text-lg uppercase mb-3">Our Method</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-5 h-5 text-primary-600" />
              <span className="font-bold text-primary-600">Learn by Doing</span>
            </div>
            <p className="text-gray-600">Theory meets practice. Every lesson combines concepts with hands-on exercises.</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Gamepad2 className="w-5 h-5 text-primary-600" />
              <span className="font-bold text-primary-600">Gamification</span>
            </div>
            <p className="text-gray-600">Earn XP, level up, keep your streak. Learning becomes a game you want to win.</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-primary-600" />
              <span className="font-bold text-primary-600">Stay Active</span>
            </div>
            <p className="text-gray-600">No passive watching. You code, you test, you learn by taking action.</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-black uppercase mb-2">Choose your Learning Path</h1>
        <p className="text-gray-600">Start your coding journey with one of our curated paths</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide p-1">
        {learningPaths.map((path) => {
          const isAvailable = path.id === 'react';

          return (
            <Link
              key={path.id}
              to={isAvailable ? `/learning-path/${path.id}` : '#'}
              className={`border-2 border-black p-3 relative transition-all flex-shrink-0 w-48 ${isAvailable 
                ? 'bg-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal cursor-pointer' 
                : 'bg-gray-100 opacity-60 grayscale cursor-not-allowed'
              }`}
            >
              {!isAvailable && (
                <div className="absolute top-1.5 right-1.5">
                  <span className="px-1.5 py-0.5 bg-gray-300 text-gray-600 text-[8px] font-bold uppercase tracking-wider border border-gray-400">
                    Soon
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 mb-1.5">
                <img 
                  src={path.logo} 
                  alt={path.title} 
                  className="w-6 h-6 object-contain"
                />
                <div>
                  <h3 className="font-bold text-sm uppercase">{path.title}</h3>
                  {isAvailable && (
                    <span className="text-[8px] text-green-600 font-bold">Available</span>
                  )}
                </div>
              </div>
              <p className="text-[9px] mb-1 text-gray-600 line-clamp-2">{path.description}</p>
              {isAvailable && (
                <span className="text-[9px] font-bold text-primary-600">Start →</span>
              )}
            </Link>
          );
        })}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
