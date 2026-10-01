import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';

test('Vite entrypoint and app source exist', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const app = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(html, /src="\/src\/main\.js"/);
  assert.match(app, /CloudBoard/);
  assert.ok((await stat(new URL('../src/style.css', import.meta.url))).isFile());
});
