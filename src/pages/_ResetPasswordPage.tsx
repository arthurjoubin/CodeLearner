import { useState } from 'react';
import { api } from '../services/api';

export default function ResetPasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      await api.resetPassword(currentPassword, newPassword);
      setSuccess('Mot de passe mis à jour ! Tu peux maintenant te reconnecter.');
      setCurrentPassword('');
      setNewPassword('');
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
            <p className="text-sm text-gray-600 mt-2">Changer ton mot de passe</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-600 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Mot de passe actuel</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
              {isSubmitting ? 'Patiente...' : 'Changer le mot de passe'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <a href="/login" className="block text-xs text-gray-500 hover:text-primary-600 transition-colors">
              Retour au login
            </a>
            <a href="/" className="block text-xs text-gray-500 hover:text-primary-600 transition-colors">
              Retour à l'accueil
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
