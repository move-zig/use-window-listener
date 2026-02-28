import { useEffect, useState } from 'react';

/**
 * Listens for events and returns a value
 *
 * Implemented with `useState`/`useEffect`. Suitable for most use cases. In
 * React 18+ concurrent rendering, this hook is not tearing-safe: if React
 * defers or interrupts a render, different components may briefly observe
 * inconsistent snapshots of this value. Use `useSyncWindowListener` if that
 * matters to you.
 *
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
export const useWindowListener = <TReturnValue, TTarget extends EventTarget = Window, TEvent extends Event = Event>(
  type: string,
  valueSelector: (t: TTarget, e?: TEvent) => TReturnValue,
  fallbackValue?: TReturnValue,
  targetSelector?: (w: Window) => TTarget,
  addEventListenerOptions?: AddEventListenerOptions | boolean,
): TReturnValue | undefined => {
  const [ state, dispatch ] = useState<TReturnValue | undefined>(fallbackValue);
  useEffect(() => {
    const resolvedTarget = (targetSelector ? targetSelector(window) : window) as TTarget;

    // update the value once before any events are received
    // Note: we can't pass any event here; this is why the value selector's
    // second parameter must be optional
    dispatch(valueSelector(resolvedTarget));

    const handler = (e: Event) => {
      // here we can pass the event so that the user can access variables like
      // KeyboardEvent.altKey or MouseEvent.button
      dispatch(valueSelector(resolvedTarget, e as TEvent));
    };

    resolvedTarget.addEventListener(type, handler, addEventListenerOptions);

    return () => { resolvedTarget.removeEventListener(type, handler, addEventListenerOptions); };
  }, [ type, valueSelector, targetSelector, addEventListenerOptions ]);

  return state;
};
