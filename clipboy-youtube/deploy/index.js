const pkg = require('../package.json');
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const yargs = require('yargs');
const inquire = require('inquirer');
const argv = yargs.argv;

const rp = require('request-promise');
const request = require('request');
const dotenv = require('dotenv');

const zxpPath = './package.zip';
const notesPath = './release-notes.txt';
const token = 'QFtiN3lkmX74cqcEnMtH6Oq4JFKDuYE8';
const environments = ['development', 'production', 'qa'];

yargs.option('env', {
    alias: 'e',
    type: 'string',
    description: `The target environment ${environments.join('|')}`
});

const getConfig = () => {
    const { env, e } = argv;

    if (!(environments.includes(env) || environments.includes(e))) {
        console.error(`env must be one of ${environments.join(', ')}`);
        process.exit(1);
    }

    dotenv.config({
        path: path.resolve(__dirname, `../.${env}.env`)
    });

    return {
        project: pkg.name,
        version: pkg.version,
        env
    };
};

const fetch = opts =>
    rp({
        ...opts,
        uri: `${process.env.DOMAIN}${opts.path}`,
        headers: {
            ...('headers' in opts && opts.headers),
            Authorization: `Bearer ${token}`,
            Origin: null
        },
        simple: false,
        resolveWithFullResponse: true,
        strictSSL: false
    }).then(async response => {
        let body = response.body;
        try {
            body = await response.json();
        } catch {
            // noop
        }

        if (response.statusCode >= 400) {
            throw new Error(typeof body === 'object' ? body.error : body);
        }
        return body;
    });

const deployZxp = (project, version, path) => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path).pipe(
            request(
                {
                    method: 'PUT',
                    uri: `${process.env.DOMAIN}/deploy/zxp`,
                    headers: {
                        'X-VERSION': version,
                        'X-PROJECT': project,
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/octet-stream',
                        Origin: null
                    },
                    strictSSL: false
                },
                (error, response, body) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    try {
                        body = JSON.parse(body);
                    } catch {}

                    if (response.statusCode >= 400) {
                        reject(typeof body === 'object' ? body.error : body);
                        return;
                    }
                    resolve(body);
                }
            )
        );
    });
};

const deployInfo = (project, version, name, notes) =>
    fetch({
        method: 'POST',
        path: `/deploy/info`,
        json: true,
        body: {
            version,
            project,
            name,
            notes
        }
    });

(async () => {
    try {
        const { project, version, env } = getConfig();
        try {
            await fsp.stat(path.resolve(__dirname, zxpPath));
        } catch {
            console.error('Error: zxp does not exist in filesystem');
            process.exit(1);
        }
        const notesFile = await fsp.readFile(
            path.resolve(__dirname, notesPath)
        );

        if (notesFile) {
            const [name, ...notes] = notesFile
                .toString()
                .split('\n')
                .filter(line => line.length > 0);

            if (name && notes.length > 0) {
                console.log(`Project: ${project}`);
                console.log(`Version: ${version}`);
                console.log(`Environment: ${env}`);
                console.log(`Title: ${name}`);
                console.log(`Notes:`);
                console.log('\t' + notes.join('\n\t'));
                console.log('');

                const { confirm } = await inquire.prompt({
                    type: 'confirm',
                    message: 'Everything look ok?',
                    name: 'confirm'
                });

                if (confirm) {
                    await deployInfo(project, version, name, notes);
                    await deployZxp(
                        project,
                        version,
                        path.resolve(__dirname, zxpPath)
                    );
                    console.log('Success');
                } else {
                    console.error('Aborted');
                }
            } else {
                console.error('Error: Must have at least 1 entry in notes');
            }
        } else {
            console.error('Error: payload/notes file not found');
        }
    } catch (error) {
        console.error(`Error: ${error}`);
    }
})();
