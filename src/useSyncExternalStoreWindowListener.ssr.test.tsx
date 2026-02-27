/**
 * @jest-environment node
 */
import React from 'react';
import { renderToString } from 'react-dom/server';

import { useSyncExternalStoreWindowListener } from './useSyncExternalStoreWindowListener.mjs';

describe('useWindowListener (SSR)', () => {
  it('uses the fallback during server render', () => {
    function Probe() {
      const value = useSyncExternalStoreWindowListener('scroll', w => w.scrollY, 3201);
      return <div data-value={String(value)} />;
    }

    const html = renderToString(<Probe />);

    // crude but effective: your value should be present in markup
    expect(html).toContain('data-value="3201"');
  });
});
