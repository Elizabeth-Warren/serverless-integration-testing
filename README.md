# serverless-integration-testing

Spin-up CloudFormation stacks for each commit and run integration tests.

## Setup

Create a Github Workflow using the following template in `${PROJECT_ROOT}/.github/main.workflow`,

```
workflow "Test most recent commit" {
  on = "push"
  resolves = ["Create Test Stack"]
}

action "Create Test Stack" {
  uses = "elizabethwarren/serverless-integration-testing@master"
  runs = ["sh", "-c", "sls deploy --stage $GITHUB_SHA"]
  secrets = [
    "AWS_ACCESS_KEY_ID"
    "AWS_SECRET_ACCESS_KEY",
    "AWS_DEFAULT_REGION",
  ]
}

action "Run Integration Tests" {
  uses = "elizabethwarren/serverless-integration-testing@master"
  runs = "npm run test:integration"
  needs = "Create Test Stack"
  secrets = [
    "INCOMING_SLACK_URI",
  ]
}

action "Remove Test Stack" {
  uses = "elizabethwarren/serverless-integration-testing@master"
  runs = ["sh", "-c", "sls remove --stage $GITHUB_SHA"]
  needs = "Create Test Stack"
  secrets = [
    "AWS_ACCESS_KEY_ID"
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

Lastly, create the main test integration file in `${PROJECT_ROOT}/test-integration/index.js`,

```js
const TEST_SERVICE_URI = process.env.TEST_SERVICE_URI;

// ...
```

You should now be setup to run integration tests automatically for each commit in your pull request.

## Writing Integration Tests

TK TK
