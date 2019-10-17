const util = require('util');
const exec = util.promisify(require('child_process').exec);

(async () => {
    const { stdout, stderr } = await exec(
        `ZXPSignCmd.exe -verify ./package.zxp -certinfo`
    );
    if (stderr) {
        console.error(stderr);
    } else {
        console.log(stdout);
    }
})();
