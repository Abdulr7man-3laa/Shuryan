import { parseMarkdown, splitIntoParagraphs } from './markdownUtils.jsx';

/**
 * Component لعرض Markdown text
 */
export const MarkdownText = ({ text, className = '' }) => {
  const paragraphs = splitIntoParagraphs(text);

  return (
    <div className={`space-y-2 ${className}`}>
      {paragraphs.map((paragraph, idx) => (
        <p key={idx} className="text-sm font-medium leading-relaxed">
          {parseMarkdown(paragraph)}
        </p>
      ))}
    </div>
  );
};
