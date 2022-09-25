import ghPages from 'gh-pages';
import fs from 'fs';

let file = fs.readFileSync('./package.json');
let packageJson = JSON.parse(file.toString());
const PACKAGE_VERSION = packageJson.version;
const PACKAGE_TITLE = packageJson.name;

ghPages.publish('dist', {
    branch: `public`,
    message: `Deploy ${PACKAGE_TITLE} v${PACKAGE_VERSION}`,
});
