const gulp = require('gulp');
const path = require('path');
const getPath = subpath => path.resolve(process.cwd(), subpath);
const config = require(getPath('./package.json'));
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const merge = require('merge-stream');
const jsonxml = require('jsontoxml');
const dotenv = require('dotenv');
const fsp = require('fs').promises;
const argv = require('yargs').argv;
const zip = require('gulp-zip');
const pkg = require('./package.json');

const destinationPath = getPath('./package/id.mxi_Resources');
const environments = ['development', 'production', 'qa'];
const defaultLocale = 'en_US';
const { env } = argv;

dotenv.config({
    path: getPath(`./.${argv.env}.env`)
});

const getResources = async () => {
    const locales = await fsp.readdir(getPath('./static/locales'));
    const files = await Promise.all(
        locales.map(async locale => {
            const file = await fsp.readFile(
                getPath(`./static/locales/${locale}/translations.json`)
            );
            return file;
        }, {})
    );

    const resources = files.reduce((prev, file, index) => {
        const locale = locales[index];
        prev[locale] = JSON.parse(file.toString());
        return prev;
    }, {});
    return resources;
};

gulp.task('default', async function() {
    if (!environments.includes(env)) {
        console.error(`env must be one of ${environments.join(', ')}`);
        return;
    }

    const translations = await getResources();
    const defaultTranslations = translations[defaultLocale];
    const xmlEntries = Object.entries(translations).map(
        ([locale, resources]) => [
            locale,
            jsonxml(
                [
                    {
                        name: 'asf',
                        attrs: {
                            locale,
                            version: '1.0',
                            xmlns: '//ns.adobe.com/asf'
                        },
                        children: [
                            {
                                name: 'set',
                                attrs: { name: 'DefaultSet' },
                                children: Object.entries(resources).map(
                                    ([key, val]) => ({
                                        name: 'str',
                                        attrs: { name: key },
                                        children: { val }
                                    })
                                )
                            }
                        ]
                    }
                ],
                {
                    xmlHeader: true,
                    docType: 'asf SYSTEM "//ns.adobe.com/asf/asf_1_0.dtd"',
                    prettyPrint: true,
                    indent: '  '
                }
            )
        ]
    );

    await fsp.mkdir(destinationPath, { recursive: true });
    await Promise.all(
        xmlEntries.map(([locale, xml]) =>
            fsp.writeFile(`${destinationPath}/${locale}.xml`, xml)
        )
    );

    return merge(
        gulp
            .src(getPath('./template.mxi'))
            .pipe(replace(/\{id\}/g, config.name))
            .pipe(replace(/\{title\}/g, defaultTranslations['app.store.name']))
            .pipe(replace(/\{author\}/g, config.author))
            .pipe(replace(/\{version\}/g, config.version))
            .pipe(
                replace(
                    /\{update\}/g,
                    `${process.env.DOMAIN}/project/${config.name}/manifest`
                )
            )
            .pipe(
                replace(
                    /\{uidescription\}/g,
                    defaultTranslations['app.store.ui.description']
                )
            )
            .pipe(
                replace(
                    /\{license\}/g,
                    defaultTranslations['app.store.license']
                )
            )
            .pipe(
                replace(
                    /\{description\}/g,
                    defaultTranslations['app.store.description']
                )
            )
            .pipe(rename({ basename: 'id' }))
            .pipe(gulp.dest(getPath('package'))),
        gulp.src(getPath('./icon.png')).pipe(gulp.dest(getPath('./package'))),
        gulp
            .src(getPath('./template.xml'))
            .pipe(replace(/\{id\}/g, config.name))
            .pipe(replace(/\{title\}/g, defaultTranslations['app.store.name']))
            .pipe(replace(/\{width\}/g, config.extendscript.width))
            .pipe(replace(/\{height\}/g, config.extendscript.height))
            .pipe(replace(/\{version\}/g, pkg.version))
            .pipe(rename({ basename: 'manifest' }))
            .pipe(gulp.dest(getPath('plugin/CSXS')))
    );
});

gulp.task('zxp-zip', function() {
    return gulp
        .src(getPath('./package/**/*'))
        .pipe(zip('package.zip'))
        .pipe(gulp.dest(getPath('./deploy')));
});
