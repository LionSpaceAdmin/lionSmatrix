/**
 * Convert markdown text to HTML with security-focused implementation
 */
export function markdownToHtml(md: string): string {
  if (!md) return '';
  
  // Escape HTML tags for security
  let html = md.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Convert headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Convert bold text
  html = html.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  
  // Convert italic (be careful not to conflict with bold)
  html = html.replace(/(?<!\*)\*([^\*]+)\*(?!\*)/g, '<em>$1</em>');
  html = html.replace(/(?<!_)_([^_]+)_(?!_)/g, '<em>$1</em>');
  
  // Convert links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Convert code blocks
  html = html.replace(/```([^`]*)```/g, '<pre><code>$1</code></pre>');
  
  // Convert inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Convert blockquotes
  html = html.replace(/^&gt; (.+)$/gim, '<blockquote>$1</blockquote>');
  
  // Convert lists
  const lines = html.split('\n');
  let inList = false;
  let listType = '';
  const newLines = lines.map(line => {
    // Handle unordered lists
    if (line.startsWith('* ')) {
      if (!inList || listType !== 'ul') {
        const result = inList ? '</'+listType+'><ul><li>' + line.substring(2) + '</li>' : '<ul><li>' + line.substring(2) + '</li>';
        inList = true;
        listType = 'ul';
        return result;
      }
      return '<li>' + line.substring(2) + '</li>';
    } 
    // Handle ordered lists
    else if (/^\d+\. /.test(line)) {
      const content = line.replace(/^\d+\. /, '');
      if (!inList || listType !== 'ol') {
        const result = inList ? '</'+listType+'><ol><li>' + content + '</li>' : '<ol><li>' + content + '</li>';
        inList = true;
        listType = 'ol';
        return result;
      }
      return '<li>' + content + '</li>';
    }
    // Not a list item
    else {
      if (inList) {
        inList = false;
        const closingTag = '</' + listType + '>';
        listType = '';
        return closingTag + line;
      }
      return line;
    }
  });
  
  // Close any unclosed list
  if (inList) {
    newLines.push('</' + listType + '>');
  }
  
  html = newLines.join('\n');
  
  // Convert line breaks
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');
  
  // Wrap content in paragraph if needed
  if (!html.match(/^<[^>]+>/)) {
    html = '<p>' + html + '</p>';
  }
  
  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');
  html = html.replace(/<p><br><\/p>/g, '');
  
  return html;
}

/**
 * Strip HTML tags from text
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, m => map[m] || m);
}

/**
 * Convert HTML to markdown (basic implementation)
 */
export function htmlToMarkdown(html: string): string {
  let markdown = html;

  // Convert headers
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n');
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n');
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n');

  // Convert bold
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');

  // Convert italic
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

  // Convert links
  markdown = markdown.replace(/<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/gi, '[$2]($1)');

  // Convert line breaks and paragraphs
  markdown = markdown.replace(/<br[^>]*>/gi, '\n');
  markdown = markdown.replace(/<\/p>/gi, '\n\n');
  markdown = markdown.replace(/<p[^>]*>/gi, '');

  // Convert lists
  markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/gi, '* $1\n');
  markdown = markdown.replace(/<\/?ul[^>]*>/gi, '');
  markdown = markdown.replace(/<\/?ol[^>]*>/gi, '');

  // Convert code blocks
  markdown = markdown.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gi, '```\n$1\n```');
  
  // Convert inline code
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

  // Convert blockquotes
  markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1');

  // Remove remaining HTML tags
  markdown = markdown.replace(/<[^>]+>/g, '');

  // Clean up extra whitespace
  markdown = markdown.replace(/\n{3,}/g, '\n\n');
  markdown = markdown.trim();

  return markdown;
}