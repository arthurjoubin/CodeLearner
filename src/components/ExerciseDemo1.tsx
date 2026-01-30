import { useState, useEffect } from 'react';

export function ExerciseDemo1({ onComplete }: { onComplete?: () => void }) {
  const [phase, setPhase] = useState<'typing' | 'analyzing' | 'hint' | 'fixing' | 'reanalyzing' | 'validated'>('typing');
  const [typedChars, setTypedChars] = useState(0);
  const [hintChars, setHintChars] = useState(0);
  const [fixChars, setFixChars] = useState(0);

  const initialSegments = [
    { text: '// Sum array of numbers\n', cls: 'text-gray-500' },
    { text: 'function ', cls: 'text-primary-600' },
    { text: 'sumArray', cls: 'text-gray-900 font-bold' },
    { text: '(', cls: 'text-gray-800' },
    { text: 'arr', cls: 'text-gray-800' },
    { text: ') {\n', cls: 'text-gray-800' },
    { text: '  return ', cls: 'text-primary-600' },
    { text: 'arr', cls: 'text-gray-800' },
    { text: '.', cls: 'text-gray-800' },
    { text: 'reduce', cls: 'text-red-600 font-bold' },
    { text: '(', cls: 'text-gray-800' },
    { text: '(', cls: 'text-gray-800' },
    { text: 'sum', cls: 'text-gray-800' },
    { text: ', ', cls: 'text-gray-800' },
    { text: 'item', cls: 'text-gray-800' },
    { text: ') ', cls: 'text-gray-800' },
    { text: '=>', cls: 'text-gray-800' },
    { text: ' ', cls: 'text-gray-800' },
    { text: 'sum', cls: 'text-gray-800' },
    { text: ' ', cls: 'text-gray-800' },
    { text: '+', cls: 'text-gray-800' },
    { text: ' ', cls: 'text-gray-800' },
    { text: 'item', cls: 'text-gray-800' },
    { text: ');\n}', cls: 'text-gray-800' },
  ];

  const fixSegments = [
    { text: '\n\n', cls: '' },
    { text: '// Fix: add initial value 0\n', cls: 'text-gray-500' },
    { text: 'arr', cls: 'text-gray-800' },
    { text: '.', cls: 'text-gray-800' },
    { text: 'reduce', cls: 'text-primary-600 font-bold' },
    { text: '((sum, item) => sum + item, ', cls: 'text-gray-800' },
    { text: '0', cls: 'text-blue-600 font-bold' },
    { text: ');', cls: 'text-gray-800' },
  ];

  const totalInitialChars = initialSegments.reduce((sum, s) => sum + s.text.length, 0);
  const totalFixChars = fixSegments.reduce((sum, s) => sum + s.text.length, 0);
  const hintText = 'reduce() needs an initial value! Add 0 as second argument to avoid unexpected results with empty arrays.';

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    switch (phase) {
      case 'typing':
        timer = setTimeout(
          () => typedChars < totalInitialChars ? setTypedChars(c => c + 1) : setPhase('analyzing'),
          typedChars < totalInitialChars ? 35 : 800
        );
        break;
      case 'analyzing':
        timer = setTimeout(() => setPhase('hint'), 2000);
        break;
        case 'hint':
        timer = setTimeout(
          () => hintChars < hintText.length ? setHintChars(c => c + 1) : setPhase('fixing'),
          hintChars < hintText.length ? 25 : 2000
        );
        break;
      case 'fixing':
        timer = setTimeout(
          () => fixChars < totalFixChars ? setFixChars(c => c + 1) : setPhase('reanalyzing'),
          fixChars < totalFixChars ? 40 : 1200
        );
        break;
      case 'reanalyzing':
        timer = setTimeout(() => setPhase('validated'), 1500);
        break;
      case 'validated':
        timer = setTimeout(() => {
          if (onComplete) {
            onComplete();
          } else {
            setPhase('typing');
            setTypedChars(0);
            setHintChars(0);
            setFixChars(0);
          }
        }, 4000);
        break;
    }

    return () => clearTimeout(timer);
  }, [phase, typedChars, hintChars, fixChars]);

  function renderSegments(segments: { text: string; cls: string }[], maxChars: number) {
    let remaining = maxChars;
    return segments.map((seg, i) => {
      if (remaining <= 0) return null;
      const chars = Math.min(remaining, seg.text.length);
      remaining -= chars;
      return <span key={i} className={seg.cls}>{seg.text.slice(0, chars)}</span>;
    });
  }

  const showCursor = phase === 'typing' || phase === 'fixing';
  const isValidated = phase === 'validated';

  return (
    <div className={`border-2 rounded-lg bg-white max-w-2xl overflow-hidden transition-colors duration-500 ${isValidated ? 'border-primary-400' : 'border-gray-300'}`}>
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-200 bg-gray-50">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-primary-400" />
        <span className="ml-2 text-[10px] text-gray-400 uppercase font-bold tracking-wider">exercise.js</span>
      </div>

      <div className="p-4 md:p-6 min-h-[180px]">
        <pre className="text-sm text-gray-800 leading-relaxed">
          <code>
            {renderSegments(initialSegments, typedChars)}
            {(phase === 'fixing' || phase === 'reanalyzing' || phase === 'validated') &&
              renderSegments(fixSegments, fixChars)}
            {showCursor && <span className="animate-pulse text-primary-500 font-bold">|</span>}
          </code>
        </pre>
      </div>

      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 min-h-[44px] flex items-center">
        {phase === 'typing' && typedChars === 0 && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
            <span className="text-xs text-gray-400 font-medium">Ready</span>
          </div>
        )}
        {phase === 'typing' && typedChars > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-500 font-medium">Writing code...</span>
          </div>
        )}
        {(phase === 'analyzing' || phase === 'reanalyzing') && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-primary-600 font-bold">AI is analyzing your code...</span>
          </div>
        )}
        {phase === 'hint' && (
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="text-xs text-amber-700 font-medium">
              {hintText.slice(0, hintChars)}
              {hintChars < hintText.length && <span className="animate-pulse">|</span>}
            </span>
          </div>
        )}
        {phase === 'fixing' && (
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="text-xs text-amber-700 font-medium">{hintText}</span>
          </div>
        )}
        {phase === 'validated' && (
          <div className="flex items-center gap-2 animate-pop">
            <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xs text-primary-700 font-bold">Code validated! +100 XP earned</span>
          </div>
        )}
      </div>
    </div>
  );
}
