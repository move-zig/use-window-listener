/**
 * @jest-environment node
 */
import React, { type FC } from 'react';
import { renderToString } from 'react-dom/server';

import { useSyncWindowListener } from './useSyncWindowListener.mjs';

describe('useSyncWindowListener (SSR)', () => {
  it('uses the fallback during server render', () => {

    const TestComponent: FC = () => {
      const value = useSyncWindowListener('scroll', w => w.scrollY, 3201);
      return <div data-value={String(value)} />;
    };

    const html = renderToString(<TestComponent />);

    expect(html).toContain('data-value="3201"');
  });
});
