import { spawnSync } from 'node:child_process';

const EXPECTED_BRANCH = 'main';
const EXPECTED_REMOTE = 'origin';
const EXPECTED_REPOSITORY = 'Wenjie-Tang/Wenjie-Tang.github.io';
const WORKFLOW_NAME = "Deploy Wenjie Tang's Academic Website";
const DEFAULT_COMMIT_MESSAGE = 'Update academic website';
const ACTIONS_TIMEOUT_MS = 3 * 60 * 1000;
const POLL_INTERVAL_MS = 5 * 1000;

const rawArgs = process.argv.slice(2);
const dryRun = rawArgs.includes('--dry-run');
const commitMessage = rawArgs.filter((arg) => arg !== '--dry-run').join(' ').trim() || DEFAULT_COMMIT_MESSAGE;

function fail(message) {
  console.error(`\nDeployment stopped: ${message}`);
  process.exit(1);
}

function run(command, args, { capture = false, allowFailure = false } = {}) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    shell: false,
    stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
  });

  if (result.error) {
    fail(`Could not run ${command}: ${result.error.message}`);
  }

  if (result.status !== 0 && !allowFailure) {
    const detail = capture ? (result.stderr || result.stdout || '').trim() : '';
    fail(`${command} ${args.join(' ')} failed${detail ? `: ${detail}` : ''}`);
  }

  return result;
}

function git(args, options = {}) {
  return run('git', args, options);
}

function gitOutput(args, options = {}) {
  return git(args, { ...options, capture: true }).stdout.trim();
}

function normalizeGitHubRemote(url) {
  return url
    .trim()
    .replace(/^git@github\.com:/i, 'https://github.com/')
    .replace(/^ssh:\/\/git@github\.com\//i, 'https://github.com/')
    .replace(/\.git$/i, '')
    .replace(/\/$/, '');
}

function runNpm(args) {
  if (process.env.npm_execpath) {
    return run(process.execPath, [process.env.npm_execpath, ...args]);
  }

  return run(process.platform === 'win32' ? 'npm.cmd' : 'npm', args);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForDeployment(sha) {
  const endpoint = new URL(`https://api.github.com/repos/${EXPECTED_REPOSITORY}/actions/runs`);
  endpoint.searchParams.set('event', 'push');
  endpoint.searchParams.set('head_sha', sha);
  endpoint.searchParams.set('per_page', '10');
  const deadline = Date.now() + ACTIONS_TIMEOUT_MS;
  let workflowUrl = `https://github.com/${EXPECTED_REPOSITORY}/actions`;

  console.log('\nWaiting for the GitHub Pages workflow...');

  while (Date.now() < deadline) {
    try {
      const response = await fetch(endpoint, {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'wenjie-pages-deploy-script',
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API returned ${response.status}`);
      }

      const data = await response.json();
      const workflow = data.workflow_runs?.find((run) => run.name === WORKFLOW_NAME);

      if (workflow) {
        workflowUrl = workflow.html_url;
        process.stdout.write(`\rWorkflow status: ${workflow.status}${workflow.conclusion ? ` (${workflow.conclusion})` : ''}   `);

        if (workflow.status === 'completed') {
          console.log(`\n${workflowUrl}`);
          if (workflow.conclusion !== 'success') {
            fail(`GitHub Pages workflow concluded with ${workflow.conclusion}`);
          }
          console.log('GitHub Pages deployment completed successfully.');
          return;
        }
      }
    } catch (error) {
      console.warn(`\nCould not query GitHub Actions yet: ${error.message}`);
    }

    await sleep(POLL_INTERVAL_MS);
  }

  console.warn(`\nPush succeeded, but deployment status did not complete within 3 minutes. Check ${workflowUrl}`);
}

async function main() {
  const insideWorkTree = gitOutput(['rev-parse', '--is-inside-work-tree'], { allowFailure: true });
  if (insideWorkTree !== 'true') {
    fail('the current directory is not a Git worktree');
  }

  const branch = gitOutput(['branch', '--show-current']);
  if (branch !== EXPECTED_BRANCH) {
    fail(`expected branch ${EXPECTED_BRANCH}, found ${branch || '(detached HEAD)'}`);
  }

  const remoteUrl = gitOutput(['remote', 'get-url', EXPECTED_REMOTE], { allowFailure: true });
  const expectedRemoteUrl = `https://github.com/${EXPECTED_REPOSITORY}`;
  if (normalizeGitHubRemote(remoteUrl).toLowerCase() !== expectedRemoteUrl.toLowerCase()) {
    fail(`expected ${EXPECTED_REMOTE} to point to ${expectedRemoteUrl}, found ${remoteUrl || '(missing)'}`);
  }

  const upstreamResult = git(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}'], {
    capture: true,
    allowFailure: true,
  });
  const upstream = upstreamResult.status === 0 ? upstreamResult.stdout.trim() : '';
  if (upstream && upstream !== `${EXPECTED_REMOTE}/${EXPECTED_BRANCH}`) {
    fail(`expected upstream ${EXPECTED_REMOTE}/${EXPECTED_BRANCH}, found ${upstream}`);
  }

  console.log(`Repository: ${EXPECTED_REPOSITORY}`);
  console.log(`Branch: ${branch}`);
  console.log(`Upstream: ${upstream || '(will be configured on push)'}`);
  console.log(`Mode: ${dryRun ? 'dry run' : 'deploy'}`);

  git(['fetch', EXPECTED_REMOTE, EXPECTED_BRANCH]);
  const [ahead, behind] = gitOutput([
    'rev-list',
    '--left-right',
    '--count',
    `HEAD...${EXPECTED_REMOTE}/${EXPECTED_BRANCH}`,
  ]).split(/\s+/).map(Number);

  if (behind > 0) {
    fail(`local ${EXPECTED_BRANCH} is behind ${EXPECTED_REMOTE}/${EXPECTED_BRANCH} by ${behind} commit(s); integrate remote changes manually before deploying`);
  }

  console.log('\nRunning typecheck, lint, and production build...');
  runNpm(['run', 'verify']);

  const worktreeChanges = gitOutput(['status', '--porcelain']);

  if (dryRun) {
    console.log('\nDry run completed successfully.');
    console.log(worktreeChanges ? 'A deployment would commit the current worktree changes.' : 'The worktree has no changes to commit.');
    console.log(ahead > 0 ? `${ahead} local commit(s) would be pushed.` : 'There are no existing local commits to push.');
    return;
  }

  let createdCommit = false;
  if (worktreeChanges) {
    git(['add', '.']);
    const stagedDiff = git(['diff', '--cached', '--quiet'], { allowFailure: true });
    if (stagedDiff.status === 1) {
      git(['commit', '-m', commitMessage]);
      createdCommit = true;
    } else if (stagedDiff.status > 1) {
      fail('could not inspect staged changes');
    }
  }

  const commitsToPush = Number(gitOutput([
    'rev-list',
    '--count',
    `${EXPECTED_REMOTE}/${EXPECTED_BRANCH}..HEAD`,
  ]));

  if (commitsToPush === 0) {
    console.log('\nNo new commit or push was needed. The repository is already up to date.');
    return;
  }

  if (upstream) {
    git(['push']);
  } else {
    git(['push', '-u', EXPECTED_REMOTE, EXPECTED_BRANCH]);
  }

  const sha = gitOutput(['rev-parse', 'HEAD']);
  console.log(`\nPushed ${commitsToPush} commit(s) to ${EXPECTED_REMOTE}/${EXPECTED_BRANCH}.`);
  console.log(`Commit: ${sha}${createdCommit ? ` (${commitMessage})` : ''}`);
  await waitForDeployment(sha);
}

await main();
