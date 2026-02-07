export interface Env {
  DB: D1Database;
  DEEPSEEK_API_KEY: string;
  FRONTEND_URL: string;
  ADMIN_SECRET?: string;
}

export interface UserProgress {
  user_id: string;
  xp: number;
  level: number;
  streak: number;
  last_active_date: string | null;
  completed_lessons: string;
  completed_exercises: string;
  module_progress: string;
  lab_progress: string;
}

export interface UserRow {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  password_hash: string | null;
  is_admin: number;
}
