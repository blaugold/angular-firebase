"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("core-js");
require("core-js/es7/reflect");
require("zone.js/dist/zone");
require("zone.js/dist/long-stack-trace-zone");
require("zone.js/dist/proxy");
require("zone.js/dist/sync-test");
require("zone.js/dist/async-test");
require("zone.js/dist/fake-async-test");
require("zone.js/dist/jasmine-patch");
__karma__.loaded = function () { };
Promise.all([
    System.import('@angular/core/testing'),
    System.import('@angular/platform-browser-dynamic/testing')
])
    .then(([testing, browserTesting]) => {
    testing.getTestBed().initTestEnvironment(browserTesting.BrowserDynamicTestingModule, browserTesting.platformBrowserDynamicTesting());
})
    .then(() => require.context('./src', true, /\.ts$/))
    .then(execContext)
    .then(__karma__.start, __karma__.error);
function execContext(context) {
    context.keys().map(context);
}
