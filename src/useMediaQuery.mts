import { useCallback } from 'react';

import { useWindowListener } from './useWindowListener.mjs';

const valueSelector = (m: MediaQueryList) => m.matches;

/**
 * Listens for changes to whether a media query matches or not
 * @param query the media query
 * @returns whether the media query matches or not
 *
 * @example
 * const ExampleComponent: FC = () => {
 *   const matches = useMediaQuery('(min-width: 992px)');
 *   return <div>{matches ? 'yes' : 'no'}</div>;
 * };
 */
export const useMediaQuery = (query: string) => {
  const targetSelector = useCallback((w: Window) => w.matchMedia(query), [ query ]);

  return useWindowListener('change', valueSelector, undefined, targetSelector);
};
