# serverless-integration-testing

Spin-up CloudFormation stacks for each commit and run integration tests.

## Usage

#### Github Workflow

Create a Github Workflow using the following template in `${PROJECT_ROOT}/.github/main.workflow`,

```
workflow "Test most recent commit" {
  on = "push"
  resolves = ["Build Test Container"]
}

action "Build Test Container" {
  uses = "elizabethwarren/serverless-integration-testing@master"
  secrets = [
    "GITHUB_TOKEN",
    "INCOMING_SLACK_URI",
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

Lastly, setup the necessary CI command to run your integration tests in your project `Makefile`,

```make
ci-integration:
  npm run install
  npm run test:integration # Define however you want.
                           # You could seed a database here as well, for example.  
```

You should now be setup to run integration tests automatically for each commit in your pull request.
