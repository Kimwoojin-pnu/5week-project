import { useAuthStore } from '../store/authStore';

export default function Profile() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">프로필</h1>
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
          <div className="flex items-center gap-6 mb-8">
            {user.picture ? (
              <img src={user.picture} alt={user.name} className="w-20 h-20 rounded-full" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold">
                {user.name[0]}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-400">{user.email}</p>
              <div className="mt-2">
                {user.plan === 'pro' ? (
                  <span className="bg-yellow-500 text-black text-sm font-bold px-3 py-1 rounded-full">
                    Pro 플랜
                  </span>
                ) : (
                  <span className="bg-gray-700 text-gray-300 text-sm px-3 py-1 rounded-full">
                    Free 플랜
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6">
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-gray-400">이메일</dt>
                <dd className="text-white">{user.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">플랜</dt>
                <dd className="text-white capitalize">{user.plan}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </main>
  );
}
