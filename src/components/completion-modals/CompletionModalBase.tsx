import { ReactNode } from 'react';

interface CompletionModalBaseProps {
  isOpen: boolean;
  title: string;
  emoji?: string;
  accentColor?: 'green' | 'yellow' | 'blue';
  children: ReactNode;
}

const accentStyles = {
  green: {
    border: 'border-emerald-200',
    text: 'text-emerald-600',
    glow: 'shadow-[0_0_60px_rgba(16,185,129,0.3)]',
  },
  yellow: {
    border: 'border-amber-200',
    text: 'text-amber-600',
    glow: 'shadow-[0_0_60px_rgba(245,158,11,0.3)]',
  },
  blue: {
    border: 'border-blue-200',
    text: 'text-blue-600',
    glow: 'shadow-[0_0_60px_rgba(59,130,246,0.3)]',
  },
};

export function CompletionModalBase({
  isOpen,
  title,
  emoji = "🎉",
  accentColor = 'green',
  children
}: CompletionModalBaseProps) {
  if (!isOpen) return null;

  const accent = accentStyles[accentColor];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-[fade-in_0.3s_ease-out]">
      {/* Confetti particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${5 + (i * 17) % 90}%`,
              backgroundColor: ['#22c55e', '#d946ef', '#f59e0b', '#3b82f6', '#ef4444', '#06b6d4'][i % 6],
              animation: `confetti-fall ${1.5 + (i % 5) * 0.4}s ease-out ${i * 0.05}s both`,
            }}
          />
        ))}
      </div>

      <div
        className={`relative w-full sm:max-w-sm mx-0 sm:mx-4 rounded-t-2xl sm:rounded-2xl bg-white border-2 ${accent.border} ${accent.glow} p-6 pt-8 text-center animate-[modal-slide-up_0.4s_ease-out]`}
      >
        {/* Emoji badge */}
        <div className="mx-auto w-16 h-16 rounded-full bg-white border-4 border-gray-100 flex items-center justify-center text-3xl mb-4 animate-[modal-bounce_0.6s_ease-out_0.2s_both]">
          {emoji}
        </div>

        <h2 className={`text-xl font-black uppercase ${accent.text} mb-4 tracking-tight animate-[modal-fade-up_0.4s_ease-out_0.3s_both]`}>
          {title}
        </h2>

        <div className="animate-[modal-fade-up_0.4s_ease-out_0.4s_both]">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modal-slide-up {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg) scale(0); opacity: 1; }
          50% { opacity: 1; transform: translateY(40vh) rotate(360deg) scale(1.2); }
          100% { transform: translateY(80vh) rotate(720deg) scale(0.6); opacity: 0; }
        }
        @keyframes modal-bounce {
          0% { transform: scale(0.3) translateY(20px); opacity: 0; }
          50% { transform: scale(1.15); opacity: 1; }
          70% { transform: scale(0.9); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes modal-fade-up {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
