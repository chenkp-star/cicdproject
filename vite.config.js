import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { readdir, unlink } from 'node:fs/promises';
import { resolve, join } from 'node:path';

// Mock 构建生成 sourcemap，模拟上传后删除；不调用任何上传 API。
function mockSourcemaps() {
  let outDir;
  return {
    name: 'mock-sentry-sourcemaps',
    apply: 'build',
    enforce: 'post',
    configResolved(config) { outDir = resolve(config.root, config.build.outDir); },
    async closeBundle() {
      async function findMaps(directory) {
        const entries = await readdir(directory, { withFileTypes: true });
        const result = [];
        for (const entry of entries) {
          const path = join(directory, entry.name);
          if (entry.isDirectory()) result.push(...await findMaps(path));
          else if (entry.name.endsWith('.map')) result.push(path);
        }
        return result;
      }
      const maps = await findMaps(outDir);
      if (!maps.length) throw new Error('Mock sourcemap validation failed: no maps generated');
      console.info(`[Sentry MOCK] 生成 ${maps.length} 个 sourcemap；模拟上传（未联网）。`);
      await Promise.all(maps.map(path => unlink(path)));
      console.info('[Sentry MOCK] 已清理 sourcemap，最终 dist 不包含 .map。');
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  const uploadMode = env.SENTRY_UPLOAD_MODE || 'mock';
  if (!['mock', 'live'].includes(uploadMode)) throw new Error('Invalid SENTRY_UPLOAD_MODE');
  const release = env.VITE_SENTRY_RELEASE || 'cicd-vite-demo@local';
  if (uploadMode === 'live') {
    for (const name of ['SENTRY_ORG', 'SENTRY_PROJECT', 'SENTRY_AUTH_TOKEN', 'VITE_SENTRY_RELEASE']) {
      if (!env[name] || env[name].startsWith('demo-') || env[name].startsWith('DEMO-')) {
        throw new Error(`Real sourcemap upload requires ${name}`);
      }
    }
  }
  return {
    define: { 'import.meta.env.VITE_SENTRY_RELEASE': JSON.stringify(release) },
    build: { sourcemap: 'hidden' },
    plugins: [
      vue(),
      uploadMode === 'mock' ? mockSourcemaps() : sentryVitePlugin({
        org: env.SENTRY_ORG,
        project: env.SENTRY_PROJECT,
        authToken: env.SENTRY_AUTH_TOKEN,
        telemetry: false,
        release: { name: release },
        sourcemaps: {
          assets: './dist/**',
          filesToDeleteAfterUpload: './dist/**/*.map',
        },
      }),
    ],
  };
});
