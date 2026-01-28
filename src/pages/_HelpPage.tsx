import { BookOpen, Code2, CheckCircle2, Star, Flame } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative inline-block group mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tight">How it works</h1>
        <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary-500 transition-all group-hover:w-full duration-300" />
      </div>

      <div className="space-y-6">
        <div className="border border-gray-300 bg-white rounded-lg transition-all hover:shadow-md">
          <div className="bg-black text-white px-4 py-3 font-bold uppercase text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Lessons
          </div>
          <div className="p-4 space-y-3 bg-white">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary-600" />
              <span>Lessons contain theory and code examples</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary-600" />
              <span>Read carefully, you can go back anytime</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary-600" />
              <span>Some lessons include practical exercises</span>
            </div>
          </div>
        </div>

        <div className="border border-gray-300 bg-white rounded-lg transition-all hover:shadow-md">
          <div className="bg-black text-white px-4 py-3 font-bold uppercase text-sm flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            Exercises
          </div>
          <div className="p-4 space-y-3 bg-white">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary-600" />
              <span>Exercises are practical: you must code to complete them</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary-600" />
              <span>Use the code editor to write your solution</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary-600" />
              <span>Click "Submit" to test your code and earn XP</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary-600" />
              <span>You can retry as many times as you want</span>
            </div>
          </div>
        </div>

        <div className="border border-gray-300 bg-white rounded-lg transition-all hover:shadow-md">
          <div className="bg-black text-white px-4 py-3 font-bold uppercase text-sm flex items-center gap-2">
            <Star className="w-4 h-4" />
            Earn XP
          </div>
          <div className="p-4 space-y-3 bg-white">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold w-8 text-primary-600">+50</span>
              <span>Lesson completed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold w-8 text-primary-600">+100</span>
              <span>Exercise passed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold w-8 text-primary-600">+500</span>
              <span>Module completed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold w-8 text-primary-600">+2000</span>
              <span>Path completed</span>
            </div>
          </div>
        </div>

        <div className="border border-gray-300 bg-white rounded-lg transition-all hover:shadow-md">
          <div className="bg-black text-white px-4 py-3 font-bold uppercase text-sm flex items-center gap-2">
            <Flame className="w-4 h-4" />
            Streak
          </div>
          <div className="p-4 space-y-3 bg-white">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary-600" />
              <span>Daily practice increases your streak</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary-600" />
              <span>Higher streaks give XP bonuses</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary-600" />
              <span>Don't skip a day to keep your streak</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
