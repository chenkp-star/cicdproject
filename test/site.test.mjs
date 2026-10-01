import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';

test('Vue Vite entrypoint and app source exist', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const app = await readFile(new URL('../src/App.vue', import.meta.url), 'utf8');
  assert.match(html, /src="\/src\/main\.js"/);
  assert.match(app, /<script setup>/);
  assert.match(app, /CloudBoard/);
  assert.ok((await stat(new URL('../src/style.css', import.meta.url))).isFile());
});
