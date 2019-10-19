/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2014 Adobe Inc.
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it. If you have received this file from a source other than Adobe,
 * then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 **************************************************************************/
//#include "PPro_API_Constants.jsx"
//@include "json.jsx"

$._PPP_ = {
    getVersionInfo: function() {
        return 'PPro ' + app.version + 'x' + app.build;
    },

    getSep: function() {
        if (Folder.fs === 'Macintosh') {
            return '/';
        } else {
            return '\\';
        }
    },

    saveProject: function() {
        app.project.save();
    },

    loadSettings: function(project) {
        var filename = project + '.settings.json';
        var projectPath = new File(app.project.path);
        var outPath = projectPath.parent + $._PPP_.getSep() + filename;
        var outFile = new File(outPath);
        var json = '{}';

        if (outFile) {
            outFile.encoding = 'UTF8';
            outFile.open('r', 'TEXT', '????');
            if (outFile) {
                try {
                    const data = outFile.read();
                    JSON.parse(data); // just want to see if it's valid json
                    json = data;
                } catch (e) {}
            }
            outFile.close();
        }
        projectPath.close();
        return json;
    },

    saveSettings: function(json, project) {
        var filename = project + '.settings.json';
        var projectPath = new File(app.project.path);
        var outPath = projectPath.parent + $._PPP_.getSep() + filename;
        var outFile = new File(outPath);
        if (outFile) {
            outFile.encoding = 'UTF8';
            outFile.open('w', 'TEXT', '????');
            outFile.write(JSON.stringify(json));
            outFile.close();
        }
        projectPath.close();
    },

    getProjectPath: function() {
        if (app.project) {
            return Folder(app.project.path).fsName;
        }
    },

    importFiles: function() {
        var filterString = '';
        if (Folder.fs === 'Windows') {
            filterString = 'All files:*.*';
        }
        if (app.project) {
            var fileOrFilesToImport = File.openDialog(
                'Choose files to import', // title
                filterString, // filter available files?
                true
            ); // allow multiple?
            if (fileOrFilesToImport) {
                // We have an array of File objects; importFiles() takes an array of paths.
                var importThese = [];
                if (importThese) {
                    for (var i = 0; i < fileOrFilesToImport.length; i++) {
                        importThese[i] = fileOrFilesToImport[i].fsName;
                    }
                    app.project.importFiles(
                        importThese,
                        true, // suppress warnings
                        app.project.getInsertionBin(),
                        false
                    ); // import as numbered stills
                }
            }
        }
    },

    clearLog: function() {
        var projectPath = new File(app.project.path);
        var outPath = projectPath.parent + $._PPP_.getSep() + 'debug.txt';
        var outFile = new File(outPath);
        if (outFile) {
            outFile.encoding = 'UTF8';
            outFile.open('w', 'TEXT', '????');
            outFile.close();
        }
    },

    log: function(data) {
        var projectPath = new File(app.project.path);
        var outPath = projectPath.parent + $._PPP_.getSep() + 'debug.txt';
        var outFile = new File(outPath);
        if (outFile) {
            outFile.encoding = 'UTF8';
            outFile.open('a', 'TEXT', '????');
            outFile.write(data + '\n');
            outFile.close();
        }
    },

    importMedia: function(fullPath, filter) {
        if (app.project) {
            var files = [];
            var folder = Folder(fullPath);

            if (typeof filter === 'string') {
                filter = new RegExp('/.+.(?:' + filter + ')$', 'i');
            } else {
                filter = '*';
            }
            var temp = folder.getFiles(filter);
            var index = 0;

            for (var i = 0; i < temp.length; i++) {
                var file = temp[i];
                var exists = $._PPP_.findClip(file.name);
                if (!exists) {
                    files[index] = temp[i].fsName;
                    index++;
                }
            }
            if (files.length > 0) {
                app.project.importFiles(files, true);
            }
        }
    },

    findClip: function(name, ref) {
        if (app.project) {
            var result;
            if (typeof ref === 'undefined') {
                ref = app.project.rootItem;
            }

            for (var i = 0; i < ref.children.numItems; i++) {
                var item = ref.children[i];

                switch (item.type) {
                    case ProjectItemType.CLIP:
                        if (item.name === name) {
                            result = item;
                        }
                        break;
                    case ProjectItemType.BIN:
                        result = $._PPP_.findClip(name, item);
                        break;
                    default:
                }

                if (typeof result !== 'undefined') {
                    break;
                }
            }
            return result;
        }
    },

    addMediaMetaData: function(data) {
        if (ExternalObject.AdobeXMPScript === undefined) {
            ExternalObject.AdobeXMPScript = new ExternalObject(
                'lib:AdobeXMPScript'
            );
        }

        if (app.project) {
            var filetypes = ['mp4', 'm4a'];
            for (var i = 0; i < data.length; i++) {
                var metadata = data[i];

                for (var j = 0; j < filetypes.length; j++) {
                    var filetype = filetypes[j];
                    if (!('filename' in metadata)) {
                        continue;
                    }
                    var item = $._PPP_.findClip(
                        metadata['filename'] + '.' + filetype
                    );

                    if (item) {
                        var xmpBlob = item.getXMPMetadata();
                        var xmp = new XMPMeta(xmpBlob);

                        if ('identifier' in metadata) {
                            xmp.setProperty(
                                XMPConst.NS_DC,
                                'identifier',
                                metadata['identifier']
                            );
                        }
                        if ('source' in metadata) {
                            xmp.setProperty(
                                XMPConst.NS_DC,
                                'source',
                                metadata['source']
                            );
                        }
                        if ('title' in metadata) {
                            xmp.deleteProperty(XMPConst.NS_DC, 'title');
                            xmp.setProperty(
                                XMPConst.NS_DC,
                                'title',
                                metadata['title']
                            );
                        }
                        if ('contributor' in metadata) {
                            xmp.deleteProperty(XMPConst.NS_DC, 'contributor');
                            xmp.setProperty(
                                XMPConst.NS_DC,
                                'contributor',
                                metadata['contributor']
                            );
                        }
                        if ('date' in metadata) {
                            xmp.deleteProperty(XMPConst.NS_DC, 'date');
                            xmp.setProperty(
                                XMPConst.NS_DC,
                                'date',
                                metadata['created_at']
                            );
                        }
                        item.setXMPMetadata(xmp.serialize());
                    }
                }
            }
        }
    },

    forceLogfilesOn: function() {
        app.enableQE();
        qe.setDebugDatabaseEntry('CreateLogFilesThatDoNotExist', 'true');
    },

    closeLog: function() {
        app.enableQE();
        qe.executeConsoleCommand('con.closelog');
    },

    setLocale: function(localeFromCEP) {
        $.locale = localeFromCEP;
    },

    getLocale: function() {
        return $.locale;
    }
};
