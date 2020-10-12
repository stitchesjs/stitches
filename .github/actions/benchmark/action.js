const core = require('@actions/core');
const { context, getOctokit } = require('@actions/github');
const runBenchmark = require('./action.runBenchmark.js');
const createCommentMessage = require('./action.createCommentMessage.js');

const handleError = (error) => {
  console.log(error);
  core.setFailed(`Unhandled error: ${error}`);
};

module.exports = async () => {
  const token = core.getInput('github-token', { required: true });
  const userAgent = core.getInput('user-agent');

  let benchmarks = [];

  try {
    benchmarks = await runBenchmark(process.env.GITHUB_WORKSPACE, '/benchmark.ts');
  } catch (error) {
    benchmarks = null;
  }

  const github = getOctokit(token, { userAgent });
  const { data: comments } = await github.issues.listComments({
    issue_number: context.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
  });

  const botComment = comments.find((comment) => comment.user.id === 41898282);
  const botCommentBody = createCommentMessage({ context, github, benchmarks });

  if (botComment) {
    await github.issues.updateComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      comment_id: botComment.id,
      body: botCommentBody,
    });
  } else {
    await github.issues.createComment({
      issue_number: context.issue.number,
      owner: context.repo.owner,
      repo: context.repo.repo,
      body: botCommentBody,
    });
  }
};

process.on('unhandledRejection', handleError);

module.exports().catch(handleError);
