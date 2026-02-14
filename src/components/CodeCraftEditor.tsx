import { useState } from 'react';
import { Maximize, X, RotateCcw } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

interface CodeCraftEditorProps {
  code: string;
  languageId: string;
  isCodeDirty: boolean;
  onChange: (value: string) => void;
  onReset: () => void;
  className?: string;
}

const languageExtensions: Record<string, any> = {
  python: python(),
  javascript: javascript(),
  typescript: javascript({ jsx: true }),
  rust: [],
  go: [],
};

export function CodeCraftEditor({
  code,
  languageId,
  isCodeDirty,
  onChange,
  onReset,
  className = '',
}: CodeCraftEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <div
        className={`${
          isExpanded
            ? 'fixed inset-2 sm:inset-4 lg:inset-8 z-50 bg-gray-900 shadow-2xl border-2 border-gray-300 flex flex-col'
            : className.includes('h-') 
              ? `border-2 border-gray-300 bg-gray-900 flex flex-col ${className}`
              : `border-2 border-gray-300 bg-gray-900 flex flex-col h-[180px] sm:h-[220px] lg:h-[280px]`
        }`}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-gray-800 text-white">
          <span className="font-bold uppercase text-sm flex items-center gap-2">
            Editor {isCodeDirty && <span className="text-gray-400 font-normal normal-case">• unsaved</span>}
            {isExpanded && <span className="text-gray-400 font-normal normal-case ml-2">- Full Screen Mode</span>}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="p-1.5 hover:bg-gray-700 rounded transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-1.5 hover:bg-gray-700 flex items-center gap-1.5 ${
                isExpanded ? 'bg-red-600 hover:bg-red-700 px-2 rounded' : ''
              }`}
              title={isExpanded ? "Close" : "Expand"}
            >
              {isExpanded ? (
                <>
                  <X className="w-4 h-4" />
                  <span className="font-bold text-sm">Close</span>
                </>
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 min-h-0">
          <CodeMirror
            value={code}
            height="100%"
            theme={oneDark}
            extensions={[languageExtensions[languageId] || []]}
            onChange={onChange}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightSpecialChars: true,
              foldGutter: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              rectangularSelection: true,
              crosshairCursor: true,
              highlightActiveLine: true,
              highlightSelectionMatches: true,
              closeBracketsKeymap: true,
              defaultKeymap: true,
              searchKeymap: true,
              historyKeymap: true,
              foldKeymap: true,
              completionKeymap: true,
              lintKeymap: true,
            }}
          />
        </div>
      </div>
    </>
  );
}
