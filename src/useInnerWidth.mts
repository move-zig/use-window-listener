import { useWindowListener } from './useWindowListener.mjs';

const valueSelector = (w: Window) => w.innerWidth;

/**
 * Listens for resize events and stores the window width
 *
 * @returns the current window width
 */
export const useInnerWidth = (): number | undefined => {
  return useWindowListener('resize', valueSelector);
};
