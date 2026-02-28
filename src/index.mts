import { useSyncWindowListener } from './sync/useSyncWindowListener.mjs';

export { useMediaQuery } from './useMediaQuery.mjs';
export { useWindowListener } from './useWindowListener.mjs';
export { useSyncWindowListener } from './sync/useSyncWindowListener.mjs';

/** @deprecated Use `useSyncWindowListener` instead */
export const useSyncExternalStoreWindowListener = useSyncWindowListener;
