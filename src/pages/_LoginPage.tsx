import { useUser, UserProvider } from '../context/UserContext';
import { Github } from 'lucide-react';
import { api } from '../services/api';
import { useState } from 'react';

function LoginPageContent() {
  const { isGuest, loading, loginWithPassword, register } = useUser();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isRegistering) {
        await register(email, password, name);
      } else {
        await loginWithPassword(email, password);
      }
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-sm">
        <div className="border-2 border-gray-300 rounded-lg bg-white p-6">
          <div className="text-center mb-6">
            <span className="text-2xl font-bold tracking-widest text-gray-900">
              HACK<span className="text-primary-500">UP</span>
            </span>
            <p className="text-sm text-gray-600 mt-2">
              {isRegistering ? 'Create an account' : 'Sign in to save your progress'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {isRegistering && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Your name"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-500 text-white px-4 py-2.5 text-sm font-bold rounded hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Please wait...' : isRegistering ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center space-y-2">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="block w-full text-xs text-gray-500 hover:text-primary-600 transition-colors"
            >
              {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
            </button>
            {!isRegistering && (
              <a href="/reset-password" className="block text-xs text-gray-500 hover:text-primary-600 transition-colors">
                Forgot password?
              </a>
            )}
          </div>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-4">
            <a
              href={api.getGitHubLoginUrl()}
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
