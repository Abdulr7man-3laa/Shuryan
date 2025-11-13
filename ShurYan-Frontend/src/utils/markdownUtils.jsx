import React from 'react';

/**
 * تحويل Markdown text إلى JSX elements
 */

export const parseMarkdown = (text) => {
  if (!text) return null;

  const elements = [];
  let key = 0;

  // Combined regex pattern for both bold and links
  const combinedPattern = /(\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\))/g;

  let match;
  let lastIndex = 0;

  while ((match = combinedPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const normalText = text.substring(lastIndex, match.index);
      elements.push(
        <span key={`text-${key++}`}>{normalText}</span>
      );
    }

    if (match[0].startsWith('**')) {
      // Bold text
      const boldText = match[2];
      elements.push(
        <strong key={`bold-${key++}`} className="font-black text-slate-900">
          {boldText}
        </strong>
      );
    } else if (match[0].startsWith('[')) {
      // Link
      const linkText = match[3];
      const linkUrl = match[4];
      elements.push(
        <a
          key={`link-${key++}`}
          href={linkUrl}
          className="text-[#00d5be] hover:text-[#00bfaa] font-bold underline decoration-2 underline-offset-2 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkText}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    const remainingText = text.substring(lastIndex);
    elements.push(
      <span key={`text-${key++}`}>{remainingText}</span>
    );
  }

  return elements.length > 0 ? elements : text;
};

export const splitIntoParagraphs = (text) => {
  if (!text) return [];
  return text.split('\n\n').filter(p => p.trim());
};
