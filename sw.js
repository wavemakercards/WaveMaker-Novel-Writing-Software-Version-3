'use strict';
importScripts('sw-toolbox.js'); toolbox.precache([
    "index.html",
    "css/style.css",
    "css/bootstrap-reboot.min.css",
    "scripts/jquery-3.3.1.min.js",
    "scripts/index.js"
]); toolbox.router.get('/images/ *', toolbox.networkFirst); toolbox.router.get('/*', toolbox.networkFirst, { networkTimeoutSeconds: 5});

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