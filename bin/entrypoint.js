const GITHUB_WORKSPACE = process.env.GITHUB_WORKSPACE;
const GITHUB_SHA = process.env.GITHUB_SHA;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const STAGE = `git-${GITHUB_SHA.slice(0, 7)}`;

const STAGE_ROUTE = `https://api.elizabethwarren.codes/${STAGE}`;

const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function

async function command(input, exitOnFailure = true) {
  console.log(`Executing command '${input}'`);

  try {
    const { stdout, stderr } = await exec(input, { cwd: GITHUB_WORKSPACE });

    if (stdout) {
      console.log(stdout);
    }

    if (stderr) {
      console.error(stderr);
    }

    return true;
  } catch (error) {
    console.error(error);

    if (exitOnFailure) {
      process.exit(1);
    }

    return false;
  }
}

async function main() {
  try {
    await command('npm install');
    await command(`sls deploy --stage ${STAGE}`);
    const testResults = await command(`STAGE_ROUTE=${STAGE_ROUTE} npm run test:integration`, false);
    await command(`sls remove --stage ${STAGE}`);

    if (! testResults) {
      process.exit(1);
    }
  } catch (error) {
    console.error(error);
  }
}

main();
