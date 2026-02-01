import { Star } from 'lucide-react';

interface CompletionModalProps {
  isOpen: boolean;
  title: string;
  xp?: number;
  message?: string;
  primaryButtonText: string;
  primaryButtonAction: () => void;
  secondaryButtonText?: string;
  secondaryButtonAction?: () => void;
  showXp?: boolean;
}

export function CompletionModal({
  isOpen,
  title,
  xp = 0,
  message,
  primaryButtonText,
  primaryButtonAction,
  secondaryButtonText,
  secondaryButtonAction,
  showXp = true
}: CompletionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        
        {message && <p className="text-gray-600 mb-4">{message}</p>}
        
        {showXp && (
          <div className="bg-yellow-50 rounded-lg p-4 mb-6 flex items-center justify-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            <span className="text-2xl font-bold text-yellow-700">+{xp} XP</span>
          </div>
        )}
        
        <div className="flex gap-3">
          {secondaryButtonText && secondaryButtonAction && (
            <button
              onClick={secondaryButtonAction}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-bold text-gray-700 hover:border-gray-400 transition-colors"
            >
              {secondaryButtonText}
            </button>
          )}
          <button
            onClick={primaryButtonAction}
            className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg font-bold hover:bg-primary-600 transition-colors"
          >
            {primaryButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
