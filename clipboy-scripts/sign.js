const util = require('util');
const path = require('path');
const exec = util.promisify(require('child_process').exec);

(async () => {
    const targetFolder = path.resolve('./plugin');
    const zxpSignExePath = path.resolve('../clipboy-scripts/ZXPSignCmd.exe');
    const outputPath = path.resolve('./package/Extension');
    const certPath = `${path.resolve('../clipboy-scripts/cert.p12')}`;

    console.log('Signing', targetFolder);
    let stdout, stderr;
    ({ stdout, stderr } = await exec(
        `${zxpSignExePath} -selfSignedCert CA Ontario "Clipboy Software Inc." "Clipboy Software Inc." "password" ${certPath} -validityDays 365`
    ));

    if (stderr) {
        console.error(stderr);
    } else {
        console.log(stdout);
    }

    ({ stdout, stderr } = await exec(
        `cd ${outputPath} && del package.zxp && ${zxpSignExePath} -sign ${targetFolder} package.zxp ${certPath} password -tsa http://timestamp.digicert.com`
    ));

    if (stderr) {
        console.error(stderr);
    } else {
        console.log(stdout);
    }

    ({ stdout, stderr } = await exec(
        `${zxpSignExePath} -verify ${path.resolve(
            outputPath,
            'package.zxp'
        )} -certinfo`
    ));
    if (stderr) {
        console.error(stderr);
    } else {
        console.log(stdout);
    }
})();
