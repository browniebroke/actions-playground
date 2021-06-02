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
  const approval_promises = unfinished_runs.map((run) => {
    console.log("Name: %s", run.name);
    console.log("Status: %s", run.status);
    console.log("Branch: %s", run.head_branch);
    console.log("ID: %s", run.id);
    console.log("Conclusion: %s", run.conclusion);
    return octokit.request("POST /repos/{repository}/actions/runs/{run_id}/approve", {
      repository,
      run_id: run.id
    });
  })
  await Promise.all(approval_promises).catch(error=>{
    console.error(error)
    process.exit(1);
  });
}());