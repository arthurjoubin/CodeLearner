import { useUser } from '../context/UserContext';
import { labs } from '../data/labs';
import { Link } from 'react-router-dom';
import { FlaskConical, Lock, ChevronRight, CheckCircle, Star } from 'lucide-react';

export default function LabsSelectionPage() {
    const { user } = useUser();

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto page-enter">
            <header className="mb-12">
                <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 text-black italic">
                    Project <span className="text-primary-500 bg-black text-white px-3 not-italic">Labs</span>
                </h1>
                <p className="text-xl font-bold text-gray-600 leading-tight max-w-2xl">
                    Apply your React skills in advanced, guided projects. Real-world scenarios, complex layouts, and AI assistance.
                </p>
            </header>

            <div className="grid gap-8">
                {labs.map((lab, index) => {
                    const isLocked = user.level < lab.requiredLevel;
                    const status = user.labProgress?.[lab.id];
                    const isCompleted = status?.completed;

                    return (
                        <div
                            key={lab.id}
                            className={`relative card-interactive flex flex-col md:flex-row gap-6 p-8 border-4 border-black overflow-hidden ${isLocked ? 'card-locked' : isCompleted ? 'bg-primary-50 border-primary-500' : 'bg-white'
                                }`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Lock Overlay */}
                            {isLocked && (
                                <div className="lock-overlay flex-row gap-4">
                                    <Lock className="w-12 h-12 text-gray-400" />
                                    <div className="text-left">
                                        <span className="bg-black text-white text-xs font-black px-3 py-1 uppercase tracking-widest block mb-1">
                                            ACCESS DENIED
                                        </span>
                                        <span className="text-gray-500 font-bold text-sm uppercase text-white">
                                            Reach Level {lab.requiredLevel} to unlock
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Left Column: Icon */}
                            <div className={`w-20 h-20 md:w-24 md:h-24 flex-shrink-0 flex items-center justify-center border-4 border-black shadow-brutal-sm ${isLocked ? 'bg-gray-200' : isCompleted ? 'bg-primary-500 text-white' : 'bg-yellow-400'
                                }`}>
                                {isLocked ? <Lock className="w-10 h-10" /> : <FlaskConical className="w-10 h-10" />}
                            </div>

                            {/* Right Column: Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-xs font-black uppercase tracking-widest bg-black text-white px-2 py-0.5">Lab 0{index + 1}</span>
                                    {isCompleted && (
                                        <span className="flex items-center gap-1 text-[10px] font-black text-primary-600 uppercase">
                                            <CheckCircle className="w-3 h-3" /> Mastered
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-2xl font-black uppercase mb-2">{lab.title}</h2>
                                <p className="text-gray-600 font-bold text-sm mb-4 leading-relaxed">{lab.description}</p>

                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 border-2 border-black font-black text-[10px] uppercase">
                                        Requires Level {lab.requiredLevel}
                                    </div>
                                    <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 border-2 border-yellow-600 text-yellow-800 font-black text-[10px] uppercase">
                                        <Star className="w-3 h-3 fill-current" /> {lab.xpReward} XP
                                    </div>
                                </div>
                            </div>

                            {/* Action */}
                            <div className="flex items-center">
                                {!isLocked ? (
                                    <Link
                                        to={`/labs/${lab.id}`}
                                        className="btn-primary flex items-center justify-center gap-2 px-8 py-4 whitespace-nowrap"
                                    >
                                        {isCompleted ? 'Replay Lab' : 'Start Lab'} <ChevronRight className="w-5 h-5" />
                                    </Link>
                                ) : (
                                    <div className="text-xs font-black uppercase text-red-600 flex items-center gap-1 bg-red-50 border-2 border-red-600 px-4 py-2">
                                        Lvl {lab.requiredLevel} required
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
