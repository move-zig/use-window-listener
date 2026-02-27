import { useCallback, useRef, useSyncExternalStore } from 'react';

/**
 * Listens for events and returns a value
 * @param type the event type to listen for
 * @param valueSelector a selector for the value, e.g., w => w.innerWidth, should be a stable reference
 * @param fallbackValue a default value to use when rendering on the server
 * @param targetSelector a selector for the object to attach listeners to, defaults to `window`, e.g. w => w.matchMedia('(min-width: 768px)'), should be a stable reference, should be a pure function because it won't be re-evaluated.
 * @param addEventListenerOptions options to pass to addEventListener and removeEventListener
 * @returns the value
 *
 * @example
 * const valueSelector = (w: Window) => w.scrollY; // module-scope stable reference
 *
 * const SomeComponent: FC = () => {
 *   // const valueSelector = useCallback((w: Window) => w.scrollY, []); // alternative
 *   const scrollY = useWindowListener('scroll', valueSelector);
 *   return <div>{scrollY}</div>;
 * };
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const useSyncExternalStoreWindowListener = <TReturnValue, TTarget extends EventTarget = Window, TEvent extends Event = Event>(
  type: string,
  valueSelector: (t: TTarget, e?: TEvent) => TReturnValue,
  fallbackValue?: TReturnValue,
  targetSelector?: (w: Window) => TTarget,
  addEventListenerOptions?: AddEventListenerOptions | boolean,
): Readonly<TReturnValue> | undefined => {
  const currentValue = useRef<TReturnValue>(fallbackValue);

  const subscribe = useCallback((onStoreChange: () => void): (() => void) => {
    const resolvedTarget = (targetSelector ? targetSelector(window) : window) as TTarget;

    // update the value once before any events are received
    currentValue.current = valueSelector(resolvedTarget);

    const handler = (e: Event) => {
      // rather than evaluate valueSelector in getSnapshot, we do it here,
      // where we have access to the event, and store the value in a ref
      currentValue.current = valueSelector(resolvedTarget, e as TEvent);
      onStoreChange();
    };

    resolvedTarget.addEventListener(type, handler, addEventListenerOptions);
    return () => resolvedTarget.removeEventListener(type, handler, addEventListenerOptions);
  }, [ type, valueSelector, targetSelector, addEventListenerOptions ]);

  // we'd evaluate valueSelector here, but then we couldn't pass the event to it
  const getSnapshot = () => currentValue.current;

  const getServerSnapshot = () => fallbackValue;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
