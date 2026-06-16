import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkdownRendererProps {
  content: string;
  themeStyle?: string;
}

export default function MarkdownRenderer({ content, themeStyle = 'classic' }: MarkdownRendererProps) {
  const components = useMemo(() => {
    // Base styles
    let headingStyles = "font-bold text-white mb-4";
    let pStyles = "text-gray-300 leading-relaxed my-3";
    let codeBlockStyles = "block bg-[#0D0D10] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#22D3EE] font-mono overflow-x-auto my-3 whitespace-pre";
    let inlineCodeStyles = "bg-white/10 px-1.5 py-0.5 rounded text-sm text-[#22D3EE] font-mono";
    let aStyles = "text-[#A855F7] hover:text-[#C084FC] hover:underline transition-colors";
    let blockquoteStyles = "border-l-4 border-[#7C3AED]/50 pl-4 my-4 text-gray-400 italic bg-white/5 py-2 rounded-r";

    // Theme-specific overrides
    switch (themeStyle.toLowerCase()) {
      case 'terminal':
        headingStyles = "font-mono font-bold text-green-400 mb-4 border-b border-green-400/20 pb-2";
        pStyles = "font-mono text-green-300/80 leading-relaxed my-3 text-sm";
        codeBlockStyles = "block bg-black border border-green-500/30 rounded px-4 py-3 text-sm text-green-400 font-mono overflow-x-auto my-3 whitespace-pre";
        inlineCodeStyles = "bg-green-400/10 px-1.5 py-0.5 rounded text-sm text-green-400 font-mono";
        aStyles = "text-green-500 hover:text-green-300 hover:underline transition-colors underline decoration-green-500/50";
        blockquoteStyles = "border-l-2 border-green-500 pl-4 my-4 text-green-500/70 italic";
        break;
      case 'portfolio':
        headingStyles = "font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-4 pb-2";
        pStyles = "text-gray-200 leading-relaxed my-3 text-lg";
        aStyles = "text-pink-400 hover:text-pink-300 font-medium transition-colors";
        break;
      case 'startup':
        headingStyles = "font-semibold text-white tracking-tight mb-4 border-b border-white/5 pb-2";
        pStyles = "text-gray-400 leading-loose my-3";
        codeBlockStyles = "block bg-[#111115] shadow-inner rounded-xl px-4 py-3 text-sm text-blue-300 font-mono overflow-x-auto my-3 whitespace-pre";
        break;
      case 'academic':
        headingStyles = "font-serif font-bold text-white mb-4 border-b border-gray-600 pb-2";
        pStyles = "font-serif text-gray-300 leading-relaxed my-3 text-justify";
        blockquoteStyles = "border-l-4 border-gray-500 pl-4 my-4 text-gray-400 italic font-serif";
        break;
      case 'minimal':
        headingStyles = "font-light text-white tracking-wider mb-4 uppercase text-sm";
        pStyles = "text-gray-400 leading-relaxed my-3 text-sm font-light";
        break;
      case 'oss':
        headingStyles = "font-bold text-[#E2E8F0] mb-4 border-b border-gray-700 pb-2 flex items-center gap-2";
        aStyles = "text-[#38BDF8] hover:underline transition-colors";
        break;
      case 'chart':
        headingStyles = "font-bold text-white mb-4 border-l-4 border-cyan-500 pl-3";
        break;
      case 'classic':
      default:
        headingStyles = "font-bold text-white mb-4 border-b border-white/10 pb-2";
        break;
    }

    return {
      h1: ({ children }: any) => <h1 className={`text-3xl mt-6 ${headingStyles}`}>{children}</h1>,
      h2: ({ children }: any) => <h2 className={`text-2xl mt-6 ${headingStyles}`}>{children}</h2>,
      h3: ({ children }: any) => <h3 className={`text-xl mt-4 mb-2 font-semibold text-white`}>{children}</h3>,
      p: ({ children }: any) => <p className={pStyles}>{children}</p>,
      ul: ({ children }: any) => <ul className="list-disc list-outside space-y-1.5 my-3 pl-5 text-gray-300">{children}</ul>,
      ol: ({ children }: any) => <ol className="list-decimal list-outside space-y-1.5 my-3 pl-5 text-gray-300">{children}</ol>,
      li: ({ children }: any) => <li className="text-gray-300 leading-relaxed">{children}</li>,
      code: ({ children, className }: any) => {
        const isBlock = className?.includes("language-");
        return isBlock ? (
          <code className={codeBlockStyles}>{children}</code>
        ) : (
          <code className={inlineCodeStyles}>{children}</code>
        );
      },
      pre: ({ children }: any) => <pre className="my-0 bg-transparent">{children}</pre>,
      strong: ({ children }: any) => <strong className="font-semibold text-white">{children}</strong>,
      a: ({ href, children }: any) => <a href={href} target="_blank" rel="noopener noreferrer" className={aStyles}>{children}</a>,
      img: ({ src, alt }: any) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt || ""} className="inline-block max-w-full rounded-md border border-white/5 my-2 mr-2" />
      ),
      blockquote: ({ children }: any) => <blockquote className={blockquoteStyles}>{children}</blockquote>,
      table: ({ children }: any) => <div className="overflow-x-auto my-4"><table className="w-full border-collapse text-sm">{children}</table></div>,
      th: ({ children }: any) => <th className="border border-white/10 px-4 py-2 text-left font-semibold text-white bg-white/5">{children}</th>,
      td: ({ children }: any) => <td className="border border-white/10 px-4 py-2 text-gray-300">{children}</td>,
      hr: () => <hr className="border-white/10 my-6" />,
    };
  }, [themeStyle]);

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components as any}>
      {content}
    </ReactMarkdown>
  );
}
