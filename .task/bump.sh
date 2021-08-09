# bump all workspace package versions as a new prerelease
NEW_VERSION=$(npm version prerelease --workspaces --git-tag-version | tail -1);

# add each updated package.json, because npm fails to
git add "packages/core/package.json";
git add "packages/react/package.json";
git add "packages/stringify/package.json";

# commit the new version
git commit -m "$NEW_VERSION";

# create a new tag for the new version
git tag "$NEW_VERSION";

# push the new version and new tag
git push && git push --tags;
