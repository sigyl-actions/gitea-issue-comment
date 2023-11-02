
const core = require('@actions/core');
const github = require('@actions/github');

const { GiteaApi } = require('gitea-api');

async function run() {
  try {
    const serverUrl = core.getInput('serverUrl')
      || (github.context.runId && github.context.serverUrl)
      || process.argv[3]

    const client = new GiteaApi({
      BASE: `${serverUrl}/api/v1`,
      WITH_CREDENTIALS: true,
      TOKEN: core.getInput('token') || process.argv[2],
    });
    const [owner, repo] = (
      core.getInput('repository')
      || github?.context?.payload?.repository?.full_name
      || process.argv[4]
    ).split("/");

    await client
      .issue
      .issueCreateComment({
        owner,
        repo,
        index: core.getInput('id') || process.argv[5],
        body: {
          description: core.getInput('description') || process.argv[6],
          body: core.getInput('body') || process.argv[7],
        },
      })
  }
  catch (error) {
    console.error(error)
    core.setFailed(error.message);
  }
}

run()
