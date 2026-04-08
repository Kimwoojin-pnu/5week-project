import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getChapter } from '../api/chapters';
import { ChapterDetail as ChapterDetailType } from '../types';
import LockOverlay from '../components/chapters/LockOverlay';

export default function ChapterDetail() {
  const { id } = useParams<{ id: string }>();
  const [chapter, setChapter] = useState<ChapterDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (!id) return;
    getChapter(Number(id))
      .then(setChapter)
      .catch((err) => {
        if (err.response?.status === 403) setLocked(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (locked) {
    return (
      <main className="min-h-screen bg-gray-950 text-white">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Link to="/chapters" className="text-blue-400 hover:text-blue-300 mb-8 inline-block">
            ← 챕터 목록
          </Link>
          <LockOverlay />
        </div>
      </main>
    );
  }

  if (!chapter) return null;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link to="/chapters" className="text-blue-400 hover:text-blue-300 mb-8 inline-block">
          ← 챕터 목록
        </Link>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm text-gray-500">Chapter {chapter.order}</span>
          {chapter.is_free ? (
            <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded">무료</span>
          ) : (
            <span className="text-xs bg-yellow-900 text-yellow-300 px-2 py-0.5 rounded">PRO</span>
          )}
        </div>
        <h1 className="text-4xl font-bold mb-4">{chapter.title}</h1>
        <p className="text-gray-400 text-lg mb-10">{chapter.description}</p>

        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown
            components={{
              code({ node, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match;
                return !isInline ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-xl"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-gray-800 px-1.5 py-0.5 rounded text-blue-300 text-sm" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {chapter.content}
          </ReactMarkdown>
        </div>
      </div>
    </main>
  );
}
