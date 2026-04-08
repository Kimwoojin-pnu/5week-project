import { Link } from 'react-router-dom';
import { Chapter } from '../../types';
import { useAuthStore } from '../../store/authStore';

interface Props {
  chapter: Chapter;
}

export default function ChapterCard({ chapter }: Props) {
  const { user } = useAuthStore();
  const isLocked = !chapter.is_free && (!user || user.plan === 'free');

  return (
    <Link
      to={isLocked ? '/pricing' : `/chapters/${chapter.id}`}
      className="block bg-gray-800 rounded-xl p-6 hover:bg-gray-750 border border-gray-700 hover:border-blue-500 transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-gray-600 group-hover:text-blue-400 transition-colors">
            {String(chapter.order).padStart(2, '0')}
          </span>
          <div>
            <h3 className="text-white font-semibold group-hover:text-blue-300 transition-colors">
              {chapter.title}
            </h3>
            <p className="text-gray-400 text-sm mt-1">{chapter.description}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {chapter.is_free ? (
            <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded font-medium">
              무료
            </span>
          ) : (
            <span className="text-xs bg-yellow-900 text-yellow-300 px-2 py-0.5 rounded font-medium">
              PRO
            </span>
          )}
          {isLocked && (
            <span className="text-gray-500 text-lg">🔒</span>
          )}
        </div>
      </div>
    </Link>
  );
}
