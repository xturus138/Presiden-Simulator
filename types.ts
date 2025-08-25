
export type Stat = 'economy' | 'social' | 'politics' | 'environment' | 'international';

export type GameStatus = 'playing' | 'crisis' | 'gameover' | 'win';

export interface GameStats {
  economy: number;
  social: number;
  politics: number;
  environment: number;
  international: number;
}

export interface LogEntry {
  turn: number;
  year: number;
  policy: string;
  outcome: string;
  headline: string;
  statChanges: string;
}

export interface CrisisEvent {
    title: string;
    description: string;
    image: string;
}

export interface GameState {
  stats: GameStats;
  year: number;
  log: LogEntry[];
  status: GameStatus;
  currentEvent: CrisisEvent | null;
  gameOverReason?: string;
}

export interface StatDefinition {
    label: string;
    icon: React.ReactNode;
    description: string;
}

export interface GeminiApiResponse {
    statChanges: Partial<Record<Stat, number>>;
    narrative: string;
    headline: string;
    isGameOver: boolean;
    gameOverReason: string;
}