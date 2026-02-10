import { Lightbulb } from 'lucide-react';

export default function FeedbackPage() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tight inline">Feedback</h1>
        <span className="inline-block w-12 h-0.5 bg-primary-500 ml-2 align-middle" />
      </div>

      <div className="border border-gray-300 mb-6 bg-white rounded-lg transition-all hover:shadow-md">
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
