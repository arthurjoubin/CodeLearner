import { Lightbulb } from 'lucide-react';

export default function FeedbackPage() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="relative inline-block group mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tight">Feedback</h1>
        <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary-500 transition-all group-hover:w-full duration-300" />
      </div>

      <div className="border-2 border-black mb-6 bg-white transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutal-sm">
        <div className="bg-primary-500 px-4 py-3 font-bold uppercase text-sm flex items-center gap-2 text-white">
          <Lightbulb className="w-4 h-4" />
          Give feedback!
        </div>
        <div className="p-4 bg-white">
          <p className="font-medium">
            A page to submit ideas, report bugs, or suggest improvements is coming soon.
          </p>
        </div>
      </div>

      <p className="text-gray-600">Coming soon...</p>
    </div>
  );
}
