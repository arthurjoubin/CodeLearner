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
  isLessonCompleted: (lessonId: string) => boolean;
  isExerciseCompleted: (exerciseId: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const DEFAULT_USER: User = {
  id: 'user-1',
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
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await api.getUser();
      setUser(userData);
    } catch {
      // If no user exists, create default
      const newUser = { ...DEFAULT_USER };
      await api.saveUser(newUser);
      setUser(newUser);
    } finally {
      setLoading(false);
    }
  };

  const saveUser = useCallback(async (updatedUser: User) => {
    setUser(updatedUser);
    await api.saveUser(updatedUser);
  }, []);

  const addXp = useCallback((amount: number) => {
    if (!user) return;
    const newXp = user.xp + amount;
    const newLevel = getLevelFromXp(newXp).level;
    saveUser({ ...user, xp: newXp, level: newLevel });
  }, [user, saveUser]);

  const loseHeart = useCallback((): boolean => {
    if (!user) return false;
    if (user.hearts <= 0) return false;
    saveUser({ ...user, hearts: user.hearts - 1 });
    return true;
  }, [user, saveUser]);

  const refillHearts = useCallback(() => {
    if (!user) return;
    saveUser({ ...user, hearts: user.maxHearts });
  }, [user, saveUser]);

  const completeLesson = useCallback((lessonId: string) => {
    if (!user || user.completedLessons.includes(lessonId)) return;
    saveUser({
      ...user,
      completedLessons: [...user.completedLessons, lessonId],
    });
  }, [user, saveUser]);

  const completeExercise = useCallback((exerciseId: string) => {
    if (!user || user.completedExercises.includes(exerciseId)) return;
    saveUser({
      ...user,
      completedExercises: [...user.completedExercises, exerciseId],
    });
  }, [user, saveUser]);

  const updateStreak = useCallback(() => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const lastActive = user.lastActiveDate;

    if (lastActive === today) return;

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const newStreak = lastActive === yesterday ? user.streak + 1 : 1;

    saveUser({
      ...user,
      streak: newStreak,
      lastActiveDate: today,
    });
  }, [user, saveUser]);

  const isLessonCompleted = useCallback((lessonId: string): boolean => {
    return user?.completedLessons.includes(lessonId) || false;
  }, [user]);

  const isExerciseCompleted = useCallback((exerciseId: string): boolean => {
    return user?.completedExercises.includes(exerciseId) || false;
  }, [user]);

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
