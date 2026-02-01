import { useState, useRef, useEffect, useCallback } from 'react';
import type { TerminalEntry } from '../hooks/useGitState';

interface GitTerminalProps {
  history: TerminalEntry[];
  onExecute: (command: string) => void;
}

export default function GitTerminal({ history, onExecute }: GitTerminalProps) {
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [, setHistoryIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);
    onExecute(trimmed);
    setInput('');
  }, [input, onExecute]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHistoryIndex(prev => {
        const next = prev === -1 ? commandHistory.length - 1 : Math.max(0, prev - 1);
        if (next >= 0 && next < commandHistory.length) {
          setInput(commandHistory[next]);
        }
        return next;
      });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHistoryIndex(prev => {
        const next = prev + 1;
        if (next >= commandHistory.length) {
          setInput('');
          return -1;
        }
        setInput(commandHistory[next]);
        return next;
      });
    }
  }, [handleSubmit, commandHistory]);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className="flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700"
      onClick={handleContainerClick}
    >
      <div className="px-2.5 sm:px-3 py-2 bg-gray-800 text-gray-400 text-xs border-b border-gray-700 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500/70" />
        </div>
        <span className="ml-1 font-medium text-[10px] sm:text-xs">Terminal</span>
      </div>

      <div className="flex-1 overflow-auto p-2 sm:p-2.5 font-mono text-xs sm:text-sm space-y-0.5 min-h-0">
        {history.map((entry, i) => (
          <div key={i}>
            <div className="flex items-start gap-1.5">
              <span className="text-green-400 select-none shrink-0">$</span>
              <span className="text-gray-100">{entry.command}</span>
            </div>
            {entry.output && (
              <pre className="text-gray-400 whitespace-pre-wrap ml-4 text-xs leading-snug mt-0.5">
                {entry.output}
              </pre>
            )}
          </div>
        ))}

        <div className="flex items-center gap-1.5">
          <span className="text-green-400 select-none shrink-0">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-gray-100 outline-none border-none font-mono text-sm caret-green-400"
            spellCheck={false}
            autoComplete="off"
            placeholder="Type a git command..."
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
