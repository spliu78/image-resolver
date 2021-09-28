set -x
npm install --save-dev husky @commitlint/config-conventional @commitlint/cli
npx husky install
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
npm set-script prepare "husky install"
echo "exports = {extends: ['@commitlint/config-conventional']};" >commitlint.config.js
