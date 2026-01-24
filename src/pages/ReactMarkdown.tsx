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

    // 0. Special "Essential to know" card
    let processedText = text.replace(/# Essential to know\n([\s\S]*?)\n---/g, (_, content) => {
      const placeholder = `__ESSENTIAL_BLOCK_${placeholders.length}__`;

      // We need to parse the inner content (lists) of the essential block
      // But we can do a simple pass for the list items here since we know the format
      const listItems = content
        .trim()
        .split('\n')
        .map((line: string) => {
          const cleanLine = line.replace(/^- /, '').trim();
          if (!cleanLine) return '';
          // Handle bold text in list items
          const withBold = cleanLine.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');
          return `<li class="flex items-start gap-2 text-sm text-gray-700 mb-1">
            <span class="text-primary-500 font-bold mt-1">→</span>
            <span>${withBold}</span>
          </li>`;
        })
        .join('');

      const html = `
        <div class="mb-6 p-4 bg-gray-50 border-2 border-black border-dashed">
          <h3 class="text-sm font-black uppercase mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary-500"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            Essential to know
          </h3>
          <ul class="flex flex-col gap-1">
            ${listItems}
          </ul>
        </div>
      `;
      placeholders.push(html);
      return placeholder;
    });

    // 1. Code blocks
    processedText = processedText.replace(/```(\w+)?\s*\n?([\s\S]*?)```/g, (_, _lang, code) => {
      const placeholder = `__CODE_BLOCK_${placeholders.length}__`;
      const html = `<pre class="bg-gray-900 text-gray-100 p-3 overflow-x-auto text-xs my-3 border-2 border-black font-mono leading-relaxed"><code>${escapeHtml(code.trim())}</code></pre>`;
      placeholders.push(html);
      return placeholder;
    });

    // 2. Inline code
    processedText = processedText.replace(/`([^`]+)`/g, (_, code) => {
      const placeholder = `__INLINE_CODE_${placeholders.length}__`;
      const html = `<code class="bg-yellow-100 text-black px-1 py-0.5 border border-black/30 text-xs">${escapeHtml(code)}</code>`;
      placeholders.push(html);
      return placeholder;
    });

    // 3. Headers - compact
    processedText = processedText
      .replace(/^### (.+)$/gm, '<h3 class="text-sm font-bold text-black mt-4 mb-1">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-base font-bold text-black mt-5 mb-2">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-lg font-bold text-black mt-3 mb-2">$1</h1>');

    // 4. Bold and italic
    processedText = processedText
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');

    // 5. Links
    processedText = processedText
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-600 underline" target="_blank">$1</a>');

    // 6. Lists
    processedText = processedText
      .replace(/^\- (.+)$/gm, '<li class="ml-4 list-disc text-sm leading-relaxed">$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal text-sm leading-relaxed">$2</li>');

    // 7. Paragraphs
    processedText = processedText
      .split(/\n\n+/)
      .map(p => {
        const trimmed = p.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('__CODE_BLOCK_') || trimmed.startsWith('__ESSENTIAL_BLOCK_') || trimmed.startsWith('<h') || trimmed.startsWith('<li')) {
          return trimmed;
        }
        return `<p class="text-sm leading-relaxed text-gray-700 mb-2">${trimmed.replace(/\n/g, '<br/>')}</p>`;
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
