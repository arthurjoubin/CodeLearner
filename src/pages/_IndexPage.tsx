import { useState } from 'react';
import { useUser, UserProvider } from '../context/UserContext';
import { HomePageContent } from './_HomePage';
import { ExerciseDemo1 } from '../components/ExerciseDemo1';
import { ExerciseDemo2 } from '../components/ExerciseDemo2';
import { ExerciseDemo3 } from '../components/ExerciseDemo3';
import { LearningPathCard } from '../components/LearningPathCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SectionTitle } from '../components/PageTitle';
import { TargetArrowWobble, TargetPulse, ArrowScatter, ArrowStrike, TargetBrutal } from '../components/TargetSvgVariations';

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

          {/* === VARIATION 1: TargetArrowWobble === */}
          {/* Cible avec flèche plantée dans le mille, wobble animé */}
          <TargetArrowWobble className="hidden md:block w-32 lg:w-40 xl:w-48 flex-shrink-0 mt-6 drop-shadow-lg" />
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
          <div className="flex items-center gap-3 mb-6">
            {/* === VARIATION 2: TargetPulse === */}
            {/* Mini cible avec centre vert qui pulse */}
            <TargetPulse className="w-8 h-8 flex-shrink-0" />
            <SectionTitle className="!mb-0">Why HackUp?</SectionTitle>
          </div>

          <div className="relative grid md:grid-cols-3 gap-4">
            {/* === VARIATION 3: ArrowScatter === */}
            {/* Cluster de flèches + mini cibles flottantes en fond */}
            <ArrowScatter className="absolute -top-6 right-0 w-64 opacity-[0.08] pointer-events-none hidden lg:block" />
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

      {/* === VARIATION 4: ArrowStrike === */}
      {/* Flèche animée qui vole et frappe la cible - divider entre sections */}
      <div className="flex justify-center py-4">
        <ArrowStrike className="w-56 md:w-72 h-auto" />
      </div>

      {/* Learning Paths */}
      <section className="py-8 md:py-10 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4 relative">
          {/* === VARIATION 5: TargetBrutal === */}
          {/* Style néo-brutaliste avec shadow offset et sparkles */}
          <TargetBrutal className="absolute -top-4 -right-2 w-28 lg:w-36 opacity-[0.12] pointer-events-none hidden md:block" />

          <SectionTitle className="mb-6">Learning Paths</SectionTitle>

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
