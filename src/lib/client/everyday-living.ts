import type { ILogger } from '../logger.ts';

/** Fired on document when the set of learned concepts changes. */
export const EVERYDAY_PROGRESS_EVENT = 'everyday:progress';

/** Fired on document after a reader clears everything they saved. */
export const EVERYDAY_RESET_EVENT = 'everyday:reset';

/** Keys of the values the course keeps in the reader's browser. */
export const EVERYDAY_KEYS = {
  learned: 'learned',
  plan: 'plan',
  bestScore: 'best-score',
} as const;

const KEY_PREFIX = 'everyday-';

/** What a reader saves while working through the course: all of it stays in their browser. */
export interface IEverydayStore {
  /** A saved list of ids, or null when nothing valid has been saved. */
  readList(key: string): string[] | null;
  readNumber(key: string): number;
  write(key: string, value: string[] | number): void;
  /** Removes everything the course saved. */
  clear(): void;
}

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

/** Keeps the course's values in Web Storage; with no storage available nothing is kept. */
export class BrowserEverydayStore implements IEverydayStore {
  private readonly storage: Storage | null;
  private readonly logger: ILogger;

  constructor(storage: Storage | null, logger: ILogger) {
    this.storage = storage;
    this.logger = logger;
  }

  readList(key: string): string[] | null {
    const value = this.read(key);
    return isStringList(value) ? value : null;
  }

  readNumber(key: string): number {
    const value = this.read(key);
    return typeof value === 'number' && Number.isFinite(value) ? value : 0;
  }

  write(key: string, value: string[] | number): void {
    if (!this.storage) {
      return;
    }
    try {
      this.storage.setItem(`${KEY_PREFIX}${key}`, JSON.stringify(value));
    } catch (error) {
      this.logger.warn(`Everyday Living: could not save "${key}"`, error);
    }
  }

  clear(): void {
    if (!this.storage) {
      return;
    }
    try {
      const keys: string[] = [];
      for (let index = 0; index < this.storage.length; index += 1) {
        const key = this.storage.key(index);
        if (key?.startsWith(KEY_PREFIX)) {
          keys.push(key);
        }
      }
      for (const key of keys) {
        this.storage.removeItem(key);
      }
    } catch (error) {
      this.logger.warn('Everyday Living: could not clear saved progress', error);
    }
  }

  private read(key: string): unknown {
    if (!this.storage) {
      return null;
    }
    try {
      const raw = this.storage.getItem(`${KEY_PREFIX}${key}`);
      return raw === null ? null : (JSON.parse(raw) as unknown);
    } catch (error) {
      this.logger.warn(`Everyday Living: could not read "${key}"`, error);
      return null;
    }
  }
}

export interface PlannedPractice {
  id: string;
  label: string;
  timesPerWeek: number;
}

const DAYS_IN_WEEK = 7;

/**
 * Spreads the chosen practices over a week, Monday first.
 * A daily practice lands on every day; the others are spaced evenly, each starting a day later than the one chosen before it.
 */
export function buildWeek(chosen: PlannedPractice[]): PlannedPractice[][] {
  const week: PlannedPractice[][] = Array.from({ length: DAYS_IN_WEEK }, () => []);
  chosen.forEach((practice, order) => {
    const times = Math.min(Math.max(Math.trunc(practice.timesPerWeek), 0), DAYS_IN_WEEK);
    for (let occurrence = 0; occurrence < times; occurrence += 1) {
      const day = times === DAYS_IN_WEEK ? occurrence : Math.floor((occurrence * DAYS_IN_WEEK) / times + order) % DAYS_IN_WEEK;
      week[day]?.push(practice);
    }
  });
  return week;
}

export interface YearDay {
  /** 1-12 */
  month: number;
  day: number;
}

/**
 * Index of the term that `today` falls in: the latest one starting on or before it.
 * Early January, before the year's first term, belongs to the last term of the old year. Returns -1 for an empty list.
 */
export function currentTermIndex(starts: YearDay[], today: Date): number {
  const ordinal = (value: YearDay): number => value.month * 100 + value.day;
  const now = (today.getMonth() + 1) * 100 + today.getDate();
  let current = -1;
  let latest = -1;
  starts.forEach((start, index) => {
    const value = ordinal(start);
    const currentStart = starts[current];
    if (value <= now && (currentStart === undefined || value > ordinal(currentStart))) {
      current = index;
    }
    const latestStart = starts[latest];
    if (latestStart === undefined || value > ordinal(latestStart)) {
      latest = index;
    }
  });
  return current >= 0 ? current : latest;
}
