import { User, ChatMessage, ValidationResult } from '../types';

const API_BASE = import.meta.env.PROD
  ? 'https://codelearner-api.arthurjoubin.workers.dev/api'
  : '/api';

// Get or create a unique user ID for this browser
function getUserId(): string {
  let id = localStorage.getItem('codelearner_user_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('codelearner_user_id', id);
  }
  return id;
}

export const api = {
  getUserId,

  // User endpoints
  async getUser(): Promise<User> {
    const userId = getUserId();
    const res = await fetch(`${API_BASE}/user/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },

  async saveUser(user: User): Promise<void> {
    await fetch(`${API_BASE}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
  },

  // AI endpoints
  async validateCode(
    code: string,
    exercise: { instructions: string; validationPrompt: string }
  ): Promise<ValidationResult> {
    const res = await fetch(`${API_BASE}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, exercise }),
    });
    if (!res.ok) throw new Error('Validation failed');
    return res.json();
  },

  async chat(
    messages: ChatMessage[],
    context: { topic: string; lessonContent?: string }
  ): Promise<string> {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    const res = await fetch(`${API_BASE}/hint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, exercise, attemptCount }),
    });
    if (!res.ok) throw new Error('Failed to get hint');
    const data = await res.json();
    return data.hint;
  },
};
