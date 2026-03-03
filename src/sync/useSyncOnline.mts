import { useSyncWindowListener } from './useSyncWindowListener.mjs';

const valueSelector = (w: Window) => w.navigator.onLine;
const types = [ 'online', 'offline' ];

/**
 * Listens for online and offline events and returns navigator.onLine
 *
 * @returns whether the client is online or offline
 */
export const useSyncOnline = (): boolean | undefined => {
  return useSyncWindowListener(types, valueSelector, undefined);
};
