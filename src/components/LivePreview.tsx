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

      try {
        // Transform JSX/TypeScript to plain JavaScript
        const transformed = transform(code, {
          transforms: ['typescript', 'jsx'],
          jsxRuntime: 'classic',
          jsxPragma: 'React.createElement',
          jsxFragmentPragma: 'React.Fragment',
        });

        // Find the component name (first function that starts with capital letter)
        const componentMatch = code.match(/function\s+([A-Z][a-zA-Z0-9]*)/);
        const componentName = componentMatch ? componentMatch[1] : null;

        if (!componentName) {
          setError('No component found. Make sure your function name starts with a capital letter.');
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
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Syntax Error: ${errorMessage}`);
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
      className="w-full h-full border-0"
      sandbox="allow-scripts allow-same-origin"
    />
  );
}
