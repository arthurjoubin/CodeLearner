import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { User, getLevelFromXp } from '../types';
import { api } from '../services/api';

interface UserContextType {
  user: User | null;
  isGuest: boolean;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  addXp: (amount: number) => void;
  loseHeart: () => boolean;
  refillHearts: () => void;
  completeLesson: (lessonId: string) => void;
  completeExercise: (exerciseId: string) => void;
  updateStreak: () => void;
  isExerciseCompleted: (exerciseId: string) => boolean;
  isLessonCompleted: (lessonId: string) => boolean;
  unlockLab: (labId: string) => void;
  updateLabProgress: (labId: string, step: number, completed?: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Guest user (not persisted)
const GUEST_USER: User = {
  id: 'guest',
  name: 'Guest',
  xp: 0,
  level: 1,
  hearts: 5,
  maxHearts: 5,
  streak: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessons: [],
  completedExercises: [],
  moduleProgress: {},
  labProgress: {},
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(true);
  const [loading, setLoading] = useState(true);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  // Debounced save - only for authenticated users
  useEffect(() => {
    if (!user || isGuest || loading) return;

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(() => {
      api.saveUser(user).catch(console.error);
    }, 1000);

    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, [user, isGuest, loading]);

  const loadUser = async () => {
    try {
      const userData = await api.getMe();
      if (userData) {
        setUser(userData);
        setIsGuest(false);
      } else {
        setUser({ ...GUEST_USER });
        setIsGuest(true);
      }
    } catch {
      setUser({ ...GUEST_USER });
      setIsGuest(true);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    window.location.href = api.getLoginUrl();
  };

  const logout = async () => {
    await api.logout();
    setUser({ ...GUEST_USER });
    setIsGuest(true);
  };

  const addXp = useCallback((amount: number) => {
    setUser(prev => {
      if (!prev) return prev;
      const newXp = prev.xp + amount;
      const newLevel = getLevelFromXp(newXp).level;
      return { ...prev, xp: newXp, level: newLevel };
    });
  }, []);

  const loseHeart = useCallback(() => {
    let success = false;
    setUser(prev => {
      if (!prev || prev.hearts <= 0) return prev;
      success = true;
      return { ...prev, hearts: prev.hearts - 1 };
    });
    return success;
  }, []);

  const refillHearts = useCallback(() => {
    setUser(prev => prev ? { ...prev, hearts: prev.maxHearts } : prev);
  }, []);

  const completeLesson = useCallback((lessonId: string) => {
    setUser(prev => {
      if (!prev || prev.completedLessons.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
      };
    });
  }, []);

  const completeExercise = useCallback((exerciseId: string) => {
    setUser(prev => {
      if (!prev || prev.completedExercises.includes(exerciseId)) return prev;
      return {
        ...prev,
        completedExercises: [...prev.completedExercises, exerciseId],
      };
    });
  }, []);

  const updateStreak = useCallback(() => {
    setUser(prev => {
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
    return user?.completedLessons.includes(lessonId) || false;
  }, [user]);

  const isExerciseCompleted = useCallback((exerciseId: string): boolean => {
    return user?.completedExercises.includes(exerciseId) || false;
  }, [user]);

  const unlockLab = useCallback((labId: string) => {
    setUser(prev => {
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
    setUser(prev => {
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
        login,
        logout,
        addXp,
        loseHeart,
        refillHearts,
        completeLesson,
        completeExercise,
        updateStreak,
        isLessonCompleted,
        isExerciseCompleted,
        unlockLab,
        updateLabProgress,
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
