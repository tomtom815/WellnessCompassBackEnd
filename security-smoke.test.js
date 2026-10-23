const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const bcrypt = require('bcrypt');
const { logEvents } = require('./backend/middleware/logger');

test('logger writes a native random UUID without touching real logs', async (t) => {
  let entry;
  t.mock.method(fs, 'existsSync', () => true);
  t.mock.method(fs.promises, 'appendFile', async (_path, text) => { entry = text; });
  await logEvents('synthetic security test', 'security-test.log');
  assert.match(entry, /[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\tsynthetic security test\n$/);
});

test('bcrypt preserves password hash and comparison behavior', async () => {
  const hash = await bcrypt.hash('synthetic-test-only', 4);
  assert.equal(await bcrypt.compare('synthetic-test-only', hash), true);
  assert.equal(await bcrypt.compare('different', hash), false);
});
