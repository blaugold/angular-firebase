import 'core-js'
import 'core-js/es7/reflect'

import 'zone.js/dist/zone'
import 'zone.js/dist/long-stack-trace-zone'
import 'zone.js/dist/proxy'
import 'zone.js/dist/sync-test'
import 'zone.js/dist/async-test'
import 'zone.js/dist/fake-async-test'
import 'zone.js/dist/jasmine-patch'
import { getTestBed } from '@angular/core/testing'
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing'

declare var __karma__: any;
declare var require: any;

__karma__.loaded = function () {}

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
)

const context = require.context('./src', true, /\.ts$/)

context.keys().map(context)

__karma__.start()
