export type BadgeCategory =
  | 'Yeni Başlayan'
  | 'Təcrübəli'
  | 'Farm Hero'
  | 'Animal Friend'
  | 'Region Kəşfiyyatçısı'
  | 'Eco Turist'
  | 'Usta'
  | 'Legend';

export interface BadgeLevel {
  level: 1 | 2 | 3;
  target: number;
  rewardCoins: number;
  label: string;
}

export interface BadgeDefinition {
  id: string;
  azName: string;
  name: string;
  description: string;
  category: BadgeCategory;
  emoji: string;
  activityType: string;
  levels: BadgeLevel[];
}

export interface UserBadge {
  id: string;
  currentProgress: number;
  currentLevel: 0 | 1 | 2 | 3; // 0 = not yet started
  claimedLevels: number[];       // prevents double-rewarding
}
