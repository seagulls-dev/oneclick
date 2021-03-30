export interface TrainingConfig {
  ratingCriteria?: RatingCriteriaPool;
}

export interface RatingCriteria {
  title: string;
  tagline: string; // ex: Runner - speed
  benchmarks: Benchmark[]; // benchmark id's
}
export interface Benchmark {
  minScore: number; // ex: 3
  meaning: string; // ex: Leans on wall
}

export type RatingCriteriaPool = { [criteriaId: string]: RatingCriteria };
export type CriteriaId = string;