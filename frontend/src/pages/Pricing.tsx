import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { createCheckout } from '../api/payment';

export default function Pricing() {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      const { checkout_url } = await createCheckout();
      window.location.href = checkout_url;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">요금제 선택</h1>
        <p className="text-gray-400 text-lg mb-12">
          무료로 시작하고, 필요하면 업그레이드하세요.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Free Plan */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <h2 className="text-xl font-bold mb-2">Free</h2>
            <div className="text-4xl font-black mb-6">$0</div>
            <ul className="text-left space-y-3 mb-8">
              {['챕터 1: Regularization', '챕터 2: Overfitting vs Underfitting', '기본 개념 설명'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span> {item}
                </li>
              ))}
            </ul>
            {user?.plan === 'free' || !user ? (
              <div className="w-full py-3 border border-gray-600 rounded-lg text-gray-400 text-center">
                현재 플랜
              </div>
            ) : null}
          </div>

          {/* Pro Plan */}
          <div className="bg-blue-900 rounded-2xl p-8 border-2 border-blue-500 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">
              추천
            </div>
            <h2 className="text-xl font-bold mb-2">Pro</h2>
            <div className="text-4xl font-black mb-1">$9</div>
            <div className="text-blue-300 text-sm mb-6">/ 월</div>
            <ul className="text-left space-y-3 mb-8">
              {[
                '모든 챕터 (1~5) 열람',
                'Data Augmentation 실습',
                'Transfer Learning 가이드',
                'MNIST CNN 전체 코드',
                '실습 파일 다운로드',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-blue-100">
                  <span className="text-yellow-400">✓</span> {item}
                </li>
              ))}
            </ul>
            {user?.plan === 'pro' ? (
              <div className="w-full py-3 bg-green-600 rounded-lg text-white text-center font-semibold">
                현재 플랜 ✓
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-3 bg-blue-500 hover:bg-blue-400 rounded-lg text-white font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? '처리 중...' : 'Pro로 업그레이드'}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
