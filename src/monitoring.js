import { init, captureException, flush } from '@sentry/vue';
import { createMockTransport } from './mock-transport.js';

export const monitoringMode = import.meta.env.VITE_SENTRY_MODE || 'mock';

export function setupMonitoring(app) {
  if (!['mock', 'live', 'off'].includes(monitoringMode)) {
    throw new Error('VITE_SENTRY_MODE must be mock, live or off');
  }
  if (monitoringMode === 'off') return;
  const dsn = import.meta.env.VITE_SENTRY_DSN || 'https://00000000000000000000000000000000@sentry.invalid/1';
  if (monitoringMode === 'live' && dsn.includes('sentry.invalid')) {
    throw new Error('Live monitoring requires a real Sentry DSN');
  }
  init({
    app,
    dsn,
    release: import.meta.env.VITE_SENTRY_RELEASE || 'cicd-vite-demo@local',
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || 'demo',
    sendDefaultPii: false,
    // 本次只接入错误监控，不启用性能追踪、回放或会话上报。
    autoSessionTracking: false,
    ...(monitoringMode === 'mock' ? { transport: createMockTransport } : {}),
  });
}

export async function triggerMonitoringDemo() {
  if (monitoringMode === 'off') return '错误监控已关闭';
  captureException(new Error('CI/CD demo: simulated frontend error'));
  const completed = await flush(3000);
  if (!completed) return '事件处理超时，请查看控制台';
  return monitoringMode === 'mock'
    ? '模拟错误已捕获，没有上传到 Sentry'
    : '事件已交给 Sentry，请在后台确认是否收到';
}


