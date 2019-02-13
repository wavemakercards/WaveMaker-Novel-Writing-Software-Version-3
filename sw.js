/*
Verison 3.0.1
*/
console.log("Version ", "3.0.1")
var version = 301;
'use strict';
importScripts('sw-toolbox.js'); toolbox.precache([
    "index.html?=_"+version,
    "global/css/global.css?=_"+version,
    "global/js/init.js?=_"+version,
    "global/js/datamanager.js?=_"+version,
    "components/manuscript-tools.js?=_"+version,
    "components/manuscript-tools.html?=_"+version,
    "components/navigationbar.html?=_"+version,
    "lib/css/font-awesome/css/font-awesome.min.css?=_"+version,
    "lib/css/animate.css?=_"+version,
    "lib/css/bootstrap.min.css?=_"+version,
    "lib/css/fonts.css?=_"+version,
    "lib/css/jquery-ui.css?=_"+version,
    "lib/css/ui.fancytree.1.css?=_"+version,
    "lib/css/ui.fancytree.css?=_"+version,
    "lib/js/autosize.js?=_"+version,
    "lib/js/bootstrap.min.js?=_"+version,
    "lib/js/dexie.js?=_"+version,
    "lib/js/jquery-3.3.1.min.js?=_"+version,
    "lib/js/jquery-ui.min.js?=_"+version,
    "lib/js/jquery.fancytree-all-deps.js?=_"+version,
    "lib/js/jquery.ui-contextmenu.min.js?=_"+version,
    "lib/js/showdown.min.js?=_"+version,
    "lib/js/sweetalert2.all.js?=_"+version,
    "lib/js/tether.min.js?=_"+version,
    "lib/js/touchpunch.js?=_"+version,
    "lib/js/turndown.js?=_"+version,
    "tools/cards/script.js?=_"+version,
    "tools/cards/html.html?=_"+version,
    "tools/challenge/script.js?=_"+version,
    "tools/challenge/html.html?=_"+version,
    "tools/distraction-free/html.html?=_"+version,
    "tools/distraction-free/script.js?=_"+version,
    "tools/exporting/html.html?=_"+version,
    "tools/exporting/script.js?=_"+version,
    "tools/gridplanner/html.html?=_"+version,
    "tools/gridplanner/script.js?=_"+version,
    "tools/snowflake/html.html?=_"+version,
    "tools/snowflake/script.js?=_"+version,
    "tools/timeline/html.html?=_"+version,
    "tools/timeline/script.js?=_"+version,
    "tools/welcome/html.html?=_"+version,
    "tools/welcome/script.js?=_"+version,
    "tools/writer/html.html?=_"+version,
    "tools/writer/script.js?=_"+version
]); toolbox.router.get('/*', toolbox.networkFirst, { networkTimeoutSeconds: 5});

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