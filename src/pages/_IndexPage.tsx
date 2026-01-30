import { useState } from 'react';
import { useUser, UserProvider } from '../context/UserContext';
import { HomePageContent } from './_HomePage';
import { ExerciseDemo1 } from '../components/ExerciseDemo1';
import { ExerciseDemo2 } from '../components/ExerciseDemo2';
import { ExerciseDemo3 } from '../components/ExerciseDemo3';

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
    <div className="page-enter -mx-3 -mt-4">
      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-14 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-block px-3 py-1 bg-primary-100 border border-primary-300 rounded text-xs font-bold uppercase text-primary-700 mb-5">
              Free &amp; Open Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-5">
              Learn to code<br />
              <span className="text-primary-500">by doing.</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
              No videos. No passive tutorials. Write real code from lesson one, get instant AI feedback, and track your progression.
            </p>
          </div>

          {/* Animated code demo */}
          <div className="mt-16 md:mt-20">
            <ExerciseDemoFlow />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-16 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative inline-block group mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Why HackUp?</h2>
            <span className="absolute -bottom-1 left-0 w-12 h-1 bg-primary-500 transition-all group-hover:w-full duration-300" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="border-2 border-gray-300 rounded-lg p-5 bg-white hover:border-primary-500 hover:shadow-md transition-all group">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary-500 transition-colors">
                <svg className="w-5 h-5 text-primary-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Code from Day One</h3>
              <p className="text-sm text-gray-600">Every lesson includes hands-on exercises. Write real code in a real editor, right in your browser.</p>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-5 bg-white hover:border-primary-500 hover:shadow-md transition-all group">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary-500 transition-colors">
                <svg className="w-5 h-5 text-primary-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">AI-Powered Feedback</h3>
              <p className="text-sm text-gray-600">Get instant, intelligent feedback on your code. The AI validates your solutions and guides you.</p>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-5 bg-white hover:border-primary-500 hover:shadow-md transition-all group">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary-500 transition-colors">
                <svg className="w-5 h-5 text-primary-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Gamified Progression</h3>
              <p className="text-sm text-gray-600">Earn XP, level up through 20 ranks, maintain daily streaks, and compete on the leaderboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-12 md:py-16 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative inline-block group mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Learning Paths</h2>
            <span className="absolute -bottom-1 left-0 w-12 h-1 bg-primary-500 transition-all group-hover:w-full duration-300" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="/learning-path/web-stack" className="border-2 border-gray-300 rounded-lg p-5 bg-white hover:border-primary-500 hover:shadow-md transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <img src="https://raw.githubusercontent.com/github/explore/main/topics/terminal/terminal.png" alt="Web Stack" className="w-8 h-8 object-contain" />
                <h3 className="font-bold text-sm uppercase text-gray-900 group-hover:text-primary-700 transition-colors">Vibecoder Basis</h3>
              </div>
              <p className="text-xs text-gray-600 mb-3">Understand the full web development ecosystem.</p>
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase bg-green-100 text-green-700 border border-green-300 rounded">Beginner</span>
            </a>

            <a href="/learning-path/react" className="border-2 border-gray-300 rounded-lg p-5 bg-white hover:border-primary-500 hover:shadow-md transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <img src="https://raw.githubusercontent.com/github/explore/main/topics/react/react.png" alt="React" className="w-8 h-8 object-contain" />
                <h3 className="font-bold text-sm uppercase text-gray-900 group-hover:text-primary-700 transition-colors">React</h3>
              </div>
              <p className="text-xs text-gray-600 mb-3">Learn React and TypeScript from scratch.</p>
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase bg-yellow-100 text-yellow-700 border border-yellow-300 rounded">Intermediate</span>
            </a>

            <div className="border-2 border-gray-200 rounded-lg p-5 bg-gray-50 opacity-60">
              <div className="flex items-center gap-3 mb-3">
                <img src="https://raw.githubusercontent.com/github/explore/main/topics/fastapi/fastapi.png" alt="FastAPI" className="w-8 h-8 object-contain grayscale" />
                <h3 className="font-bold text-sm uppercase text-gray-500">FastAPI</h3>
              </div>
              <p className="text-xs text-gray-500 mb-3">Build modern APIs with FastAPI.</p>
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase bg-gray-200 text-gray-500 border border-gray-300 rounded">Coming Soon</span>
            </div>

            <div className="border-2 border-gray-200 rounded-lg p-5 bg-gray-50 opacity-60">
              <div className="flex items-center gap-3 mb-3">
                <img src="https://raw.githubusercontent.com/github/explore/main/topics/git/git.png" alt="Git" className="w-8 h-8 object-contain grayscale" />
                <h3 className="font-bold text-sm uppercase text-gray-500">Git</h3>
              </div>
              <p className="text-xs text-gray-500 mb-3">Master version control with Git.</p>
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase bg-gray-200 text-gray-500 border border-gray-300 rounded">Coming Soon</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function IndexPageContent() {
  const { isGuest, loading } = useUser();

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
