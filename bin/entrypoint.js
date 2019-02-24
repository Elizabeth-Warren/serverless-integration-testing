const GITHUB_WORKSPACE = process.env.GITHUB_WORKSPACE;
const GITHUB_SHA = process.env.GITHUB_SHA;
const STAGE = `git-${GITHUB_SHA.slice(0, 7)}`;

const STAGE_ROUTE = `https://api.elizabethwarren.codes/${STAGE}`;

const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function command(input) {
  console.log(`Executing command '${input}'`);

  try {
    const { stdout, stderr } = await exec(input, { cwd: GITHUB_WORKSPACE });

    if (stdout) {
      console.log(stdout);
    }

    if (stderr) {
      console.error(stderr);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

async function main() {
  try {
    await command('npm install');
    await command(`sls deploy --stage ${STAGE}`);
    await command(`STAGE_ROUTE=${STAGE_ROUTE} npm run test:integration`);
    await command(`sls remove --stage ${STAGE}`);
  } catch (error) {
    console.error(error);
  }
}

main();
