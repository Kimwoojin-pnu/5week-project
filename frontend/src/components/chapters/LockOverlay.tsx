import { Link } from 'react-router-dom';

export default function LockOverlay() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-gray-800 rounded-xl border border-gray-700">
      <div className="text-6xl mb-4">🔒</div>
      <h2 className="text-2xl font-bold text-white mb-2">Pro 플랜 전용 콘텐츠</h2>
      <p className="text-gray-400 mb-6 max-w-md">
        이 챕터는 Pro 플랜 사용자만 열람할 수 있습니다.
        월 $9로 모든 챕터와 실습 자료에 접근하세요.
      </p>
      <Link
        to="/pricing"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
      >
        Pro로 업그레이드
      </Link>
    </div>
  );
}
