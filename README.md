# serverless-integration-testing

Spin-up CloudFormation stacks for each commit and run integration tests.

## Usage

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

Add the necessary environment credentials to the workflow.

Then make sure your project `serverless.yml` is properly configured,

```yml
custom:
  stage: ${opt:stage, self:provider.stage}
  domains:
    prod: api.mycompany.com
    staging: staging-api.mycompany.com
    dev: dev-api.mycompany.com

  customDomain:
    basePath: ""
    domainName: ${self:custom.domains.${self:custom.stage}}
    stage: "${self:custom.stage}"
    createRoute53Record: true
```

Lastly, setup the necessary CI command to run your integration tests in your project `Makefile`,

```make
ci-integration:
  npm run install
  npm run test:integration # Define however you want.
                           # You could seed a database here as well, for example.  
```

You should now be setup to run integration tests for each commit in your pull request.
