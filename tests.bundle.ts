import 'core-js'
import 'core-js/es7/reflect'

import 'zone.js/dist/zone'
import 'zone.js/dist/long-stack-trace-zone'
import 'zone.js/dist/proxy'
import 'zone.js/dist/sync-test'
import 'zone.js/dist/async-test'
import 'zone.js/dist/fake-async-test'
import 'zone.js/dist/jasmine-patch'

declare var System: any
declare var __karma__: any

__karma__.loaded = function () {}

Promise.all([
  System.import('@angular/core/testing'),
  System.import('@angular/platform-browser-dynamic/testing')
])
  .then(([testing, browserTesting]) => {
    testing.getTestBed().initTestEnvironment(
      browserTesting.BrowserDynamicTestingModule,
      browserTesting.platformBrowserDynamicTesting()
    )
  })
  // Load test modules to run tests
  // .then(() => (require as any).context('./spec', true, /\.spec\.ts$/))
  // .then(execContext)
  // Load all src modules to include uncovered areas in coverage report
  .then(() => (require as any).context('./src', true, /\.ts$/))
  .then(execContext)
  // Start karma
  .then(__karma__.start, __karma__.error)

function execContext(context) {
  context.keys().map(context)
}