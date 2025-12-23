
export interface Exercise {
  r: number; // Rank
  n: string; // Name
  ne: number; // Specificity Score (Niveau d'Exigence)
  l: number; // Level (1-5)
}

export enum LevelID {
  COMPETITION = 1,
  SPECIAL = 2,
  DIRIGE = 3,
  GENERAL = 4,
  GENERIQUE = 5
}

export interface LevelMetadata {
  id: LevelID;
  name: string;
  range: string;
  color: string;
  description: string;
}
