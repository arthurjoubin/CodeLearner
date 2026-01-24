import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getLevelFromXp } from '../types';
import { Flame, Zap, FlaskConical, LogIn, LogOut, ChevronRight, Trophy, HelpCircle, Lightbulb, Menu, X } from 'lucide-react';
import { modules, lessons } from '../data/modules';

const ASCII_LOGO = `██╗  ██╗ █████╗  ██████╗██╗  ██╗██╗   ██╗██████╗ 
██║  ██║██╔══██╗██╔════╝██║ ██╔╝██║   ██║██╔══██╗
█████████║███████║██║     █████╔╝ ██║   ██║██████╔╝
██╔══██║██╔══██║██║     ██╔═██╗ ██║   ██║██╔═══╝ 
██║  ██║██║  ██║╚██████╗██║  ██╗╚██████╔╝██╗     
╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝`;

const ASCII_LOGO_SMALL = `██╗  ██╗ █████╗  ██████╗██╗  ██╗
 ██║  ██║██╔══██╗██╔════╝██║ ██╔╝
 █████████║███████║██║     █████╔╝ 
 ██╔══██║██╔══██║██║     ██╔═██╗ 
 ██║  ██║██║  ██║╚██████╗██║  ██╗
 ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝`;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, isGuest, login, logout, loading } = useUser();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [levelPopupOpen, setLevelPopupOpen] = useState(false);
  const [streakPopupOpen, setStreakPopupOpen] = useState(false);

  const { pathname } = location;

  const breadcrumbInfo = useMemo(() => {
    const pathMatch = pathname.match(/\/learning-path\/([^/?]+)/);
    if (pathMatch) {
      const pathId = pathMatch[1];
      const titles: Record<string, string> = {
        react: 'React',
        python: 'Python',
        javascript: 'JavaScript',
        fastapi: 'FastAPI',
        git: 'Git',
      };
      return { pathTitle: titles[pathId] || pathId, pathId, moduleTitle: null, lessonTitle: null };
    }

    const moduleMatch = pathname.match(/\/module\/([^/?]+)/);
    if (moduleMatch) {
      const moduleId = moduleMatch[1];
      const module = modules.find(m => m.id === moduleId);
      if (module) {
        return { pathTitle: 'React', pathId: 'react', moduleTitle: module.title, lessonTitle: null };
      }
    }

    const lessonMatch = pathname.match(/\/lesson\/([^/?]+)/);
    if (lessonMatch) {
      const lessonId = lessonMatch[1];
      const lesson = lessons.find(l => l.id === lessonId);
      if (lesson) {
        const module = modules.find(m => m.id === lesson.moduleId);
        if (module) {
          return { pathTitle: 'React', pathId: 'react', moduleTitle: module.title, lessonTitle: lesson.title };
        }
      }
    }

    return { pathTitle: null, pathId: null, moduleTitle: null, lessonTitle: null };
  }, [pathname]);

  const { pathTitle, pathId, moduleTitle, lessonTitle } = breadcrumbInfo;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const levelInfo = getLevelFromXp(user.xp);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <header className="bg-white border-b-2 border-black sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <pre className="hidden lg:block text-[8px] leading-[1] font-mono text-black whitespace-pre">{ASCII_LOGO}</pre>
              <pre className="hidden md:block lg:hidden text-[10px] leading-[1] font-mono text-black whitespace-pre">{ASCII_LOGO_SMALL}</pre>
              <div className="md:hidden w-8 h-8 bg-black flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
            </Link>

            {pathTitle && (
              <div className="flex items-center gap-1 text-xs font-bold overflow-x-auto">
                <Link to={`/learning-path/${pathId}`} className="text-primary-600 hover:underline">{pathTitle}</Link>
                {moduleTitle && (
                  <>
                    <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600 uppercase truncate">{moduleTitle}</span>
                  </>
                )}
                {lessonTitle && (
                  <>
                    <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-500 truncate">{lessonTitle}</span>
                  </>
                )}
              </div>
            )}

            <div className="flex items-center gap-1.5 sm:gap-3">
              <Link to="/labs" className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 transition-colors" title="Labs">
                <FlaskConical className="w-4 h-4" />
                <span className="text-xs font-medium hidden sm:inline">Lab</span>
              </Link>

              <div className="relative">
                <button
                  onClick={() => setStreakPopupOpen(!streakPopupOpen)}
                  className="flex items-center gap-1 bg-black text-white px-1.5 sm:px-2 py-1 text-xs font-bold"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{user.streak}</span>
                  <span className="sm:hidden">{user.streak}</span>
                </button>
                {streakPopupOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setStreakPopupOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-white border-2 border-black z-50">
                      <div className="bg-black text-white px-3 py-2 font-bold uppercase text-sm flex items-center gap-2">
                        🔥 Streak
                      </div>
                      <div className="p-3 space-y-1 text-sm">
                        <p>Daily practice keeps your streak alive.</p>
                        <p className="font-bold pt-1">XP Bonus:</p>
                        <p>7+ days: +10%</p>
                        <p>30+ days: +25%</p>
                        <p>100+ days: +50%</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setLevelPopupOpen(!levelPopupOpen)}
                  className="flex items-center gap-1 border border-black px-1.5 sm:px-2 py-1 text-xs font-bold"
                >
                  <span className="hidden sm:inline">Lv.{levelInfo.level}</span>
                  <span className="sm:hidden">Lv{levelInfo.level}</span>
                </button>
                {levelPopupOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLevelPopupOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-black z-50">
                      <div className="bg-black text-white px-3 py-2 font-bold uppercase text-sm flex items-center gap-2">
                        ⭐ Earn XP
                      </div>
                      <div className="p-2 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Lesson</span>
                          <span className="font-mono font-bold">+50</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Exercise</span>
                          <span className="font-mono font-bold">+100</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Module</span>
                          <span className="font-mono font-bold">+500</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Path</span>
                          <span className="font-mono font-bold">+2000</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-1.5 hover:bg-gray-100 transition-colors"
                  title="Menu"
                >
                  {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-black z-50">
                      <div className="py-1">
                        <Link
                          to="/leaderboard"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50"
                        >
                          <Trophy className="w-4 h-4" />
                          <span>Leaderboard</span>
                        </Link>
                        <Link
                          to="/help"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50"
                        >
                          <HelpCircle className="w-4 h-4" />
                          <span>How it works</span>
                        </Link>
                        <Link
                          to="/feedback"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50"
                        >
                          <Lightbulb className="w-4 h-4" />
                          <span>Give feedback</span>
                        </Link>
                        <hr className="my-1 border-gray-200" />
                        {isGuest ? (
                          <button
                            onClick={() => { login(); setMenuOpen(false); }}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 w-full text-left"
                          >
                            <LogIn className="w-4 h-4" />
                            <span>Log in</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => { logout(); setMenuOpen(false); }}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 w-full text-left text-red-600"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Log out</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 py-3">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-gray-400">
          HACKUP - Learn to Code by Doing
        </div>
      </footer>

    </div>
  );
}
