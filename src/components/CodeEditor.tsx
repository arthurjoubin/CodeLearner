import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: 'javascript' | 'typescript' | 'jsx' | 'tsx';
  height?: string;
  className?: string;
  readOnly?: boolean;
}

const customDarkTheme = EditorView.theme({
  '&': {
    backgroundColor: '#1e1e1e',
    fontSize: '13px',
  },
  '.cm-content': {
    fontFamily: 'JetBrains Mono, Monaco, Menlo, Consolas, monospace',
    lineHeight: '1.5',
    paddingTop: '8px',
    paddingBottom: '8px',
  },
  '.cm-line': {
    padding: '0 4px 0 8px',
  },
  '.cm-gutters': {
    backgroundColor: '#1e1e1e',
    borderRight: 'none',
    color: '#858585',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#2c2c2c',
  },
  '.cm-activeLine': {
    backgroundColor: '#2c2c2c',
  },
  '&.cm-focused': {
    outline: 'none',
  },
  '&.cm-focused .cm-selectionBackground': {
    backgroundColor: '#264f78',
  },
  '.cm-selectionBackground': {
    backgroundColor: '#3a3d41',
  },
}, { dark: true });

const mobileExtensions = [
  EditorView.theme({
    '.cm-content': {
      fontSize: '14px',
    },
  }),
];

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'typescript',
  height = '100%',
  className = '',
  readOnly = false,
}) => {
  const extensions = [
    javascript({ 
      jsx: language.includes('jsx') || language.includes('tsx'),
      typescript: language.includes('typescript') || language.includes('tsx'),
    }),
    oneDark,
    customDarkTheme,
    EditorView.lineWrapping,
  ];

  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    extensions.push(...mobileExtensions);
  }

  return (
    <CodeMirror
      value={value}
      height={height}
      extensions={extensions}
      onChange={onChange}
      theme="dark"
      className={className}
      editable={!readOnly}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLineGutter: true,
        highlightActiveLine: true,
        foldGutter: false,
        dropCursor: false,
        allowMultipleSelections: false,
        indentOnInput: false,
        bracketMatching: true,
        closeBrackets: true,
        autocompletion: true,
        rectangularSelection: false,
        crosshairCursor: false,
        highlightSelectionMatches: true,
        closeBracketsKeymap: true,
        defaultKeymap: true,
        searchKeymap: true,
        historyKeymap: true,
        foldKeymap: false,
        completionKeymap: true,
        lintKeymap: false,
      }}
    />
  );
};

export default CodeEditor;
