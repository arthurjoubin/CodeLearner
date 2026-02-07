import { useState, useEffect } from 'react';
// Link will be replaced by standard anchor tags for Astro compatibility

import { useUser, UserProvider } from '../context/UserContext';
import { getLevelFromXp, getXpProgress } from '../types';
import { Flame, FlaskConical, Trophy, Lightbulb, Menu, X, LogOut, BookOpen, Tag, Github, Twitter, Mail, CreditCard } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

// Wrapped in internal component to allow usage of useUser in the parent
function LayoutContent({ children }: LayoutProps) {
  const { user, isGuest, logout, loading } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [levelPopupOpen, setLevelPopupOpen] = useState(false);
  const [streakPopupOpen, setStreakPopupOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

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

  const levelInfo = getLevelFromXp(user.xp);

  return (
    <div className="min-h-screen flex flex-col relative">
      <header className="bg-white border-b border-gray-300 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <span className="text-2xl font-bold tracking-widest text-gray-900">HACK<span className="text-primary-500">UP</span></span>
                <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-primary-500 transition-all group-hover:w-full duration-300" />
              </div>
            </a>

            {isGuest ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <a
                  href="/learning-path"
                  className={`hidden sm:block relative px-3 py-2 text-sm font-bold uppercase rounded-lg transition-colors ${
                    (currentPath.startsWith('/learning-path') || currentPath.startsWith('/module') || currentPath.startsWith('/lesson') || currentPath.startsWith('/exercise') || currentPath.startsWith('/quiz'))
                      ? 'text-primary-600 border border-primary-500 bg-primary-50'
                      : 'text-gray-700 border border-gray-300 hover:border-gray-400 hover:text-gray-900'
                  }`}
                >
                  Learning Paths
                </a>
                <a
                  href="/resources"
                  className={`hidden sm:block relative px-3 py-2 text-sm font-bold uppercase rounded-lg transition-colors ${
                    (currentPath.startsWith('/resources') || currentPath.startsWith('/lab'))
                      ? 'text-primary-600 border border-primary-500 bg-primary-50'
                      : 'text-gray-700 border border-gray-300 hover:border-gray-400 hover:text-gray-900'
                  }`}
                >
                  Resources
                </a>
                <a
                  href="/pricing"
                  className={`hidden sm:block relative px-3 py-2 text-sm font-bold uppercase rounded-lg transition-colors ${
                    currentPath === '/pricing'
                      ? 'text-primary-600 border border-primary-500 bg-primary-50'
                      : 'text-gray-700 border border-gray-300 hover:border-gray-400 hover:text-gray-900'
                  }`}
                >
                  Pricing
                </a>
                <a
                  href="/login"
                  className="flex items-center gap-1 bg-gray-900 text-white px-4 py-2 text-sm font-bold hover:bg-gray-700 transition-colors rounded-lg"
                >
                  Login
                </a>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="sm:hidden p-2.5 hover:bg-gray-100 border border-transparent hover:border-gray-300 transition-colors rounded-lg"
                  title="Menu"
                >
                  {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 bg-black/30 z-40 sm:hidden" onClick={() => setMenuOpen(false)} />
                    <div className="fixed inset-x-0 top-0 z-50 bg-white border-b-2 border-gray-200 sm:hidden animate-slide-down">
                      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <span className="text-xl font-bold tracking-widest text-gray-900">HACK<span className="text-primary-500">UP</span></span>
                        <button onClick={() => setMenuOpen(false)} className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors">
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                      <nav className="px-3 py-3 space-y-1">
                        <a
                          href="/learning-path"
                          onClick={() => setMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-4 rounded-xl text-base font-bold transition-colors ${
                            currentPath.startsWith('/learning-path') ? 'bg-primary-50 text-primary-700' : 'text-gray-800 hover:bg-gray-50 active:bg-gray-100'
                          }`}
                        >
                          <Lightbulb className="w-5 h-5" /> Learning Paths
                        </a>
                        <a
                          href="/resources"
                          onClick={() => setMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-4 rounded-xl text-base font-bold transition-colors ${
                            currentPath.startsWith('/resources') ? 'bg-primary-50 text-primary-700' : 'text-gray-800 hover:bg-gray-50 active:bg-gray-100'
                          }`}
                        >
                          <BookOpen className="w-5 h-5" /> Resources
                        </a>
                        <a
                          href="/pricing"
                          onClick={() => setMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-4 rounded-xl text-base font-bold transition-colors ${
                            currentPath === '/pricing' ? 'bg-primary-50 text-primary-700' : 'text-gray-800 hover:bg-gray-50 active:bg-gray-100'
                          }`}
                        >
                          <CreditCard className="w-5 h-5" /> Pricing
                        </a>
                      </nav>
                      <div className="px-5 py-4 border-t border-gray-100">
                        <a
                          href="/login"
                          onClick={() => setMenuOpen(false)}
                          className="block w-full text-center bg-gray-900 text-white px-4 py-3.5 text-base font-bold hover:bg-gray-700 transition-colors rounded-xl"
                        >
                          Login
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <a href="/labs" className="flex items-center gap-1.5 px-3 py-2 border border-transparent hover:border-gray-300 rounded transition-colors group" title="Labs">
                <FlaskConical className="w-5 h-5 text-gray-600 group-hover:text-primary-600 transition-colors" />
                <span className="text-sm font-bold hidden sm:inline text-gray-700 group-hover:text-primary-600 transition-colors uppercase">Lab</span>
              </a>

              <div className="relative">
                <button
                  onClick={() => setStreakPopupOpen(!streakPopupOpen)}
                  className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-2 text-sm font-bold hover:bg-gray-700 transition-colors rounded"
                >
                  <Flame className="w-5 h-5" />
                  <span>{user.streak}</span>
                </button>
                {streakPopupOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setStreakPopupOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-gray-300 rounded-lg z-50 overflow-hidden">
                      <div className="flex items-center gap-2 px-3 py-2 border-b-2 border-gray-200">
                        <Flame className="w-4 h-4 text-primary-500" />
                        <span className="font-bold uppercase text-xs text-gray-900">Streak</span>
                        <span className="ml-auto text-primary-600 font-bold">{user.streak} days</span>
                      </div>
                      <div className="p-3 space-y-2 text-xs">
                        <p className="text-gray-600">Daily practice keeps your streak alive.</p>
                        <div className="pt-1 space-y-1">
                          <p className="font-bold uppercase text-gray-900 text-[10px]">XP Bonus</p>
                          <div className="flex justify-between text-gray-700">
                            <span>7+ days</span>
                            <span className="text-primary-600 font-mono font-bold">+10%</span>
                          </div>
                          <div className="flex justify-between text-gray-700">
                            <span>30+ days</span>
                            <span className="text-primary-600 font-mono font-bold">+25%</span>
                          </div>
                          <div className="flex justify-between text-gray-700">
                            <span>100+ days</span>
                            <span className="text-primary-600 font-mono font-bold">+50%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setLevelPopupOpen(!levelPopupOpen)}
                  className="flex items-center gap-1.5 border border-gray-300 px-3 py-2 text-sm font-bold hover:bg-gray-900 hover:text-white transition-colors rounded bg-white"
                >
                  <span className="hidden sm:inline text-xs text-gray-500 uppercase">{levelInfo.title}</span>
                  <span>Lvl {levelInfo.level}</span>
                </button>
                {levelPopupOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLevelPopupOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-white border-2 border-gray-300 rounded-lg z-50 overflow-hidden">
                      <div className="flex items-center gap-2 px-3 py-2 border-b-2 border-gray-200">
                        <div className="w-2 h-2 bg-primary-500 rounded-full" />
                        <span className="font-bold uppercase text-xs text-gray-900">{levelInfo.title}</span>
                        <span className="ml-auto text-primary-600 font-bold text-xs">{user.xp} XP</span>
                      </div>
                      <div className="p-3 space-y-2 text-xs">
                        {user.recentXp > 0 && (
                          <div className="bg-primary-50 border-2 border-primary-200 rounded px-3 py-2">
                            <div className="text-primary-700 font-bold uppercase text-[10px]">Recent Session</div>
                            <div className="text-primary-600 font-bold">+{user.recentXp} XP</div>
                          </div>
                        )}
                        <div className="space-y-1">
                          <p className="font-bold uppercase text-gray-900 text-[10px]">XP Rewards</p>
                          <div className="flex justify-between text-gray-700">
                            <span>Lesson</span>
                            <span className="font-mono font-bold text-primary-600">+100</span>
                          </div>
                          <div className="flex justify-between text-gray-700">
                            <span>Module</span>
                            <span className="font-mono font-bold text-primary-600">+500</span>
                          </div>
                          <div className="flex justify-between text-gray-700">
                            <span>Learning Path</span>
                            <span className="font-mono font-bold text-primary-600">+2000</span>
                          </div>
                        </div>
                        <div className="border-t-2 border-gray-200 pt-2">
                          {levelInfo.maxXp !== Infinity && (
                            <div>
                              <div className="flex justify-between text-[10px] text-gray-500 mb-1 uppercase font-bold">
                                <span>Lvl {levelInfo.level}</span>
                                <span>Lvl {levelInfo.level + 1}</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary-500 rounded-full transition-all duration-300"
                                  style={{ width: `${getXpProgress(user.xp)}%` }}
                                />
                              </div>
                              <div className="text-center mt-1">
                                <span className="text-[10px] text-gray-500">{levelInfo.maxXp - user.xp} XP to next level</span>
                              </div>
                            </div>
                          )}
                          {levelInfo.maxXp === Infinity && (
                            <div className="text-center">
                              <span className="text-[10px] text-gray-500">Max level reached!</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 hover:bg-gray-100 border border-transparent hover:border-gray-300 transition-colors rounded"
                  title="Menu"
                >
                  {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                {menuOpen && (
                  <>
                    <div className="fixed inset-0 bg-black/30 z-40 sm:bg-transparent" onClick={() => setMenuOpen(false)} />
                    <div className="fixed inset-x-0 top-0 z-50 bg-white border-b-2 border-gray-200 sm:absolute sm:inset-x-auto sm:top-auto sm:right-0 sm:mt-2 sm:w-56 sm:border sm:border-gray-300 sm:rounded-lg sm:fixed-auto animate-slide-down sm:animate-none">
                      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sm:hidden">
                        <span className="text-xl font-bold tracking-widest text-gray-900">HACK<span className="text-primary-500">UP</span></span>
                        <button onClick={() => setMenuOpen(false)} className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors">
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                      <nav className="px-3 py-3 sm:px-0 sm:py-1 space-y-1 sm:space-y-0">
                        <a
                          href="/leaderboard"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-4 sm:py-2.5 rounded-xl sm:rounded-none text-base sm:text-sm font-bold sm:font-normal text-gray-800 sm:text-gray-700 hover:bg-gray-50 sm:hover:bg-gray-100 transition-colors"
                        >
                          <Trophy className="w-5 h-5 sm:w-4 sm:h-4" /> Leaderboard
                        </a>
                        <a
                          href="/learning-path"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-4 sm:py-2.5 rounded-xl sm:rounded-none text-base sm:text-sm font-bold sm:font-normal text-gray-800 sm:text-gray-700 hover:bg-gray-50 sm:hover:bg-gray-100 transition-colors"
                        >
                          <Lightbulb className="w-5 h-5 sm:w-4 sm:h-4" /> Learning Paths
                        </a>
                        <a
                          href="/resources"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-4 sm:py-2.5 rounded-xl sm:rounded-none text-base sm:text-sm font-bold sm:font-normal text-gray-800 sm:text-gray-700 hover:bg-gray-50 sm:hover:bg-gray-100 transition-colors"
                        >
                          <BookOpen className="w-5 h-5 sm:w-4 sm:h-4" /> Resources
                        </a>
                        <a
                          href="/resources/devfinds"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-4 sm:py-2.5 rounded-xl sm:rounded-none text-base sm:text-sm font-bold sm:font-normal text-yellow-700 hover:bg-yellow-50 transition-colors"
                        >
                          <Tag className="w-5 h-5 sm:w-4 sm:h-4" /> Dev Finds
                        </a>
                      </nav>
                      <div className="px-3 py-3 sm:px-0 sm:py-1 border-t border-gray-200 sm:border-gray-200">
                        <button
                          onClick={() => { logout(); setMenuOpen(false); }}
                          className="flex items-center gap-3 w-full px-4 py-4 sm:py-2.5 rounded-xl sm:rounded-none text-base sm:text-sm font-bold sm:font-normal text-gray-800 sm:text-gray-700 hover:bg-gray-50 sm:hover:bg-gray-100 text-left transition-colors"
                        >
                          <LogOut className="w-5 h-5 sm:w-4 sm:h-4" /> Log out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-3 pt-4 w-full">
        {children}
      </main>

      <footer className="border-t border-gray-300 mt-auto">
        <div className="max-w-6xl mx-auto px-3 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-widest text-gray-900">HACK<span className="text-primary-500">UP</span></span>
              <span className="text-xs text-gray-500">© 2025</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/resources" className="text-xs font-bold text-gray-600 hover:text-primary-600 transition-colors uppercase">Resources</a>
              <a href="/pricing" className="text-xs font-bold text-gray-600 hover:text-primary-600 transition-colors uppercase">Pricing</a>
              <a href="/resources/devfinds" className="text-xs font-bold text-yellow-600 hover:text-yellow-700 transition-colors uppercase">Dev Finds</a>
              <a href="/leaderboard" className="text-xs font-bold text-gray-600 hover:text-primary-600 transition-colors uppercase">Leaderboard</a>
              <a href="/labs" className="text-xs font-bold text-gray-600 hover:text-primary-600 transition-colors uppercase">Labs</a>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="mailto:hello@hackup.dev" className="text-gray-500 hover:text-gray-900 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-[10px] text-gray-500 uppercase font-bold">Understand code___one day at a time</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Layout({ children }: LayoutProps) {
  return (
    <UserProvider>
      <LayoutContent>{children}</LayoutContent>
    </UserProvider>
  );
}
