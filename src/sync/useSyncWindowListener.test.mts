import { act, renderHook } from '@testing-library/react';

import { useSyncWindowListener } from './useSyncWindowListener.mjs';

describe('useSyncWindowListener', () => {

  it('updates when an event is fired', () => {
    const valueSelector = (w: Window) => w.scrollY;
    const { result } = renderHook(() => useSyncWindowListener('scroll', valueSelector));

    act(() => {
      // change jsdom window width
      window.scrollY = 900;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(900);
  });

  it('updates when an event is fired matchmedia', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn(),
    });

    const query = '(min-width: 768px)';

    let changeListener: ((e: Event) => void) | undefined;
    let _matches = false;

    const mql = {
      media: query,
      get matches() {
        return _matches;
      },
      addEventListener: jest.fn((type: string, cb: (e: Event) => void) => {
        if (type === 'change') {
          changeListener = cb;
        }
      }),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    } as unknown as MediaQueryList;

    jest.spyOn(window, 'matchMedia').mockImplementation(() => mql);

    const valueSelector = (m: MediaQueryList) => m.matches;
    const targetSelector = (w: Window) => w.matchMedia(query);
    const { result } = renderHook(() => useSyncWindowListener('change', valueSelector, undefined, targetSelector));

    // simulate change -> false
    act(() => {
      _matches = false;
      changeListener?.(new Event('change'));
    });

    expect(result.current).toBe(false);

    // simulate change -> true
    act(() => {
      _matches = true;
      changeListener?.(new Event('change'));
    });

    expect(result.current).toBe(true);
  });
});
