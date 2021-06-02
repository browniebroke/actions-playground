const { Octokit } = require("@octokit/action");

const octokit = new Octokit();
const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

// See https://developer.github.com/v3/issues/#create-an-issue
const { data } = await octokit.request("GET /repos/{owner}/{repo}/actions/runs", {
  owner,
  repo,
  event: "pull_request",
});
console.log("Data: %s", data);


/*
with:
  route: GET /repos/{repository}/actions/runs/{run_id}/approve
  repository: ${{ github.repository }}
  run_id: ${{ github.event.check_suite.id }}
 */