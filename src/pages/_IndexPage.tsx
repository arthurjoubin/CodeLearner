import { useState } from 'react';
import { useUser, UserProvider } from '../context/UserContext';
import { HomePageContent } from './_HomePage';
import { ExerciseDemo1 } from '../components/ExerciseDemo1';
import { ExerciseDemo2 } from '../components/ExerciseDemo2';
import { ExerciseDemo3 } from '../components/ExerciseDemo3';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { CoursesSection } from '../components/CoursesSection';
import { COURSE_METADATA } from '../components/CoursesSection';
import { LEARNING_PATHS, type LearningPathId } from '../data/modules';
import { SectionTitle } from '../components/PageTitle';

const demoComponents = [ExerciseDemo1, ExerciseDemo2, ExerciseDemo3];

function ExerciseDemoFlow() {
  const [currentDemo, setCurrentDemo] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleComplete = () => {
    setVisible(false);
    setTimeout(() => {
      setCurrentDemo((prev) => (prev + 1) % demoComponents.length);
      setTimeout(() => setVisible(true), 50);
    }, 500);
  };

  const Demo = demoComponents[currentDemo];

  return (
    <div className="max-w-2xl">
      <div className={`transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <Demo key={currentDemo} onComplete={handleComplete} />
      </div>
    </div>
  );
}

function LandingContent() {
  return (
    <div className="page-enter min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="py-8 md:py-12 lg:py-16 border-b-2 border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
            {/* Left side: Text content */}
            <div className="max-w-3xl flex-shrink-0">
              <div className="inline-block px-3 py-1 bg-primary-100 border border-primary-300 rounded text-xs font-bold uppercase text-primary-700 mb-3">
                Interactive Learning
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-2">
                <span className="strike-through text-gray-400">Learn to code</span>
              </h1>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-4">
                <span className="text-primary-500">Understand code.</span>
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-4 max-w-xl leading-relaxed">
                AI writes code. You need to <strong className="text-gray-900">understand</strong> it. Build real projects, get instant feedback, and learn the skills that matter in the AI era.
              </p>

              {/* Learning Paths with Course Icons */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {(Object.keys(LEARNING_PATHS) as LearningPathId[]).map((pathId) => {
                  const path = LEARNING_PATHS[pathId];
                  return (
                    <a
                      key={pathId}
                      href={`/learning-path/${pathId}`}
                      className="group inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-sm transition-all"
                    >
                      <span className="text-xs font-bold text-gray-500 uppercase">{path.name}</span>
                      <div className="flex -space-x-1">
                        {path.courses.map((courseId) => {
                          const courseMeta = COURSE_METADATA[courseId];
                          if (!courseMeta) return null;
                          return (
                            <img
                              key={courseId}
                              src={courseMeta.logo}
                              alt={courseMeta.title}
                              className="w-5 h-5 object-contain bg-white rounded border border-gray-100"
                              title={courseMeta.title}
                            />
                          );
                        })}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Right side: Animated code demo - visible on lg screens */}
            <div className="hidden lg:block flex-shrink-0 mt-12">
              <div className="w-[540px]">
                <ExerciseDemoFlow />
              </div>
            </div>
          </div>

          {/* Animated code demo - below on mobile/tablet */}
          <div className="mt-8 md:mt-10 lg:hidden">
            <ExerciseDemoFlow />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 md:py-12 lg:py-16 border-b-2 border-gray-200 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle>Why HackUp?</SectionTitle>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="border-2 border-gray-300 rounded-lg p-5 bg-white hover:border-primary-500 hover:shadow-md transition-all group">
              <h3 className="font-bold text-gray-900 mb-1">Read & Write Real Code</h3>
              <p className="text-sm text-gray-600">Every lesson includes hands-on exercises. Write and debug real code in a real editor, right in your browser.</p>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-5 bg-white hover:border-primary-500 hover:shadow-md transition-all group">
              <h3 className="font-bold text-gray-900 mb-1">AI-Powered Feedback</h3>
              <p className="text-sm text-gray-600">Get instant, intelligent feedback on your code. The AI validates your solutions and guides you toward understanding.</p>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-5 bg-white hover:border-primary-500 hover:shadow-md transition-all group">
              <h3 className="font-bold text-gray-900 mb-1">Gamified Progression</h3>
              <p className="text-sm text-gray-600">Earn XP, level up through 20 ranks, maintain daily streaks, and compete on the leaderboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <CoursesSection />
        </div>
      </section>
    </div>
  );
}

function IndexPageContent() {
  const { isGuest, loading } = useUser();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isGuest) {
    return <LandingContent />;
  }

  return <HomePageContent />;
}

export default function IndexPage() {
  return (
    <UserProvider>
      <IndexPageContent />
    </UserProvider>
  );
}
