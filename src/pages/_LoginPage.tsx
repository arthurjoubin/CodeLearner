import { useUser, UserProvider } from '../context/UserContext';
import { Github } from 'lucide-react';
import { api } from '../services/api';

function LoginPageContent() {
  const { isGuest, loading } = useUser();

  if (loading) {
    return (
      <div className="loading-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  // Already logged in → redirect to home
  if (!isGuest) {
    window.location.href = '/';
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-sm">
        <div className="border-2 border-gray-300 rounded-lg bg-white p-6">
          <div className="text-center mb-6">
            <span className="text-2xl font-bold tracking-widest text-gray-900">
              HACK<span className="text-primary-500">UP</span>
            </span>
            <p className="text-sm text-gray-600 mt-2">Sign in to save your progress</p>
          </div>

          <div className="space-y-3">
            <a
              href={api.getLoginUrl()}
              className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white px-4 py-2.5 text-sm font-bold rounded hover:bg-gray-700 transition-colors"
            >
              <Github className="w-4 h-4" />
              Continue with GitHub
            </a>
          </div>

          <div className="mt-6 text-center">
            <a href="/" className="text-xs text-gray-500 hover:text-primary-600 transition-colors">
              Back to home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <UserProvider>
      <LoginPageContent />
    </UserProvider>
  );
}
