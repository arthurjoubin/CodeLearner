import { useState, useEffect } from 'react';
// Link, useParams, useNavigate replaced for Astro compatibility

import { useUser, UserProvider } from '../context/UserContext';
import { getLab } from '../data/labs';
import { api } from '../services/api';
import { CodeEditor } from '../components/CodeEditor';
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
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PageTitle } from '../components/PageTitle';

interface LabPageProps {
    labId?: string;
}

function LabPageContent({ labId }: LabPageProps) {
    const navigate = (path: string) => { window.location.href = path; };
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
        return <LoadingSpinner />;
    }

    if (!lab) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-900 font-bold">Lab not found</p>
                <a href="/labs" className="text-primary-600 underline font-bold uppercase text-xs">Go back to labs</a>
            </div>
        );
    }

    if (!user) return null;

    const currentStep = lab.steps[currentStepIndex];
    const isLastStep = currentStepIndex === lab.steps.length - 1;

    const handleValidate = async () => {
        if (isValidating) return;

        if (isGuest) {
            setFeedback({ isCorrect: false, message: 'Connecte-toi pour valider ton code et sauvegarder ta progression !' });
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
            setAiMessage('Connecte-toi pour obtenir des indices IA !');
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
        <div className="page-enter min-h-[calc(100vh-80px)] flex flex-col">
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                    <a href="/labs" className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                        <ArrowLeft className="w-4 h-4 text-gray-600" />
                    </a>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <PageTitle>
                        <h1 className="text-lg font-black text-gray-900 uppercase truncate">{lab.title}</h1>
                    </PageTitle>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs font-bold">
                        +{lab.xpReward} XP
                    </div>
                </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        {lab.steps.map((_, i) => (
                            <div
                                key={i}
                                className={`w-6 h-1.5 rounded-full transition-colors ${i <= currentStepIndex ? 'bg-primary-500' : 'bg-gray-300'}`}
                            />
                        ))}
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase">Step {currentStepIndex + 1}/{lab.steps.length}</span>
                </div>
            </div>

            <div className="flex-1 grid lg:grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                    <div className="border-2 border-gray-300 bg-white rounded-lg p-4">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Current Goal</p>
                        <p className="text-sm leading-relaxed text-gray-700">{currentStep.instructions}</p>
                    </div>

                    {isExpanded && (
                        <div
                            className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
                            onClick={() => setIsExpanded(false)}
                        />
                    )}

                    <div className={`${isExpanded ? 'fixed inset-4 lg:inset-8 z-50 bg-gray-900 shadow-2xl border-2 border-gray-300 flex flex-col' : 'border-2 border-gray-300 bg-gray-900 flex flex-col min-h-[300px] max-h-[calc(100vh-280px)]'}`}>
                        <div className={`flex items-center justify-between px-4 py-2 bg-gray-800 text-white text-sm ${isExpanded ? '' : ''}`}>
                            <span className="font-bold uppercase flex items-center gap-2">
                                <Code2 className="w-4 h-4" />
                                Editor {isExpanded && <span className="text-gray-400 font-normal normal-case ml-2">- Full Screen Mode</span>}
                            </span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setCode(currentStep.starterCode)} className="p-1.5 hover:bg-gray-700 rounded transition-colors" title="Reset">
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className={`p-1.5 hover:bg-gray-700 flex items-center gap-1.5 ${isExpanded ? 'bg-red-600 hover:bg-red-700 px-2 rounded' : ''}`}
                                    title={isExpanded ? "Close" : "Expand"}
                                >
                                    {isExpanded ? (
                                        <>
                                            <X className="w-4 h-4" />
                                            <span className="font-bold">Close</span>
                                        </>
                                    ) : <Maximize className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 min-h-0">
                            <CodeEditor
                                value={code}
                                onChange={(value) => setCode(value)}
                                language="tsx"
                                height="100%"
                            />
                        </div>
                        <div className="p-4 bg-gray-800 border-t-2 border-gray-700 flex gap-2">
                            <button
                                onClick={handleValidate}
                                disabled={isValidating}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold bg-primary-600 text-white rounded-lg border-2 border-primary-600 hover:bg-primary-700 transition-colors"
                            >
                                {isValidating ? <Loader className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                                {isValidating ? 'Checking...' : 'Validate'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="border-2 border-gray-300 bg-white rounded-lg p-4">
                        <div className="flex items-center gap-2 text-primary-700 font-bold text-xs uppercase mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>AI Guide</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-snug mb-3">
                            {isAskingAi ? (
                                <span className="flex items-center gap-2">
                                    <Loader className="w-4 h-4 animate-spin" /> Thinking...
                                </span>
                            ) : (
                                aiMessage
                            )}
                        </p>
                        <button
                            onClick={askAiHelp}
                            disabled={isAskingAi}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold bg-primary-600 text-white rounded-lg border-2 border-primary-600 hover:bg-primary-700 transition-colors w-full"
                        >
                            {isAskingAi ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            Get AI Hint
                        </button>
                    </div>

                    <div className="border-2 border-gray-300 bg-white rounded-lg flex flex-col h-[200px] lg:h-auto lg:min-h-[200px]">
                        <div className="px-4 py-2 bg-gray-100 border-b-2 border-gray-300">
                            <span className="text-sm font-bold uppercase text-gray-800">Preview</span>
                        </div>
                        <div className="flex-1 bg-white overflow-auto p-4">
                            <LivePreview code={code} />
                        </div>
                    </div>

                    {feedback && (
                        <div className={`p-4 border-2 rounded-lg ${feedback.isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                            <div className="flex items-start gap-3">
                                {feedback.isCorrect ? <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" /> : <Play className="w-5 h-5 text-red-600 rotate-90 flex-shrink-0 mt-0.5" />}
                                <div className="flex-1">
                                    <p className={`font-bold uppercase text-sm ${feedback.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                        {feedback.isCorrect ? 'Milestone Reached!' : 'Not Quite There'}
                                    </p>
                                    <p className={`text-sm ${feedback.isCorrect ? 'text-green-600' : 'text-red-600'}`}>{feedback.message}</p>
                                    {feedback.isCorrect && (
                                        <div className="mt-3">
                                            {!isLastStep ? (
                                                <button
                                                    onClick={() => setCurrentStepIndex(i => i + 1)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold bg-primary-600 text-white rounded-lg border-2 border-primary-600 hover:bg-primary-700 transition-colors"
                                                >
                                                    Next Step <ChevronRight className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <div className="flex flex-col gap-2">
                                                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-yellow-400 text-black rounded-lg border-2 border-black font-bold text-sm">
                                                        <Trophy className="w-4 h-4" />
                                                        Project Completed!
                                                    </div>
                                                    <a href="/" className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold bg-gray-900 text-white rounded-lg border-2 border-gray-900 hover:bg-gray-800 transition-colors">
                                                        Back to Home
                                                    </a>
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

export default function LabPage(props: LabPageProps) {
    return (
        <UserProvider>
            <LabPageContent {...props} />
        </UserProvider>
    );
}
