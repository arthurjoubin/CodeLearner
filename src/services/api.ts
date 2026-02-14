import { User, ChatMessage, ValidationResult, LanguageExercise } from '../types';

const WORKER_URL = 'https://codelearner-api.arthurjoubin.workers.dev';
const LOCAL_URL = 'http://localhost:3001';

export const api = {
  async login(email: string, password: string): Promise<User> {
    const res = await fetch(`${WORKER_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Login failed');
    }
    const data = await res.json();
    return data.user;
  },

  async register(email: string, password: string, name: string): Promise<User> {
    const res = await fetch(`${WORKER_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Registration failed');
    }
    const data = await res.json();
    return data.user;
  },

  async resetPassword(currentPassword: string, newPassword: string): Promise<void> {
    const res = await fetch(`${WORKER_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Password reset failed');
    }
  },

  async getMe(): Promise<User | null> {
    const res = await fetch(`${WORKER_URL}/auth/me`, {
      credentials: 'include',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  },

  async logout(): Promise<void> {
    await fetch(`${WORKER_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  },

  // User endpoints
  async saveUser(user: User): Promise<void> {
    await fetch(`${WORKER_URL}/api/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(user),
    });
  },

  // Synchronous save for unmount (uses keepalive to survive page navigation)
  saveUserSync(user: User): void {
    try {
      fetch(`${WORKER_URL}/api/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(user),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // ignore
    }
  },

  // AI endpoints
  async validateCode(
    code: string,
    exercise: { instructions: string; validationPrompt: string }
  ): Promise<ValidationResult> {
    const res = await fetch(`${WORKER_URL}/api/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code, exercise }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Validation failed');
    }
    return res.json();
  },

  async chat(
    messages: ChatMessage[],
    context: { topic: string; lessonContent?: string }
  ): Promise<string> {
    const res = await fetch(`${WORKER_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ messages, context }),
    });
    if (!res.ok) throw new Error('Chat failed');
    const data = await res.json();
    return data.response;
  },

  async getHint(
    code: string,
    exercise: { instructions: string; hints: string[] },
    attemptCount: number
  ): Promise<string> {
    const res = await fetch(`${WORKER_URL}/api/hint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code, exercise, attemptCount }),
    });
    if (!res.ok) throw new Error('Failed to get hint');
    const data = await res.json();
    return data.hint;
  },

  async getLeaderboard(): Promise<Array<{ id: string; name: string; avatar_url: string | null; xp: number; level: number; streak: number }>> {
    const res = await fetch(`${WORKER_URL}/api/leaderboard`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch leaderboard');
    const data = await res.json();
    return data.users;
  },

  async executeCode(code: string, language: string): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    const baseUrl = import.meta.env.DEV ? LOCAL_URL : WORKER_URL;
    const res = await fetch(`${baseUrl}/api/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code, language }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Code execution failed');
    }
    return res.json();
  },

  // CodeCraft endpoints
  async generateExercise(language: string, difficulty: 'easy' | 'medium' | 'hard'): Promise<{ exercise: LanguageExercise }> {
    const baseUrl = import.meta.env.DEV ? LOCAL_URL : WORKER_URL;
    const res = await fetch(`${baseUrl}/api/codecraft/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ language, difficulty }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to generate exercise');
    }
    return res.json();
  },

  async getDailyChallenge(): Promise<{ date: string; exercise: LanguageExercise }> {
    const baseUrl = import.meta.env.DEV ? LOCAL_URL : WORKER_URL;
    const res = await fetch(`${baseUrl}/api/codecraft/daily`, {
      credentials: 'include',
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to get daily challenge');
    }
    return res.json();
  },

  async getDailyChallengeHistory(limit: number = 30): Promise<{ history: Array<{ date: string; language: string; difficulty: string; title: string | null; description: string | null }> }> {
    const baseUrl = import.meta.env.DEV ? LOCAL_URL : WORKER_URL;
    const res = await fetch(`${baseUrl}/api/codecraft/history?limit=${limit}`, {
      credentials: 'include',
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to get challenge history');
    }
    return res.json();
  },

  async getDailyChallengeByDate(date: string): Promise<{ date: string; exercise: LanguageExercise }> {
    const baseUrl = import.meta.env.DEV ? LOCAL_URL : WORKER_URL;
    const res = await fetch(`${baseUrl}/api/codecraft/history/${date}`, {
      credentials: 'include',
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to get daily challenge');
    }
    return res.json();
  },
};
