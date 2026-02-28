import { useSyncWindowListener } from './useSyncWindowListener.mjs';

const valueSelector = (w: Window) => w.innerWidth;

/**
 * Listens for resize events and stores the window width
 *
 * @returns the current window width
 */
export const useSyncInnerWidth = (): number | undefined => {
  return useSyncWindowListener('resize', valueSelector);
};
