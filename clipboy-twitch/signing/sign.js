const util = require('util');
const path = require('path');
const exec = util.promisify(require('child_process').exec);

(async () => {
    const target = path.resolve(__dirname, '../plugin');
    console.log('Signing', target);
    let stdout,stderr;
    ({ stdout, stderr } = await exec(
        `ZXPSignCmd.exe -sign ${target} package.zxp cert.p12 fesomg90smg43 -tsa http://timestamp.digicert.com`
    ));
    if (stderr) {
        console.error(stderr);
    } else {
        console.log(stdout);
    }
    ({ stdout, stderr } = await exec(
        `node verify.js`
    ));
    if (stderr) {
        console.error(stderr);
    } else {
        console.log(stdout);
    }
})();
