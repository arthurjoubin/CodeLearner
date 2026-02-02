import { useState } from 'react';
import { useUser, UserProvider } from '../context/UserContext';
import { HomePageContent } from './_HomePage';
import { ExerciseDemo1 } from '../components/ExerciseDemo1';
import { ExerciseDemo2 } from '../components/ExerciseDemo2';
import { ExerciseDemo3 } from '../components/ExerciseDemo3';
import { LearningPathCard } from '../components/LearningPathCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

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
      <section className="pt-2 pb-4">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-block px-3 py-1 bg-primary-100 border border-primary-300 rounded text-xs font-bold uppercase text-primary-700 mb-2">
              Interactive Learning
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
              Learn to code<br />
              <span className="text-primary-500">by doing.</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-4 max-w-xl leading-relaxed">
              No videos. No passive tutorials. Write real code from lesson one, get instant AI feedback, and track your progression.
            </p>

            {/* Course Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <a href="/learning-path/web-stack" className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-full hover:border-primary-500 hover:shadow-sm transition-all">
                <img src="https://raw.githubusercontent.com/github/explore/main/topics/terminal/terminal.png" alt="Vibecoder Basis" className="w-4 h-4 object-contain" />
                <span className="text-xs font-medium text-gray-700">Vibecoder Basis</span>
              </a>
              <a href="/learning-path/react" className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-full hover:border-primary-500 hover:shadow-sm transition-all">
                <img src="https://raw.githubusercontent.com/github/explore/main/topics/react/react.png" alt="React" className="w-4 h-4 object-contain" />
                <span className="text-xs font-medium text-gray-700">React</span>
              </a>
              <a href="/learning-path/git" className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-full hover:border-primary-500 hover:shadow-sm transition-all">
                <img src="https://raw.githubusercontent.com/github/explore/main/topics/git/git.png" alt="Git" className="w-4 h-4 object-contain" />
                <span className="text-xs font-medium text-gray-700">Git</span>
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
      <section className="py-8 md:py-10 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle>Why HackUp?</SectionTitle>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="border-2 border-gray-300 rounded-lg p-5 bg-white hover:border-primary-500 hover:shadow-md transition-all group">
              <h3 className="font-bold text-gray-900 mb-1">Code from Day One</h3>
              <p className="text-sm text-gray-600">Every lesson includes hands-on exercises. Write real code in a real editor, right in your browser.</p>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-5 bg-white hover:border-primary-500 hover:shadow-md transition-all group">
              <h3 className="font-bold text-gray-900 mb-1">AI-Powered Feedback</h3>
              <p className="text-sm text-gray-600">Get instant, intelligent feedback on your code. The AI validates your solutions and guides you.</p>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-5 bg-white hover:border-primary-500 hover:shadow-md transition-all group">
              <h3 className="font-bold text-gray-900 mb-1">Gamified Progression</h3>
              <p className="text-sm text-gray-600">Earn XP, level up through 20 ranks, maintain daily streaks, and compete on the leaderboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-8 md:py-10 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle>Learning Paths</SectionTitle>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <LearningPathCard
              id="web-stack"
              title="Vibecoder Basis"
              description="Understand the full web development ecosystem."
              logo="https://raw.githubusercontent.com/github/explore/main/topics/terminal/terminal.png"
              difficulty="beginner"
              modules={20}
              hours="40 hours"
            />
            <LearningPathCard
              id="git"
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
