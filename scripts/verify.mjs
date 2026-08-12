import { cp, mkdtemp, rm, symlink } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const npm = process.env.npm_execpath
  ? { command: process.execPath, prefix: [process.env.npm_execpath] }
  : { command: process.platform === 'win32' ? 'npm.cmd' : 'npm', prefix: [] };

function run(args, cwd = process.cwd(), { capture = false } = {}) {
  const result = spawnSync(npm.command, [...npm.prefix, ...args], {
    cwd,
    encoding: 'utf8',
    shell: false,
    stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
  });

  if (result.error) throw result.error;
  return result;
}

function exitStatus(result) {
  return result.status ?? 1;
}

function printCapturedOutput(result) {
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
}

async function buildInTemporaryCopy() {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'wenjie-pages-build-'));
  const sourceRoot = process.cwd();
  const destinationRoot = path.join(tempRoot, 'site');
  const excluded = new Set(['.git', '.next', 'node_modules', 'out']);

  try {
    await cp(sourceRoot, destinationRoot, {
      recursive: true,
      filter: (source) => !excluded.has(path.basename(source)),
    });
    await symlink(path.join(sourceRoot, 'node_modules'), path.join(destinationRoot, 'node_modules'), 'junction');
    console.log(`\nThe local out/ directory is locked; building an isolated verification copy at ${destinationRoot}.`);
    const status = exitStatus(run(['run', 'build'], destinationRoot));
    if (status !== 0) process.exitCode = status;
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

const typecheckStatus = exitStatus(run(['run', 'typecheck']));
if (typecheckStatus !== 0) process.exit(typecheckStatus);

const lintStatus = exitStatus(run(['run', 'lint']));
if (lintStatus !== 0) process.exit(lintStatus);

const buildResult = run(['run', 'build'], process.cwd(), { capture: true });
printCapturedOutput(buildResult);
const buildStatus = exitStatus(buildResult);
if (buildStatus === 0) process.exit(0);

const buildOutput = `${buildResult.stdout || ''}\n${buildResult.stderr || ''}`;
const outputDirectoryIsLocked = /EBUSY[\s\S]*rmdir[\s\S]*[\\/]out(?:['"\s]|$)/i.test(buildOutput);

if (outputDirectoryIsLocked) {
  await buildInTemporaryCopy();
} else {
  process.exit(buildStatus);
}
