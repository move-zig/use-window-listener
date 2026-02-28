import { useCallback } from 'react';

import { useWindowListener } from './useWindowListener.mjs';

const valueSelector = (m: MediaQueryList) => m.matches;

/**
 * Listens for change events and records whether a MediaQueryList matches or not
 *
 * @param query the media query used to create the MediaQueryList
 * @returns whether the MediaQueryList matches or not
 *
 * @example
 * const ExampleComponent: FC = () => {
 *   const matches = useMediaQuery('(min-width: 992px)');
 *   return <div>{matches ? 'yes' : 'no'}</div>;
 * };
 */
export const useMediaQuery = (query: string): boolean | undefined => {
  const targetSelector = useCallback((w: Window) => w.matchMedia(query), [ query ]);

  return useWindowListener('change', valueSelector, undefined, targetSelector);
};
