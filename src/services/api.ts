import { User, ChatMessage, ValidationResult } from '../types';

const WORKER_URL = 'https://codelearner-api.arthurjoubin.workers.dev';

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

  async resetPassword(email: string, newPassword: string): Promise<void> {
    const res = await fetch(`${WORKER_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, newPassword }),
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
};
