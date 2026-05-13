import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { BADGE_DEFINITIONS } from '../data/badgeData';
import { UserBadge } from '../types/badges';
import { useTokens } from './TokenContext';

// ── Initial user state — all badges at 0 progress ────────────────────────────
const buildInitialState = (): Record<string, UserBadge> => {
  const state: Record<string, UserBadge> = {};
  BADGE_DEFINITIONS.forEach((b) => {
    state[b.id] = { id: b.id, currentProgress: 0, currentLevel: 0, claimedLevels: [] };
  });
  return state;
};

// ── Context types ─────────────────────────────────────────────────────────────
interface BadgeContextType {
  userBadges: Record<string, UserBadge>;
  notifications: number;
  completeActivity: (activityType: string, times?: number) => void;
  clearNotifications: () => void;
  getUnlockedCount: () => number;
  getTotalCount: () => number;
  getUserBadge: (id: string) => UserBadge;
}

const BadgeContext = createContext<BadgeContextType>({
  userBadges: {},
  notifications: 0,
  completeActivity: () => {},
  clearNotifications: () => {},
  getUnlockedCount: () => 0,
  getTotalCount: () => 0,
  getUserBadge: (id) => ({ id, currentProgress: 0, currentLevel: 0, claimedLevels: [] }),
});

export const useBadges = () => useContext(BadgeContext);

// ── Provider ──────────────────────────────────────────────────────────────────
export function BadgeProvider({ children }: { children: ReactNode }) {
  const { addTokens } = useTokens();
  const [userBadges, setUserBadges]   = useState<Record<string, UserBadge>>(buildInitialState);
  const [notifications, setNotifications] = useState(0);

  const clearNotifications = useCallback(() => setNotifications(0), []);

  /**
   * Call this whenever the user completes an activity.
   * It finds matching badges, increments their progress,
   * checks for level-ups and awards coins exactly once per level.
   */
  const completeActivity = useCallback(
    (activityType: string, times = 1) => {
      const matchingBadges = BADGE_DEFINITIONS.filter((b) => b.activityType === activityType);
      if (matchingBadges.length === 0) return;

      setUserBadges((prev) => {
        const next = { ...prev };

        matchingBadges.forEach((def) => {
          const current = { ...next[def.id] };
          current.currentProgress = current.currentProgress + times;

          let coinsEarned = 0;

          // Check each level in order
          for (const lvl of def.levels) {
            if (
              current.currentProgress >= lvl.target &&
              !current.claimedLevels.includes(lvl.level)
            ) {
              current.currentLevel = lvl.level as 1 | 2 | 3;
              current.claimedLevels = [...current.claimedLevels, lvl.level];
              coinsEarned += lvl.rewardCoins;
            }
          }

          if (coinsEarned > 0) {
              addTokens(coinsEarned);
              setNotifications((n) => n + 1);
            }

          next[def.id] = current;
        });

        return next;
      });
    },
    [addTokens],
  );

  const getUnlockedCount = useCallback(() => {
    return Object.values(userBadges).filter((b) => b.currentLevel > 0).length;
  }, [userBadges]);

  const getTotalCount = useCallback(() => BADGE_DEFINITIONS.length, []);

  const getUserBadge = useCallback(
    (id: string): UserBadge =>
      userBadges[id] ?? { id, currentProgress: 0, currentLevel: 0, claimedLevels: [] },
    [userBadges],
  );

  return (
    <BadgeContext.Provider value={{ userBadges, notifications, completeActivity, clearNotifications, getUnlockedCount, getTotalCount, getUserBadge }}>
      {children}
    </BadgeContext.Provider>
  );
}
