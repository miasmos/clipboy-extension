const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const util = require('util');
const spawn = require('child_process').spawn;
const argv = require('yargs')
    .command('deploy <product>')
    .command('package <product>')
    .command('build <product>')
    .help().argv;

const envs = ['development', 'production', 'qa'];

const config = async () => {
    const { product, env } = argv;

    if (!product) {
        console.error('product is required');
        process.exit(1);
    }

    if (!env || !envs.includes(env)) {
        console.error('env is required');
        process.exit(1);
    }

    let workingDir = path.resolve(__dirname, `../${product}`);
    try {
        await fsp.stat(workingDir);
    } catch {
        console.error('supplied product does not exist');
        process.exit(1);
    }

    process.chdir(workingDir);
    return { product, env, workingDir };
};

const command = async (command, { env }) => {
    try {
        const child = spawn('cmd', ['/c', `${command} --env=${env}`]);
        child.stdin.setEncoding('utf-8');
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
        process.stdin.pipe(child.stdin);

        child.on('exit', () => {
            process.exit();
        });
    } catch (error) {
        console.error(error);
    }
};

(async () => {
    const { _ } = argv;
    if (!_.length) {
        console.error('no command supplied');
        process.exit(1);
    }

    const { product, env, workingDir } = await config();

    switch (_[0]) {
        case 'deploy': {
            await command(`node ${__dirname}\\deploy.js`, { product, env });
            break;
        }
        case 'package': {
            const gulpParams = `--gulpfile ${__dirname}\\gulpfile.js --cwd ${workingDir}`;
            await command(
                `gulp ${gulpParams} && node ${__dirname}\\sign.js && gulp ${gulpParams} zxp-zip`,
                { product, env }
            );
            break;
        }
        case 'build': {
            const gulpParams = `--gulpfile ${__dirname}\\gulpfile.js --cwd ${workingDir}`;

            await command(`gulp ${gulpParams}`, { product, env });
            break;
        }
        default:
            console.error('command not found');
            break;
    }
})();
