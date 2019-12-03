/*
Mod version number to force system wide update
*/
var version = "3.0.3.1";
console.log("Version ", version);
var versionTrigger = "?=_" + version;
'use strict';
importScripts('sw-toolbox.js');
toolbox.precache([
    "index.html" + versionTrigger,
    "global/css/global.css" + versionTrigger,
    "global/js/init.js" + versionTrigger,
    "global/js/datamanager.js" + versionTrigger,
    "components/manuscript-tools.js" + versionTrigger,
    "components/manuscript-tools.html" + versionTrigger,
    "components/navigationbar.html" + versionTrigger,
    "lib/css/font-awesome/css/font-awesome.min.css" + versionTrigger,
    "lib/css/animate.css" + versionTrigger,
    "lib/css/bootstrap.min.css" + versionTrigger,
    "lib/css/fonts.css" + versionTrigger,
    "lib/css/jquery-ui.css" + versionTrigger,
    "lib/css/ui.fancytree.1.css" + versionTrigger,
    "lib/css/ui.fancytree.css" + versionTrigger,
    "lib/js/autosize.js" + versionTrigger,
    "lib/js/bootstrap.min.js" + versionTrigger,
    "lib/js/dexie.js" + versionTrigger,
    "lib/js/jquery-3.3.1.min.js" + versionTrigger,
    "lib/js/jquery-ui.min.js" + versionTrigger,
    "lib/js/jquery.fancytree-all-deps.js" + versionTrigger,
    "lib/js/jquery.ui-contextmenu.min.js" + versionTrigger,
    "lib/js/showdown.min.js" + versionTrigger,
    "lib/js/sweetalert2.all.js" + versionTrigger,
    "lib/js/tether.min.js" + versionTrigger,
    "lib/js/touchpunch.js" + versionTrigger,
    "lib/js/turndown.js" + versionTrigger,
    "tools/cards/script.js" + versionTrigger,
    "tools/cards/html.html" + versionTrigger,
    "tools/challenge/script.js" + versionTrigger,
    "tools/challenge/html.html" + versionTrigger,
    "tools/distraction-free/html.html" + versionTrigger,
    "tools/distraction-free/script.js" + versionTrigger,
    "tools/exporting/html.html" + versionTrigger,
    "tools/exporting/script.js" + versionTrigger,
    "tools/gridplanner/html.html" + versionTrigger,
    "tools/gridplanner/script.js" + versionTrigger,
    "tools/snowflake/html.html" + versionTrigger,
    "tools/snowflake/script.js" + versionTrigger,
    "tools/timeline/html.html" + versionTrigger,
    "tools/timeline/script.js" + versionTrigger,
    "tools/welcome/html.html" + versionTrigger,
    "tools/welcome/script.js" + versionTrigger,
    "tools/writer/html.html" + versionTrigger,
    "tools/writer/script.js" + versionTrigger,
    "tools/mindmap/html.html" + versionTrigger,
    "tools/mindmap/script.js" + versionTrigger,
    "tools/search/html.html" + versionTrigger,
    "tools/search/script.js" + versionTrigger,
    "templates/savethecat.json" + versionTrigger,
    "templates/3act.json" + versionTrigger,
    "templates/bnp.json" + versionTrigger,
    "templates/ms.json" + versionTrigger
]);
toolbox.router.get('/*', toolbox.cacheFirst, {
    networkTimeoutSeconds: 5
});

/*
//cachefirst version for live
'use strict';
importScripts('sw-toolbox.js'); toolbox.precache([
    "index.html",
    "css/style.css",
    "css/bootstrap-reboot.min.css",
    "scripts/jquery-3.3.1.min.js",
    "scripts/index.js"
]); toolbox.router.get('/images/ *', toolbox.cacheFirst); toolbox.router.get('/*', toolbox.networkFirst, { networkTimeoutSeconds: 5});
*/