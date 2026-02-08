import { useState } from 'react';
import { useUser, UserProvider } from '../context/UserContext';
import { HomePageContent } from './_HomePage';
import { ExerciseDemo1 } from '../components/ExerciseDemo1';
import { ExerciseDemo2 } from '../components/ExerciseDemo2';
import { ExerciseDemo3 } from '../components/ExerciseDemo3';
import { LearningPathCard } from '../components/LearningPathCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Clock } from 'lucide-react';

import { SectionTitle } from '../components/PageTitle';
import { getTotalContentHours, formatHours } from '../utils/estimateHours';

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
          <div className="flex items-start justify-between gap-4">
          <div className="max-w-3xl">
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

            {/* Course Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <a href="/learning-path/web-fundamentals" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full hover:border-primary-500 hover:shadow-sm transition-all">
                <img src="https://raw.githubusercontent.com/github/explore/main/topics/terminal/terminal.png" alt="Vibecoder Basis" className="w-5 h-5 object-contain" />
                <span className="text-sm font-medium text-gray-700">Vibecoder Basis</span>
              </a>
              <a href="/learning-path/frontend" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full hover:border-primary-500 hover:shadow-sm transition-all">
                <img src="https://raw.githubusercontent.com/github/explore/main/topics/react/react.png" alt="React" className="w-5 h-5 object-contain" />
                <span className="text-sm font-medium text-gray-700">Frontend</span>
              </a>
              <a href="/learning-path/web-fundamentals" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full hover:border-primary-500 hover:shadow-sm transition-all">
                <img src="https://raw.githubusercontent.com/github/explore/main/topics/git/git.png" alt="Git" className="w-5 h-5 object-contain" />
                <span className="text-sm font-medium text-gray-700">Git</span>
              </a>
            </div>
          </div>
          </div>

          {/* Animated code demo */}
          <div className="mt-8 md:mt-10">
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
          <div className="flex items-end justify-between mb-4">
            <SectionTitle>Learning Paths</SectionTitle>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-lg">
              <Clock className="w-5 h-5 text-primary-600" />
              <span className="font-semibold text-primary-700">{formatHours(getTotalContentHours())} of learning</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <LearningPathCard
              id="web-fundamentals"
              title="Vibecoder Basis"
              description="Understand the full web development ecosystem."
              logo="https://raw.githubusercontent.com/github/explore/main/topics/terminal/terminal.png"
              difficulty="beginner"
              modules={20}
              hours="40 hours"
            />
            <LearningPathCard
              id="web-fundamentals"
              title="Git"
              description="Master version control with Git."
              logo="https://raw.githubusercontent.com/github/explore/main/topics/git/git.png"
              difficulty="beginner"
              modules={7}
              hours="20 hours"
            />
            <LearningPathCard
              id="react"
              title="React"
              description="Learn React and TypeScript from scratch."
              logo="https://raw.githubusercontent.com/github/explore/main/topics/react/react.png"
              difficulty="medium"
              modules={13}
              hours="35 hours"
            />
            <LearningPathCard
              id="fastapi"
              title="FastAPI"
              description="Build modern APIs with FastAPI."
              logo="https://raw.githubusercontent.com/github/explore/main/topics/fastapi/fastapi.png"
              comingSoon
            />
            <LearningPathCard
              id="go"
              title="Go"
              description="Learn Go programming language."
              logo="https://raw.githubusercontent.com/github/explore/main/topics/go/go.png"
              comingSoon
            />
            <LearningPathCard
              id="python"
              title="Python"
              description="Learn Python programming language."
              logo="https://raw.githubusercontent.com/github/explore/main/topics/python/python.png"
              comingSoon
            />
          </div>
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
