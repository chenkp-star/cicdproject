import assert from 'node:assert/strict';
import test from 'node:test';
import { init, captureException, flush, getClient } from '@sentry/vue';
import { createMockTransport } from '../src/mock-transport.js';

test('Sentry SDK captures mock errors without using fetch', async () => {
  const originalFetch = globalThis.fetch;
  let networkCalls = 0;
  let envelopes = 0;
  globalThis.fetch = () => { networkCalls++; throw new Error('Network forbidden in mock mode'); };
  try {
    init({
      dsn: 'https://00000000000000000000000000000000@sentry.invalid/1',
      defaultIntegrations: false,
      autoSessionTracking: false,
      transport: () => {
        const mock = createMockTransport();
        return { ...mock, send(envelope) { envelopes++; return mock.send(envelope); } };
      },
    });
    captureException(new Error('Mock error integration test'));
    assert.equal(await flush(3000), true);
    assert.equal(envelopes, 1);
    assert.equal(networkCalls, 0);
  } finally {
    await getClient()?.close();
    globalThis.fetch = originalFetch;
  }
});

