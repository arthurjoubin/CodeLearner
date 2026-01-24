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

    // 1. Code blocks
    let processedText = text.replace(/```(\w+)?\s*\n?([\s\S]*?)```/g, (_, _lang, code) => {
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
        if (trimmed.startsWith('__CODE_BLOCK_') || trimmed.startsWith('<h') || trimmed.startsWith('<li')) {
          return trimmed;
        }
        return `<p class="text-sm leading-relaxed text-gray-700 mb-2">${trimmed.replace(/\n/g, '<br/>')}</p>`;
      })
      .join('');

    // 8. Restore placeholders
    placeholders.forEach((html, i) => {
      processedText = processedText.replace(new RegExp(`__(CODE_BLOCK|INLINE_CODE)_${i}__`, 'g'), html);
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
