import { useWindowListener } from './useWindowListener.mjs';

const valueSelector = (w: Window) => w.scrollY;

/**
 * Listens for scroll event and records the window scroll height
 * @returns whether the current window scroll height
 */
export const useScrollY = (): number | undefined => {
  return useWindowListener('scroll', valueSelector);
};
