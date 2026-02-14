import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism-tomorrow.css';

interface ReactMarkdownProps {
  content: string;
}

export default function ReactMarkdown({ content }: ReactMarkdownProps) {
  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const parseMarkdown = (text: string): string => {
    const placeholders: string[] = [];

    let processedText = text;

    // 0. Special "Essential to know" card
    processedText = processedText.replace(/# Essential to know\n([\s\S]*?)\n---/g, (_, content) => {
      const placeholder = `__ESSENTIAL_BLOCK_${placeholders.length}__`;
      const listItems = content
        .trim()
        .split('\n')
        .map((line: string) => {
          const cleanLine = line.replace(/^- /, '').trim();
          if (!cleanLine) return '';
          // Handle inline code in Essential to know section
          const withCode = cleanLine.replace(/`([^`]+)`/g, (_, code) => {
            return `<code class="bg-gray-100 text-primary-700 px-1 rounded font-mono text-xs">${escapeHtml(code)}</code>`;
          });
          const withBold = withCode.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');
          return `<li class="flex items-start gap-2 text-base text-gray-700">
            <span class="text-primary-600 font-bold mt-0.5">•</span>
            <span>${withBold}</span>
          </li>`;
        })
        .join('');

      const html = `
        <div class="mb-4 p-4 bg-primary-50 border-2 border-primary-200 rounded-lg">
          <h3 class="text-sm font-bold uppercase text-gray-900 mb-2 flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
            Essential to know
          </h3>
          <ul class="flex flex-col gap-0">
            ${listItems}
          </ul>
        </div>
      `;
      placeholders.push(html);
      return placeholder;
    });

    // 1. Code blocks
    processedText = processedText.replace(/```(\w+)?\s*\n?([\s\S]*?)```/g, (_, lang, code) => {
      const placeholder = `__CODE_BLOCK_${placeholders.length}__`;
      const language = lang || 'javascript';
      let highlightedCode = escapeHtml(code.trim());
      
      try {
        if (Prism.languages[language]) {
          highlightedCode = Prism.highlight(code.trim(), Prism.languages[language], language);
        }
      } catch (e) {
        console.error('Prism highlighting error:', e);
      }

      const html = `<pre class="bg-gray-900 text-gray-100 p-3 overflow-x-auto text-sm rounded-lg border-2 border-gray-700 font-mono my-3 language-${language}"><code class="language-${language}">${highlightedCode}</code></pre>`;
      placeholders.push(html);
      return placeholder;
    });

    // 2. Inline code
    processedText = processedText.replace(/`([^`]+)`/g, (_, code) => {
      const placeholder = `__INLINE_CODE_${placeholders.length}__`;
      const html = `<code class="bg-gray-100 text-primary-700 px-1.5 py-0.5 rounded font-mono text-xs">${escapeHtml(code)}</code>`;
      placeholders.push(html);
      return placeholder;
    });

    // 3. Headers
    processedText = processedText
      .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-gray-900 mt-4 mb-1">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-gray-900 mt-4 mb-1">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-gray-900 mt-3 mb-2">$1</h1>');

    // 4. Bold and italic
    processedText = processedText
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');

    // 5. Links
    processedText = processedText
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-600 underline" target="_blank">$1</a>');

    // 6. Lists - grouped approach to avoid spacing issues
    const lines = processedText.split('\n');
    const newLines: string[] = [];
    let inList = false;
    let listType = '';
    let listItems: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const unorderedMatch = line.match(/^(\s*)- (.+)$/);
      const orderedMatch = line.match(/^(\s*)(\d+)\. (.+)$/);

      if (unorderedMatch) {
        if (!inList || listType !== 'ul') {
          if (inList) {
            newLines.push(`<ul class="list-none space-y-0 ml-2">${listItems.join('')}</ul>`);
            listItems = [];
          }
          listType = 'ul';
          inList = true;
        }
        listItems.push(`<li class="flex items-start gap-2 text-base text-gray-700">
          <span class="text-primary-600 font-bold mt-0.5">•</span>
          <span>${unorderedMatch[2]}</span>
        </li>`);
      } else if (orderedMatch) {
        if (!inList || listType !== 'ol') {
          if (inList) {
            newLines.push(`<ul class="list-none space-y-0 ml-2">${listItems.join('')}</ul>`);
            listItems = [];
          }
          listType = 'ol';
          inList = true;
        }
        listItems.push(`<li class="flex items-start gap-2 text-base text-gray-700">
          <span class="text-primary-600 font-bold mt-0.5">${orderedMatch[2]}.</span>
          <span>${orderedMatch[3]}</span>
        </li>`);
      } else {
        if (inList) {
          newLines.push(`<ul class="list-none space-y-0 ml-2">${listItems.join('')}</ul>`);
          listItems = [];
          inList = false;
          listType = '';
        }
        newLines.push(line);
      }
    }

    if (inList) {
      newLines.push(`<ul class="list-none space-y-0 ml-2">${listItems.join('')}</ul>`);
    }

    processedText = newLines.join('\n');

    // 7. Paragraphs
    processedText = processedText
      .split(/\n\n+/)
      .map(p => {
        const trimmed = p.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('__CODE_BLOCK_') || trimmed.startsWith('__ESSENTIAL_BLOCK_') || trimmed.startsWith('<h') || trimmed.startsWith('<ul')) {
          return trimmed;
        }
        return `<p class="text-base leading-relaxed text-gray-700">${trimmed.replace(/\n/g, '<br/>')}</p>`;
      })
      .join('');

    // 8. Restore placeholders
    placeholders.forEach((html, i) => {
      processedText = processedText.replace(new RegExp(`__(CODE_BLOCK|INLINE_CODE|ESSENTIAL_BLOCK)_${i}__`, 'g'), html);
    });

    return processedText;
  };

  return (
    <div
      className="prose-content"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
}
