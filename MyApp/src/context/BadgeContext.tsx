import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { BADGE_DEFINITIONS } from '../data/badgeData';
import { UserBadge } from '../types/badges';
import { useTokens } from './TokenContext';

const buildInitialState = (): Record<string, UserBadge> => {
  const state: Record<string, UserBadge> = {};
  BADGE_DEFINITIONS.forEach((b) => {
    state[b.id] = { id: b.id, currentProgress: 0, currentLevel: 0, claimedLevels: [] };
  });
  return state;
};

interface BadgeContextType {
  userBadges: Record<string, UserBadge>;
  notifications: number;
  completeActivity: (activityType: string, times?: number) => void;
  claimBadgeLevel: (id: string, level: number) => void;
  clearNotifications: () => void;
  getUnlockedCount: () => number;
  getTotalCount: () => number;
  getUserBadge: (id: string) => UserBadge;
  isLevelClaimable: (id: string, level: number) => boolean;
  getLevelReward: (id: string, level: number) => number;
}

const BadgeContext = createContext<BadgeContextType>({
  userBadges: {},
  notifications: 0,
  completeActivity: () => {},
  claimBadgeLevel: () => {},
  clearNotifications: () => {},
  getUnlockedCount: () => 0,
  getTotalCount: () => 0,
  getUserBadge: (id) => ({ id, currentProgress: 0, currentLevel: 0, claimedLevels: [] }),
  isLevelClaimable: () => false,
  getLevelReward: () => 0,
});

export const useBadges = () => useContext(BadgeContext);

export function BadgeProvider({ children }: { children: ReactNode }) {
  const { addTokens } = useTokens();
  const [userBadges, setUserBadges] = useState<Record<string, UserBadge>>(buildInitialState);

  /**
   * Increments badge progress. Does NOT auto-award tokens.
   * Tokens are only awarded when the user explicitly calls claimBadgeLevel().
   */
  const completeActivity = useCallback((activityType: string, times = 1) => {
    const matching = BADGE_DEFINITIONS.filter((b) => b.activityType === activityType);
    if (!matching.length) return;

    setUserBadges((prev) => {
      const next = { ...prev };
      matching.forEach((def) => {
        const current = { ...next[def.id] };
        current.currentProgress += times;
        // Update currentLevel based on reached thresholds (not claimed)
        for (const lvl of def.levels) {
          if (current.currentProgress >= lvl.target && current.currentLevel < lvl.level) {
            current.currentLevel = lvl.level as 1 | 2 | 3;
          }
        }
        next[def.id] = current;
      });
      return next;
    });
  }, []);

  /**
   * User explicitly claims a badge level reward.
   * Awards tokens and marks the level as claimed (prevents reclaim).
   */
  const claimBadgeLevel = useCallback((id: string, level: number) => {
    const def    = BADGE_DEFINITIONS.find((b) => b.id === id);
    const lvlDef = def?.levels.find((l) => l.level === level);
    if (!def || !lvlDef) return;

    setUserBadges((prev) => {
      const current = prev[id];
      if (!current || current.claimedLevels.includes(level)) return prev;
      return {
        ...prev,
        [id]: { ...current, claimedLevels: [...current.claimedLevels, level] },
      };
    });
    addTokens(lvlDef.rewardCoins);
  }, [addTokens]);

  /**
   * True when a badge level has been reached but tokens not yet collected.
   */
  const isLevelClaimable = useCallback((id: string, level: number): boolean => {
    const badge = userBadges[id];
    return !!(badge && badge.currentLevel >= level && !badge.claimedLevels.includes(level));
  }, [userBadges]);

  const getLevelReward = useCallback((id: string, level: number): number => {
    return BADGE_DEFINITIONS.find((b) => b.id === id)?.levels.find((l) => l.level === level)?.rewardCoins ?? 0;
  }, []);

  // Notifications = count of unclaimed ready badge levels
  const notifications = useMemo(() => {
    return BADGE_DEFINITIONS.reduce((total, def) => {
      const badge = userBadges[def.id];
      if (!badge) return total;
      return total + def.levels.filter(
        (lvl) => badge.currentLevel >= lvl.level && !badge.claimedLevels.includes(lvl.level),
      ).length;
    }, 0);
  }, [userBadges]);

  const clearNotifications = useCallback(() => {}, []); // Computed — no-op, kept for interface compat

  const getUnlockedCount = useCallback(() =>
    Object.values(userBadges).filter((b) => b.currentLevel > 0).length,
  [userBadges]);

  const getTotalCount = useCallback(() => BADGE_DEFINITIONS.length, []);

  const getUserBadge = useCallback(
    (id: string): UserBadge =>
      userBadges[id] ?? { id, currentProgress: 0, currentLevel: 0, claimedLevels: [] },
    [userBadges],
  );

  return (
    <BadgeContext.Provider value={{
      userBadges, notifications,
      completeActivity, claimBadgeLevel, clearNotifications,
      getUnlockedCount, getTotalCount, getUserBadge,
      isLevelClaimable, getLevelReward,
    }}>
      {children}
    </BadgeContext.Provider>
  );
}
