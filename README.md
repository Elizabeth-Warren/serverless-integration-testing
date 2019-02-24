# serverless-integration-testing

Spin-up CloudFormation stacks for each commit and run integration tests.

## Setup

Create a Github Workflow using the following template in `${PROJECT_ROOT}/.github/main.workflow`,

```
workflow "Test most recent commit" {
  on = "push"
  resolves = ["Run Integration Test"]
}

action "Run Integration Test" {
  uses = "elizabeth-warren/serverless-integration-testing@master"
  secrets = [
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "AWS_DEFAULT_REGION",
  ]
}
```

Don't forget to add the necessary environment credentials to the workflow, you can do this within the Github Actions UI.

Then make sure your project `serverless.yml` is properly configured,

```yml
custom:
  stage: ${opt:stage, 'dev'}
  customDomain:
    domainName: api.elizabethwarren.codes
    basePath: ${self:custom.stage}-example
    stage: ${self:custom.stage}
    createRoute53Record: true
```

Your app handler definition should match this,

```js
const { framework, router } = require('@ewarren/serverless-routing');
const app = framework({ basePath: '/:stage-example' });
module.exports.router = router(app);
```

Don't forget to replace `-example` with the name of your service.

Lastly, create the test command in your project `package.json` file,

```json
{
  "scripts": {
    "test": "mocha --recursive",
    "test:integration": "node test-integration/index.js"
  },
}
```

You should now be setup to run integration tests automatically for each commit in your pull request.

## Writing Integration Tests

Your script can access the `STAGE_ROUTE` environment variable which constructs a URL with the API subdomain and the unique stage name for the commit. You can then append `-example` (replace 'example' with your api path) to get a fully qualified URL you can run tests against.

```js
const STAGE_ROUTE = process.env.STAGE_ROUTE;
const EXAMPLE_ROUTE = `${STAGE_ROUTE}-example`;

const assert = require('assert').strict;
const request = require('request-promise-native');

async function test() {
  try {
    const exampleResponse = await request(`${EXAMPLE_ROUTE}/ping`);
    assert.strictEqual(exampleResponse.statusCode, 200);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

test();
```

Make sure you exit with a failure code if a test fails so the pull request is correctly marked as having failed the test suite.
