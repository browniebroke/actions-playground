const { Octokit } = require("@octokit/action");

(async function() {
  const octokit = new Octokit();
  const repository = process.env.GITHUB_REPOSITORY.split("/");

// See https://developer.github.com/v3/issues/#create-an-issue
  const {data} = await octokit.request("GET /repos/{repository}/actions/runs", {
    repository,
    event: "pull_request",
  });
  console.log(data);

  const unfinished_runs = data.workflow_runs.filter(run => run.conclusion === null)
  for(const run of unfinished_runs) {
    console.log(run);
    await octokit.request("POST /repos/{repository}/actions/runs/{run_id}/approve", {
      repository,
      run_id: run.id
    });
  }
}());