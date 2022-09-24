const ghPages = require('gh-pages');
const package = require('../package.json');
const PACKAGE_VERSION = package.version;
const PACKAGE_TITLE = package.name;

ghPages.publish('dist', {
    branch: `staging-v${PACKAGE_VERSION}`,
    message: `Deploy ${PACKAGE_TITLE} v${PACKAGE_VERSION}`,
});
