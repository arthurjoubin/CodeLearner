import { useState, useEffect, useRef } from 'react';
import { transform } from 'sucrase';

interface LivePreviewProps {
  code: string;
}

export default function LivePreview({ code }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderPreview = () => {
      if (!iframeRef.current) return;

      // Don't try to render empty or very short code
      const trimmedCode = code.trim();
      if (!trimmedCode || trimmedCode.length < 10) {
        setError(null);
        return;
      }

      try {
        // Transform JSX/TypeScript to plain JavaScript
        const transformed = transform(trimmedCode, {
          transforms: ['typescript', 'jsx'],
          jsxRuntime: 'classic',
          jsxPragma: 'React.createElement',
          jsxFragmentPragma: 'React.Fragment',
        });

        // Find the component name (first function that starts with capital letter)
        const componentMatch = trimmedCode.match(/function\s+([A-Z][a-zA-Z0-9]*)/);
        const componentName = componentMatch ? componentMatch[1] : null;

        if (!componentName) {
          // Not an error, just incomplete code
          setError(null);
          return;
        }

        // Create the HTML content for the iframe
        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 16px;
      margin: 0;
    }
    .error {
      color: #dc2626;
      background: #fef2f2;
      border: 1px solid #fecaca;
      padding: 12px;
      border-radius: 8px;
      font-family: monospace;
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    try {
      const { useState, useEffect, useRef, useCallback, useMemo } = React;

      ${transformed.code}

      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(${componentName}));
    } catch (err) {
      document.getElementById('root').innerHTML = '<div class="error">' + err.message + '</div>';
    }
  </script>
</body>
</html>`;

        // Write to iframe
        const iframe = iframeRef.current;
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          doc.open();
          doc.write(html);
          doc.close();
        }

        setError(null);
      } catch (err: unknown) {
        // For transform errors (incomplete code), don't show an error
        // Just clear previous output silently
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        // Only show error if code looks complete (has closing brace)
        if (trimmedCode.includes('return') && trimmedCode.endsWith('}')) {
          setError(`Syntax Error: ${errorMessage}`);
        } else {
          setError(null);
        }
      }
    };

    // Debounce the render
    const timeoutId = setTimeout(renderPreview, 500);
    return () => clearTimeout(timeoutId);
  }, [code]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 h-full">
        <div className="text-red-600 font-mono text-sm whitespace-pre-wrap">
          {error}
        </div>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      title="Preview"
      className="w-full border-0 absolute inset-0"
      style={{ height: '100%', minHeight: '250px' }}
      sandbox="allow-scripts allow-same-origin"
    />
  );
}
