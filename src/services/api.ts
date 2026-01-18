import { User, ChatMessage, ValidationResult } from '../types';

const API_BASE = '/api';

export const api = {
  // User endpoints
  async getUser(): Promise<User> {
    const res = await fetch(`${API_BASE}/user`);
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
