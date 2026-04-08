import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { getGoogleLoginUrl } from '../../api/auth';

export default function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-400 hover:text-blue-300">
          DL Week 5
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/chapters" className="hover:text-blue-300 transition-colors">
            챕터
          </Link>
          <Link to="/pricing" className="hover:text-blue-300 transition-colors">
            요금제
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              {user.picture && (
                <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
              )}
              <Link to="/profile" className="hover:text-blue-300 transition-colors text-sm">
                {user.name}
              </Link>
              {user.plan === 'pro' && (
                <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded">
                  PRO
                </span>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <a
              href={getGoogleLoginUrl()}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Google로 로그인
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
