import { Link } from 'react-router-dom';

const CHAPTERS = [
  { id: 1, title: 'Regularization', desc: 'L1/L2, Dropout, BatchNorm', free: true },
  { id: 2, title: 'Overfitting vs Underfitting', desc: '과적합/과소적합 이해', free: true },
  { id: 3, title: 'Data Augmentation', desc: '데이터 증강 기법', free: false },
  { id: 4, title: 'Transfer Learning', desc: '전이 학습과 사전학습 모델', free: false },
  { id: 5, title: 'MNIST CNN 실습', desc: 'CNN으로 손글씨 분류', free: false },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="inline-block bg-blue-900 text-blue-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          딥러닝 입문 커리큘럼
        </div>
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          딥러닝 Week 5<br />
          <span className="text-blue-400">핵심 개념 마스터</span>
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10">
          Regularization부터 CNN 실습까지. 코드 예시와 시각화로 개념을 완전히 이해하세요.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/chapters"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            무료로 시작하기
          </Link>
          <Link
            to="/pricing"
            className="border border-gray-600 hover:border-blue-500 text-gray-300 hover:text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            요금제 보기
          </Link>
        </div>
      </section>

      {/* Chapters Preview */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold mb-8 text-center">커리큘럼</h2>
        <div className="grid gap-4 max-w-2xl mx-auto">
          {CHAPTERS.map((ch) => (
            <div
              key={ch.id}
              className="flex items-center gap-4 bg-gray-800 rounded-xl p-5 border border-gray-700"
            >
              <span className="text-3xl font-black text-gray-600 w-10 text-center">
                {ch.id}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{ch.title}</span>
                  {ch.free ? (
                    <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded">무료</span>
                  ) : (
                    <span className="text-xs bg-yellow-900 text-yellow-300 px-2 py-0.5 rounded">PRO</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mt-0.5">{ch.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
