interface ReactMarkdownProps {
  content: string;
}

export default function ReactMarkdown({ content }: ReactMarkdownProps) {
  // Simple markdown parser for basic formatting
  const parseMarkdown = (text: string): string => {
    let html = text
      // Code blocks
      .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) =>
        `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm my-4"><code>${escapeHtml(code.trim())}</code></pre>`
      )
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm">$1</code>')
      // Headers
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-gray-800 mt-6 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-gray-800 mt-6 mb-3">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-gray-800 mt-4 mb-4">$1</h1>')
      // Bold and italic
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Lists
      .replace(/^\- (.+)$/gm, '<li class="ml-4">$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4">$2</li>')
      // Tables (simple)
      .replace(/\|(.+)\|/g, (match) => {
        const cells = match.split('|').filter(c => c.trim());
        if (cells.some(c => /^[-:]+$/.test(c.trim()))) {
          return ''; // Skip separator row
        }
        const isHeader = match.includes('---');
        return `<tr>${cells.map(c =>
          `<td class="border border-gray-200 px-3 py-2">${c.trim()}</td>`
        ).join('')}</tr>`;
      })
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4">')
      // Line breaks
      .replace(/\n/g, '<br/>');

    // Wrap in paragraph if not starting with block element
    if (!html.startsWith('<h') && !html.startsWith('<pre') && !html.startsWith('<ul') && !html.startsWith('<ol')) {
      html = `<p class="mb-4">${html}</p>`;
    }

    return html;
  };

  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  return (
    <div
      className="prose-content"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
}
