import { Lightbulb } from 'lucide-react';

export default function FeedbackPage() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="border-2 border-black mb-6">
        <div className="bg-yellow-400 px-4 py-3 font-bold uppercase text-sm flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          Give feedback!
        </div>
        <div className="p-4 bg-white">
          <p className="font-medium">
            A page to submit ideas, report bugs, or suggest improvements is coming soon.
          </p>
        </div>
      </div>

      <h1 className="text-3xl font-black mb-8 uppercase tracking-tight">Feedback</h1>
      <p className="text-gray-600 mb-8">Coming soon...</p>
    </div>
  );
}
