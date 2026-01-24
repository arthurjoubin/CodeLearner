import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getLab } from '../data/labs';
import { api } from '../services/api';
import Editor from '@monaco-editor/react';
import {
    ArrowLeft,
    Play,
    CheckCircle,
    Loader,
    RotateCcw,
    Sparkles,
    ChevronRight,
    Trophy,
    Maximize,
    X,
    Code2,
} from 'lucide-react';
import LivePreview from '../components/LivePreview';

export default function LabPage() {
    const { labId } = useParams<{ labId: string }>();
    const navigate = useNavigate();
    const { user, isGuest, addXp, updateLabProgress, loading } = useUser();
    const lab = labId ? getLab(labId) : undefined;

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [code, setCode] = useState(lab?.steps[0]?.starterCode || '');
    const [isValidating, setIsValidating] = useState(false);
    const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
    const [aiMessage, setAiMessage] = useState<string>('');
    const [isAskingAi, setIsAskingAi] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (!lab || !user) return;
        if (isGuest && lab.requiredLevel > 1) {
            navigate('/');
            return;
        }
        const progress = user.labProgress?.[lab.id];
        if (!progress?.unlocked && user.level < lab.requiredLevel) {
            navigate('/');
            return;
        }
        if (progress) {
            setCurrentStepIndex(progress.currentStep);
        }
    }, [lab, user, isGuest, navigate]);

    useEffect(() => {
        if (lab?.steps[currentStepIndex]) {
            setCode(lab.steps[currentStepIndex].starterCode);
            setFeedback(null);
            setAiMessage(lab.steps[currentStepIndex].aiHint);
        }
    }, [currentStepIndex, lab]);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-120px)] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!lab) {
        return (
            <div className="text-center py-12">
                <p className="text-black font-bold">Lab not found</p>
                <Link to="/labs" className="text-black underline font-bold uppercase">Go back to labs</Link>
            </div>
        );
    }

    if (!user) return null;

    const currentStep = lab.steps[currentStepIndex];
    const isLastStep = currentStepIndex === lab.steps.length - 1;

    const handleValidate = async () => {
        if (isValidating) return;

        if (isGuest) {
            setFeedback({ isCorrect: false, message: 'Sign in with GitHub to validate your code and save your progress!' });
            return;
        }

        setIsValidating(true);
        setFeedback(null);

        try {
            const result = await api.validateCode(code, {
                instructions: currentStep.instructions,
                validationPrompt: currentStep.validationPrompt,
            });

            if (result.isCorrect) {
                setFeedback({ isCorrect: true, message: result.feedback });
                if (isLastStep) {
                    addXp(lab.xpReward);
                    updateLabProgress(lab.id, currentStepIndex, true);
                }
            } else {
                setFeedback({ isCorrect: false, message: result.feedback });
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Validation failed. Check your connection.';
            setFeedback({ isCorrect: false, message });
        } finally {
            setIsValidating(false);
        }
    };

    const askAiHelp = async () => {
        if (isAskingAi) return;

        if (isGuest) {
            setAiMessage('Sign in with GitHub to get AI-powered hints!');
            return;
        }

        setIsAskingAi(true);
        try {
            const response = await api.getHint(code, { instructions: currentStep.instructions, hints: [currentStep.aiHint] }, 0);
            setAiMessage(response);
        } catch {
            setAiMessage("I'm having trouble connecting. Try focusing on the basic instructions!");
        } finally {
            setIsAskingAi(false);
        }
    };

    return (
        <div className="-my-4 min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] flex flex-col page-enter pb-4 lg:pb-0">
            {/* Lab Header */}
            <div className="flex items-center justify-between mb-2 bg-black text-white p-2 lg:p-3 border-4 border-black shadow-brutal-sm">
                <div className="flex items-center gap-2 lg:gap-4 flex-1 min-w-0">
                    <div className="relative group">
                      <Link to="/labs" className="p-1.5 lg:p-2 hover:bg-primary-500 border-2 border-white flex-shrink-0 transition-colors block">
                          <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5" />
                      </Link>
                    </div>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-sm lg:text-xl font-black uppercase tracking-tighter truncate">{lab.title}</h1>
                        <div className="flex items-center gap-2">
                            <div className="flex gap-0.5 lg:gap-1">
                                {lab.steps.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-4 lg:w-8 h-1.5 lg:h-2 border border-white ${i <= currentStepIndex ? 'bg-yellow-400' : 'bg-gray-700'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-[8px] lg:text-[10px] font-bold uppercase opacity-70 whitespace-nowrap">Step {currentStepIndex + 1}/{lab.steps.length}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
                    <div className="bg-yellow-400 text-black px-2 lg:px-3 py-1 border-2 border-black font-black text-xs lg:text-sm uppercase">
                        +{lab.xpReward} XP
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-2 lg:gap-2 overflow-auto lg:overflow-hidden min-h-0">
                {/* Sidebar: Instructions & AI Agent */}
                <div className="lg:col-span-3 flex flex-col gap-2 lg:overflow-hidden min-h-0">
                    <div className="card bg-white border-4 border-black flex-1 flex flex-col overflow-hidden shadow-brutal-sm">
                        <div className="bg-black text-white px-3 py-1.5 font-black uppercase text-[10px] tracking-[0.2em] flex-shrink-0">
                            Current Goal
                        </div>
                        <div className="flex-1 overflow-y-auto p-3">
                            <p className="font-bold text-sm leading-relaxed mb-4">{currentStep.instructions}</p>
                            <div className="border-t-2 border-dashed border-gray-300 my-3"></div>
                            <div className="flex items-center gap-2 text-primary-700 font-black uppercase text-[10px] tracking-[0.2em] mb-2">
                                <Sparkles className="w-3 h-3" />
                                <span>AI Guide</span>
                            </div>
                            <p className="text-sm font-bold text-primary-900 leading-snug">
                                {isAskingAi ? <div className="flex items-center gap-2"><Loader className="w-4 h-4 animate-spin" /> Thinking...</div> : aiMessage}
                            </p>
                        </div>
                        <button
                            onClick={askAiHelp}
                            disabled={isAskingAi}
                            className="w-full py-2 bg-primary-500 text-white font-black uppercase text-xs border-t-4 border-black hover:bg-primary-600 transition-colors"
                        >
                            {isAskingAi ? 'Thinking...' : 'Get AI Hint'}
                        </button>
                    </div>
                </div>

                {/* Center: Editor */}
                {/* Backdrop for expanded mode */}
                {isExpanded && (
                    <div
                        className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
                        onClick={() => setIsExpanded(false)}
                    />
                )}

                <div className={`${isExpanded ? 'fixed inset-8 z-50 shadow-2xl border-4 border-black flex flex-col' : 'lg:col-span-5 flex flex-col card p-0 border-4 border-black shadow-brutal min-h-[400px] lg:min-h-0'} overflow-hidden bg-gray-900`}>
                    <div className={`flex items-center justify-between px-4 py-2 border-b-2 border-black bg-black text-white ${isExpanded ? 'py-3' : ''}`}>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-yellow-400 flex items-center justify-center border border-black transform rotate-3">
                                <Code2 className="w-3.5 h-3.5 text-black" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.15em] text-gray-300 italic">Workspace / <span className="text-white not-italic">main.tsx</span></span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setCode(currentStep.starterCode)} className="p-1.5 hover:bg-gray-800 border border-gray-700 transition-all active:scale-95" title="Reset Step">
                                <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className={`p-1.5 hover:bg-gray-800 border border-gray-700 transition-all active:scale-95 flex items-center gap-1 ${isExpanded ? 'bg-red-600 hover:bg-red-700 border-red-800 text-white' : ''}`}
                                title={isExpanded ? "Close" : "Expand"}
                            >
                                {isExpanded ? (
                                    <>
                                        <X className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold uppercase">Close</span>
                                    </>
                                ) : <Maximize className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 min-h-0">
                        <Editor
                            height="100%"
                            defaultLanguage="typescript"
                            theme="vs-dark"
                            value={code}
                            onChange={(v) => setCode(v || '')}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 13,
                                padding: { top: 15 },
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                tabSize: 2,
                                lineNumbers: 'on',
                            }}
                        />
                    </div>
                    <div className="p-4 bg-gray-800 border-t-2 border-black flex gap-2">
                        <button
                            onClick={handleValidate}
                            disabled={isValidating}
                            className="flex-1 py-4 bg-yellow-400 text-black font-black uppercase border-3 border-black hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal active:translate-x-0 active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-3"
                        >
                            {isValidating ? <Loader className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                            {isValidating ? 'ANALYZING CODE...' : 'CHECK MILESTONE'}
                        </button>
                    </div>
                </div>

                {/* Right: Results */}
                <div className="lg:col-span-4 flex flex-col gap-3 lg:gap-3 lg:overflow-hidden min-h-0">
                    <div className="card flex-1 p-0 border-4 border-black overflow-hidden flex flex-col bg-white shadow-brutal-sm min-h-[250px]">
                        <div className="px-4 py-2 bg-gray-100 border-b-2 border-black font-black uppercase text-[10px] tracking-widest">Preview Window</div>
                        <div className="flex-1 bg-white overflow-auto p-4 lg:p-6">
                            <LivePreview code={code} />
                        </div>
                    </div>

                    {feedback && (
                        <div className={`card animate-pop border-4 ${feedback.isCorrect ? 'bg-green-100 border-green-600' : 'bg-red-100 border-red-600 shadow-brutal-sm'}`}>
                            <div className="flex items-start gap-3">
                                {feedback.isCorrect ? <CheckCircle className="w-8 h-8 text-green-600" /> : <Play className="w-8 h-8 text-red-600 rotate-90" />}
                                <div>
                                    <h4 className={`font-black uppercase ${feedback.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                                        {feedback.isCorrect ? 'Milestone Reached!' : 'Not Quite There'}
                                    </h4>
                                    <p className={`text-xs font-bold ${feedback.isCorrect ? 'text-green-700' : 'text-red-700'}`}>{feedback.message}</p>
                                    {feedback.isCorrect && (
                                        <div className="mt-3 flex gap-2">
                                            {!isLastStep ? (
                                                <button
                                                    onClick={() => setCurrentStepIndex(i => i + 1)}
                                                    className="px-4 py-2 bg-green-600 text-white font-black uppercase text-[10px] border-2 border-black hover:shadow-brutal-sm"
                                                >
                                                    Next Step <ChevronRight className="inline w-3 h-3" />
                                                </button>
                                            ) : (
                                                <div className="flex flex-col gap-2 w-full">
                                                    <div className="bg-yellow-400 p-2 border-2 border-black flex items-center justify-center gap-2 animate-bounce">
                                                        <Trophy className="w-4 h-4" /> <span className="font-black uppercase text-xs">Project Completed!</span>
                                                    </div>
                                                    <Link to="/" className="w-full py-2 bg-black text-white text-center font-black uppercase text-xs border-2 border-black">
                                                        Back to Home
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
