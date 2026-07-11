import { useState, useEffect } from 'react';
import type { DailyStat, UserAction } from '../types';
import { poems } from '../data';

const STORAGE_KEY = 'poetry-flow-stats';

export const usePoemStats = () => {
  const [actions, setActions] = useState<UserAction[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      try {
        setActions(JSON.parse(storedData));
      } catch (e) {
        console.error('Failed to parse stats', e);
      }
    }
  }, []);

  useEffect(() => {
    if (actions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(actions));
    }
  }, [actions]);

  const recordAction = (poemId: number, action: 'like' | 'dislike') => {
    const newAction: UserAction = {
      poemId,
      action,
      timestamp: Date.now(),
    };
    setActions((prev) => [...prev, newAction]);
  };

  const getStats = () => {
    const totalSwipes = actions.length;
    const likes = actions.filter((a) => a.action === 'like').length;
    const dislikes = actions.filter((a) => a.action === 'dislike').length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySwipes = actions.filter((a) => a.timestamp >= today.getTime()).length;

    // Calculate weekly activity
    const weeklyActivity: DailyStat[] = [];
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const startOfDay = d.getTime();
      
      const nextDay = new Date(d);
      nextDay.setDate(d.getDate() + 1);
      const endOfDay = nextDay.getTime();

      const count = actions.filter(
        (a) => a.timestamp >= startOfDay && a.timestamp < endOfDay
      ).length;

      weeklyActivity.push({
        day: days[d.getDay()],
        count: count,
        isTarget: i === 0, // Highlight today
      });
    }

    return {
      totalSwipes,
      todaySwipes,
      likes,
      dislikes,
      weeklyActivity,
    };
  };

  const getLikedPoems = () => {
    const likedIds = new Set(
      actions
        .filter((a) => a.action === 'like')
        .map((a) => a.poemId)
    );
    
    return poems.filter((poem) => likedIds.has(poem.id));
  };

  const removeLike = (poemId: number) => {
    setActions((prev) => prev.filter((a) => !(a.poemId === poemId && a.action === 'like')));
    // If the storage becomes empty, we clean localStorage
    const remaining = actions.filter((a) => !(a.poemId === poemId && a.action === 'like'));
    if (remaining.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
    }
  };

  return {
    recordAction,
    getStats,
    getLikedPoems,
    removeLike,
  };
};
