# Contributing to Stitches

Welcome and thanks for your interest! Before submitting a pull request, please take a moment to review these guidelines.

1. [Fork](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo) this repository and then clone it to your machine.
2. Add your contribution in a [new branch](https://docs.github.com/en/github/getting-started-with-github/github-glossary#checkout).
3. Make [yarn is installed](https://classic.yarnpkg.com/en/docs/install/) and install dependencies: `yarn`. 
4. Pick a package to work on `cd packages/core` or `cd packages/react`.
5. Start test in watch mode: `yarn test:watch` (in the package directory).
6. [Create a pull request](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork). Make sure it's against the `canary` branch.

If you need to work on both packages, folow step 5 in different terminal windows.

## Test it
Before creating a pull request, make sure the tests are passing.
1. Run all tests from the root directory: `yarn test`.
