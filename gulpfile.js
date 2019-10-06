const gulp = require('gulp');
const config = require('./package.json');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const path = require('path');
const merge = require('merge-stream');
const jsonxml = require('jsontoxml');
const dotenv = require('dotenv');
const fs = require('fs').promises;
const argv = require('yargs').argv;

const locales = config.locales;
const sourcePath = './static/locales/';
const destinationPath = './plugin/id.mxi_Resources';
const environments = ['development', 'production', 'qa'];
const { env } = argv;

dotenv.config({
    path: path.resolve(__dirname, `./.${argv.env}.env`)
});

const getTranslations = () =>
    Promise.all(
        locales.map(locale => [
            locale,
            require(`${sourcePath}${locale}/translations.json`)
        ])
    );

gulp.task('default', async function() {
    if (!environments.includes(env)) {
        console.error(`env must be one of ${environments.join(', ')}`);
        return;
    }

    const translations = Object.fromEntries(await getTranslations());
    const defaultLocale = 'en_US';
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

    await Promise.all(
        xmlEntries.map(([locale, xml]) =>
            fs.writeFile(`${destinationPath}/${locale}.xml`, xml)
        )
    );

    return merge(
        gulp
            .src('./template.mxi')
            .pipe(replace(/\{id\}/g, config.name))
            .pipe(replace(/\{title\}/g, defaultTranslations['app.store.name']))
            .pipe(replace(/\{author\}/g, config.author))
            .pipe(replace(/\{version\}/g, config.version))
            .pipe(
                replace(
                    /\{update\}/g,
                    `${process.env.DOMAIN}/${config.name}/latest`
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
            .pipe(gulp.dest('plugin')),
        gulp
            .src('./template.xml')
            .pipe(replace(/\{id\}/g, config.name))
            .pipe(replace(/\{title\}/g, defaultTranslations['app.store.name']))
            .pipe(replace(/\{width\}/g, config.extendscript.width))
            .pipe(replace(/\{height\}/g, config.extendscript.height))
            .pipe(rename({ basename: 'manifest' }))
            .pipe(gulp.dest('plugin/CSXS'))
    );
});

gulp.task('zxp', function() {
    return gulp
        .src('./signing/package.zxp')
        .pipe(gulp.dest('plugin/Extension'));
});
