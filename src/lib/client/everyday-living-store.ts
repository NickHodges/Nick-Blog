import { logger } from '../logger';
import { BrowserEverydayStore, type IEverydayStore } from './everyday-living';

/** localStorage, or null where the browser refuses access to it (some privacy modes throw). */
function getBrowserStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch (error) {
    logger.warn('Everyday Living: browser storage is unavailable, progress will not be saved', error);
    return null;
  }
}

/** The store every Everyday Living component on a page shares. */
export const everydayStore: IEverydayStore = new BrowserEverydayStore(getBrowserStorage(), logger);
