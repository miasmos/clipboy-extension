function onLoaded() {
    var csInterface = new CSInterface();
    var locale = csInterface.hostEnvironment.appUILocale;

    loadJSX();
    csInterface.addEventListener('ApplicationBeforeQuit', function(event) {
        csInterface.evalScript('$._PPP_.closeLog()');
    });
    csInterface.evalScript('$._PPP_.forceLogfilesOn()'); // turn on log files when launching
    csInterface.evalScript("$._PPP_.setLocale('" + locale + "')");

    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'r') {
            history.go(0);
        }
    });
}

/**
 * Load JSX file into the scripting context of the product. All the jsx files in
 * folder [ExtensionRoot]/jsx & [ExtensionRoot]/jsx/[AppName] will be loaded.
 */
function loadJSX() {
    var csInterface = new CSInterface();

    // get the appName of the currently used app. For Premiere Pro it's "PPRO"
    var appName = csInterface.hostEnvironment.appName;
    var extensionPath = csInterface.getSystemPath(SystemPath.EXTENSION);

    // load general JSX script independent of appName
    var extensionRootGeneral = extensionPath + '/jsx/';
    csInterface.evalScript('$._ext.evalFiles("' + extensionRootGeneral + '")');

    // load JSX scripts based on appName
    var extensionRootApp = extensionPath + '/jsx/' + appName + '/';
    csInterface.evalScript('$._ext.evalFiles("' + extensionRootApp + '")');
}
