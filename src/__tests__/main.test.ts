import * as process from 'node:process';
import * as cp from 'node:child_process';
import * as path from 'node:path';
import { test } from 'vitest';

// shows how the runner will run a javascript action with env / stdout protocol
test.skip('test runs', () => {
  process.env['INPUT_MILLISECONDS'] = '500';
  const ip = path.join(__dirname, '..', 'lib', 'main.js');
  const options: cp.ExecSyncOptions = {
    env: process.env,
  };
  console.log(cp.execSync(`node ${ip}`, options).toString());
});
