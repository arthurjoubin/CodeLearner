import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, getLevelFromXp } from '../types';
import { api } from '../services/api';

interface UserContextType {
  user: User | null;
  loading: boolean;
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

function getDefaultUser(): User {
  return {
    id: api.getUserId(),
    email: `${api.getUserId()}@local.user`,
    name: 'Learner',
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
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user && !loading) {
      api.saveUser(user);
    }
  }, [user, loading]);

  const loadUser = async () => {
    try {
      const userData = await api.getUser();
      setUser({
        ...getDefaultUser(),
        ...userData,
        labProgress: userData.labProgress || {},
      });
    } catch {
      // If no user exists, create default
      const newUser = { ...getDefaultUser() };
      setUser(newUser);
      // api.saveUser will be called by useEffect
    } finally {
      setLoading(false);
    }
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
        loading,
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
