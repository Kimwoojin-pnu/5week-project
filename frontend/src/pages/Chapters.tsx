import { useState, useEffect } from 'react';
import { getChapters } from '../api/chapters';
import { Chapter } from '../types';
import ChapterCard from '../components/chapters/ChapterCard';

export default function Chapters() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getChapters()
      .then(setChapters)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Week 5 챕터</h1>
        <p className="text-gray-400 mb-8">딥러닝 핵심 개념 5개 챕터로 구성된 커리큘럼입니다.</p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
          </div>
        ) : (
          <div className="grid gap-4">
            {chapters.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
