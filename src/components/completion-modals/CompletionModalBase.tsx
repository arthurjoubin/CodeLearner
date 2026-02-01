import { ReactNode } from 'react';

interface CompletionModalBaseProps {
  isOpen: boolean;
  title: string;
  emoji?: string;
  children: ReactNode;
}

export function CompletionModalBase({ 
  isOpen, 
  title, 
  emoji = "🎉",
  children 
}: CompletionModalBaseProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 text-center max-w-sm w-full border-2 border-gray-300 shadow-xl">
        <div className="text-4xl sm:text-5xl mb-3">{emoji}</div>
        <h2 className="text-xl font-black uppercase text-green-600 mb-2">{title}</h2>
        {children}
      </div>
    </div>
  );
}
