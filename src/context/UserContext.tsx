import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, getLevelFromXp } from '../types';
import { api } from '../services/api';

interface UserContextType {
  user: User | null;
  isGuest: boolean;
  loading: boolean;
  debugShowAll: boolean;
  loginWithPassword: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  addXp: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
  completeExercise: (exerciseId: string) => void;
  updateStreak: () => void;
  isExerciseCompleted: (exerciseId: string) => boolean;
  isLessonCompleted: (lessonId: string) => boolean;
  unlockLab: (labId: string) => void;
  updateLabProgress: (labId: string, step: number, completed?: boolean) => void;
  setDebugShowAll: (value: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Guest user (not persisted)
const GUEST_USER: User = {
  id: 'guest',
  name: 'Guest',
  xp: 0,
  recentXp: 0,
  level: 1,
  streak: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessons: [],
  completedExercises: [],
  moduleProgress: {},
  labProgress: {},
};

// ── Shared singleton store ──────────────────────────────────────────────
// Astro islands are separate React trees, so React context doesn't flow
// between Layout and page components. This store on `window` ensures every
// UserProvider instance shares the same state, fetches once, and saves once.
//
// Additionally, state is cached in localStorage so that navigating between
// pages (full reloads) sees the latest progress instantly, even before the
// API save round-trips.

interface SharedStore {
  user: User | null;
  isGuest: boolean;
  loading: boolean;
  fetchPromise: Promise<void> | null;
  saveTimeout: ReturnType<typeof setTimeout> | null;
  listeners: Set<() => void>;
}

const STORE_KEY = '__hackupUserStore';
const CACHE_KEY = 'hackup_user_cache';

// ── localStorage cache ──────────────────────────────────────────────────

function cacheUser(user: User | null) {
  if (!user || user.id === 'guest') return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(user));
  } catch { /* quota exceeded – ignore */ }
}

function getCachedUser(): User | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clearCachedUser() {
  try { localStorage.removeItem(CACHE_KEY); } catch { /* ignore */ }
}

/** Merge local cache and remote API data so no progress is ever lost. */
function mergeUsers(local: User, remote: User): User {
  const completedLessons = [...new Set([
    ...(local.completedLessons || []),
    ...(remote.completedLessons || []),
  ])];
  const completedExercises = [...new Set([
    ...(local.completedExercises || []),
    ...(remote.completedExercises || []),
  ])];
  return {
    ...remote,
    xp: Math.max(local.xp || 0, remote.xp || 0),
    level: getLevelFromXp(Math.max(local.xp || 0, remote.xp || 0)).level,
    streak: Math.max(local.streak || 0, remote.streak || 0),
    lastActiveDate: local.lastActiveDate > remote.lastActiveDate ? local.lastActiveDate : remote.lastActiveDate,
    completedLessons,
    completedExercises,
    labProgress: { ...(remote.labProgress || {}), ...(local.labProgress || {}) },
  };
}

// ── Shared window store ─────────────────────────────────────────────────

function getStore(): SharedStore {
  if (typeof window === 'undefined') {
    return { user: null, isGuest: true, loading: true, fetchPromise: null, saveTimeout: null, listeners: new Set() };
  }
  if (!(window as any)[STORE_KEY]) {
    (window as any)[STORE_KEY] = {
      user: null,
      isGuest: true,
      loading: true,
      fetchPromise: null,
      saveTimeout: null,
      listeners: new Set(),
    } satisfies SharedStore;
  }
  return (window as any)[STORE_KEY] as SharedStore;
}

function notifyListeners() {
  const store = getStore();
  store.listeners.forEach(fn => fn());
}

/** Fetch user from API – only the first call actually fetches; others await the same promise. */
function initStore(): Promise<void> {
  const store = getStore();
  if (store.fetchPromise) return store.fetchPromise;

  // 1. Load from localStorage cache instantly (no loading flash, no stale data)
  const cached = getCachedUser();
  if (cached) {
    store.user = cached;
    store.isGuest = false;
    store.loading = false;
    notifyListeners();
  }

  // 2. Then fetch from API and merge so server-side data is never lost
  store.fetchPromise = (async () => {
    try {
      const remote = await api.getMe();
      if (remote) {
        const merged = cached ? mergeUsers(cached, remote) : remote;
        store.user = merged;
        store.isGuest = false;
        cacheUser(merged);
        // If merge added progress the server didn't know about, push it back
        if (cached && (
          merged.completedLessons.length > remote.completedLessons.length ||
          merged.completedExercises.length > remote.completedExercises.length ||
          merged.xp > remote.xp
        )) {
          scheduleSave();
        }
      } else if (!cached) {
        store.user = { ...GUEST_USER };
        store.isGuest = true;
      }
    } catch {
      if (!cached) {
        store.user = { ...GUEST_USER };
        store.isGuest = true;
      }
    } finally {
      store.loading = false;
      notifyListeners();
    }
  })();

  return store.fetchPromise;
}

/** Update user in the shared store, cache to localStorage, and schedule a debounced save. */
function updateStoreUser(updater: (prev: User | null) => User | null) {
  const store = getStore();
  const next = updater(store.user);
  if (next === store.user) return;
  store.user = next;
  cacheUser(next);
  notifyListeners();
  scheduleSave();
}

function scheduleSave() {
  const store = getStore();
  if (store.isGuest || !store.user) return;
  if (store.saveTimeout) clearTimeout(store.saveTimeout);
  store.saveTimeout = setTimeout(() => {
    store.saveTimeout = null;
    if (store.user && !store.isGuest) {
      api.saveUser(store.user).catch(console.error);
    }
  }, 1000);
}

/** Flush any pending save immediately (used on page unload). */
function flushSave() {
  const store = getStore();
  if (store.saveTimeout) {
    clearTimeout(store.saveTimeout);
    store.saveTimeout = null;
  }
  if (store.user && !store.isGuest) {
    api.saveUserSync(store.user);
  }
}

// Save on page unload – registered once globally
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flushSave);
}

// ── React provider ──────────────────────────────────────────────────────

export function UserProvider({ children }: { children: React.ReactNode }) {
  // Start with `hydrated = false` so the first client render matches the
  // server render (loading state, no user).  After mount we flip it on and
  // read from the shared store, avoiding any hydration mismatch.
  const [hydrated, setHydrated] = useState(false);
  const [, bump] = useState(0);
  const [debugShowAll, setDebugShowAllState] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const store = getStore();
    const listener = () => bump(n => n + 1);
    store.listeners.add(listener);
    initStore();

    // Initialize debug mode from localStorage
    const savedDebug = localStorage.getItem('debug_show_all') === 'true';
    setDebugShowAllState(savedDebug);

    return () => { store.listeners.delete(listener); };
  }, []);

  const setDebugShowAll = useCallback((value: boolean) => {
    localStorage.setItem('debug_show_all', String(value));
    setDebugShowAllState(value);
  }, []);

  const store = hydrated ? getStore() : null;
  const user = store?.user ?? null;
  const isGuest = store?.isGuest ?? true;
  const loading = store ? store.loading : true;

  const loginWithPassword = useCallback(async (email: string, password: string) => {
    const userData = await api.login(email, password);
    const s = getStore();
    s.user = userData;
    s.isGuest = false;
    cacheUser(userData);
    notifyListeners();
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    const userData = await api.register(email, password, name);
    const s = getStore();
    s.user = userData;
    s.isGuest = false;
    cacheUser(userData);
    notifyListeners();
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    const s = getStore();
    s.user = { ...GUEST_USER };
    s.isGuest = true;
    clearCachedUser();
    notifyListeners();
    window.location.href = '/';
  }, []);

  const addXp = useCallback((amount: number) => {
    updateStoreUser(prev => {
      if (!prev) return prev;
      const newXp = prev.xp + amount;
      const newLevel = getLevelFromXp(newXp).level;
      return { ...prev, xp: newXp, recentXp: amount, level: newLevel };
    });
  }, []);

  const completeLesson = useCallback((lessonId: string) => {
    updateStoreUser(prev => {
      if (!prev || prev.completedLessons.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
      };
    });
  }, []);

  const completeExercise = useCallback((exerciseId: string) => {
    updateStoreUser(prev => {
      if (!prev || prev.completedExercises.includes(exerciseId)) return prev;
      return {
        ...prev,
        completedExercises: [...prev.completedExercises, exerciseId],
      };
    });
  }, []);

  const updateStreak = useCallback(() => {
    updateStoreUser(prev => {
      if (!prev) return prev;
      const today = new Date().toISOString().split('T')[0];
      const lastActive = prev.lastActiveDate;
      if (lastActive === today) return prev;

      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const newStreak = lastActive === yesterday ? prev.streak + 1 : 1;

      return {
        ...prev,
        streak: newStreak,
        lastActiveDate: today,
      };
    });
  }, []);

  const isLessonCompleted = useCallback((lessonId: string): boolean => {
    return user?.completedLessons?.includes(lessonId) || false;
  }, [user?.completedLessons]);

  const isExerciseCompleted = useCallback((exerciseId: string): boolean => {
    return user?.completedExercises?.includes(exerciseId) || false;
  }, [user?.completedExercises]);

  const unlockLab = useCallback((labId: string) => {
    updateStoreUser(prev => {
      if (!prev) return prev;
      const currentLabProgress = prev.labProgress?.[labId] || { unlocked: true, completed: false, currentStep: 0 };
      return {
        ...prev,
        labProgress: {
          ...prev.labProgress,
          [labId]: { ...currentLabProgress, unlocked: true }
        }
      };
    });
  }, []);

  const updateLabProgress = useCallback((labId: string, step: number, completed: boolean = false) => {
    updateStoreUser(prev => {
      if (!prev) return prev;
      const currentLabProgress = prev.labProgress?.[labId] || { unlocked: true, completed: false, currentStep: 0 };
      return {
        ...prev,
        labProgress: {
          ...prev.labProgress,
          [labId]: { ...currentLabProgress, currentStep: step, completed: completed || currentLabProgress.completed }
        }
      };
    });
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isGuest,
        loading,
        debugShowAll,
        loginWithPassword,
        register,
        logout,
        addXp,
        completeLesson,
        completeExercise,
        updateStreak,
        isLessonCompleted,
        isExerciseCompleted,
        unlockLab,
        updateLabProgress,
        setDebugShowAll,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
