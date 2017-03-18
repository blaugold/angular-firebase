"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
const run_in_zone_1 = require("../operator/run-in-zone");
Observable_1.Observable.prototype.runInZone = run_in_zone_1.runInZone;
