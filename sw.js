/*
Verison 3.0.2
*/
'use strict';
importScripts('sw-toolbox.js'); toolbox.precache([
    "index.html",
    "global/css/global.css",
    "global/js/init.js",
    "global/js/datamanager.js",
    "components/manuscript-tools.js",
    "components/manuscript-tools.html",
    "components/navigationbar.html",
    "lib/css/font-awesome/css/font-awesome.min.css",
    "lib/css/animate.css",
    "lib/css/bootstrap.min.css",
    "lib/css/fonts.css",
    "lib/css/jquery-ui.css",
    "lib/css/ui.fancytree.1.css",
    "lib/css/ui.fancytree.css",
    "lib/js/autosize.js",
    "lib/js/bootstrap.min.js",
    "lib/js/dexie.js",
    "lib/js/jquery-3.3.1.min.js",
    "lib/js/jquery-ui.min.js",
    "lib/js/jquery.fancytree-all-deps.js",
    "lib/js/jquery.ui-contextmenu.min.js",
    "lib/js/showdown.min.js",
    "lib/js/sweetalert2.all.js",
    "lib/js/tether.min.js",
    "lib/js/touchpunch.js",
    "lib/js/turndown.js",
    "tools/cards/html.html",
    "tools/cards/script.js",
    "tools/challenge/html.html",
    "tools/challenge/script.js",
    "tools/distraction-free/html.html",
    "tools/distraction-free/script.js",
    "tools/gridplanner/html.html",
    "tools/gridplanner/script.js",
    "tools/snowflake/html.html",
    "tools/snowflake/script.js",
    "tools/timeline/html.html",
    "tools/timeline/script.js",
    "tools/welcome/html.html",
    "tools/welcome/script.js",
    "tools/writer/html.html",
    "tools/writer/script.js"
]); toolbox.router.get('/*', toolbox.networkFirst, { networkTimeoutSeconds: 50});

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