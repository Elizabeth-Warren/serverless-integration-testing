const GITHUB_WORKSPACE = process.env.GITHUB_WORKSPACE;
const GITHUB_SHA = process.env.GITHUB_SHA;
const STAGE = GITHUB_SHA.slice(0, 7);

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
    command('npm install');
    command(`sls deploy --stage ${STAGE}`);
    command('npm run test:integration');
    command(`sls remove --stage ${STAGE}`);
  } catch (error) {
    console.error(error);
  }
}

main();
