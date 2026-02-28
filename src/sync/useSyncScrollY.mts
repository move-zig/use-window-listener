import { useSyncWindowListener } from './useSyncWindowListener.mjs';

const valueSelector = (w: Window) => w.scrollY;

/**
 * Listens for scroll event and records the window scroll height
 *
 * @returns the current window scroll height
 */
export const useSyncScrollY = (): number | undefined => {
  return useSyncWindowListener('scroll', valueSelector);
};
