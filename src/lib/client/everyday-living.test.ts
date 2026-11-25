import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { ILogger } from '../logger.ts';
import { BrowserEverydayStore, buildWeek, currentTermIndex, type PlannedPractice, type YearDay } from './everyday-living.ts';

const silentLogger: ILogger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};

/** In-memory stand-in for Web Storage. */
class MemoryStorage implements Storage {
  private readonly items = new Map<string, string>();

  get length(): number {
    return this.items.size;
  }

  clear(): void {
    this.items.clear();
  }

  getItem(key: string): string | null {
    return this.items.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.items.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.items.delete(key);
  }

  setItem(key: string, value: string): void {
    this.items.set(key, value);
  }
}

describe('BrowserEverydayStore', () => {
  it('returns what was written', () => {
    const store = new BrowserEverydayStore(new MemoryStorage(), silentLogger);
    store.write('learned', ['ma', 'wa']);
    store.write('best-score', 9);

    assert.deepEqual(store.readList('learned'), ['ma', 'wa']);
    assert.equal(store.readNumber('best-score'), 9);
  });

  it('falls back when nothing is saved', () => {
    const store = new BrowserEverydayStore(new MemoryStorage(), silentLogger);

    assert.equal(store.readList('learned'), null);
    assert.equal(store.readNumber('best-score'), 0);
  });

  it('falls back when the saved value is corrupt or the wrong type', () => {
    const storage = new MemoryStorage();
    storage.setItem('everyday-learned', '{not json');
    storage.setItem('everyday-plan', JSON.stringify(['ma', 7]));
    storage.setItem('everyday-best-score', JSON.stringify('twelve'));
    const store = new BrowserEverydayStore(storage, silentLogger);

    assert.equal(store.readList('learned'), null);
    assert.equal(store.readList('plan'), null);
    assert.equal(store.readNumber('best-score'), 0);
  });

  it('clears only its own keys', () => {
    const storage = new MemoryStorage();
    storage.setItem('theme', 'dark');
    const store = new BrowserEverydayStore(storage, silentLogger);
    store.write('learned', ['ma']);
    store.write('best-score', 9);

    store.clear();

    assert.equal(store.readList('learned'), null);
    assert.equal(store.readNumber('best-score'), 0);
    assert.equal(storage.getItem('theme'), 'dark');
  });

  it('keeps nothing, without throwing, when storage is unavailable', () => {
    const store = new BrowserEverydayStore(null, silentLogger);
    store.write('learned', ['ma']);
    store.clear();

    assert.equal(store.readList('learned'), null);
  });
});

describe('buildWeek', () => {
  const daily: PlannedPractice = { id: 'ma', label: 'Pause', timesPerWeek: 7 };
  const twice: PlannedPractice = { id: 'shinrin', label: 'Walk', timesPerWeek: 2 };
  const once: PlannedPractice = { id: 'kaizen', label: 'Improve', timesPerWeek: 1 };

  it('puts a daily practice on every day', () => {
    assert.deepEqual(
      buildWeek([daily]).map((day) => day.length),
      [1, 1, 1, 1, 1, 1, 1],
    );
  });

  it('gives each practice exactly its number of days', () => {
    const week = buildWeek([daily, twice, once]);
    const count = (id: string): number => week.flat().filter((practice) => practice.id === id).length;

    assert.equal(count('ma'), 7);
    assert.equal(count('shinrin'), 2);
    assert.equal(count('kaizen'), 1);
  });

  it('spaces a twice-weekly practice apart and offsets later choices', () => {
    const week = buildWeek([twice, once]);

    assert.deepEqual(
      week.map((day) => day.map((practice) => practice.id)),
      [['shinrin'], ['kaizen'], [], ['shinrin'], [], [], []],
    );
  });

  it('returns seven empty days for no practices', () => {
    assert.deepEqual(buildWeek([]), [[], [], [], [], [], [], []]);
  });
});

describe('currentTermIndex', () => {
  const starts: YearDay[] = [
    { month: 2, day: 4 },
    { month: 11, day: 22 },
    { month: 12, day: 21 },
    { month: 1, day: 5 },
  ];

  it('picks the latest term starting on or before the date', () => {
    assert.equal(currentTermIndex(starts, new Date(2026, 10, 25)), 1);
  });

  it('includes the day a term begins', () => {
    assert.equal(currentTermIndex(starts, new Date(2026, 11, 21)), 2);
  });

  it('handles a term that begins in January', () => {
    assert.equal(currentTermIndex(starts, new Date(2026, 0, 10)), 3);
  });

  it('gives the first days of January to the last term of the old year', () => {
    assert.equal(currentTermIndex(starts, new Date(2026, 0, 2)), 2);
  });

  it('returns -1 for an empty list', () => {
    assert.equal(currentTermIndex([], new Date(2026, 0, 2)), -1);
  });
});
