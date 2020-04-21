import fs from 'fs';
import path from 'path';

import * as Redux from 'redux';
import {JSDOM} from 'jsdom';

import $organismsBefore from './fixtures/organisms';
import Requerio from '../src/requerio';
import tests from './tests/jsdom';

const html = fs.readFileSync(path.join(__dirname, 'fixtures', 'index.html'), 'utf8');
const {window} = new JSDOM(html);

global.window = window;
global.document = window.document;

const $ = global.$ = require('jquery');
const $organismsAfter = JSON.parse(JSON.stringify($organismsBefore));

describe('Requerio with jQuery', tests($organismsBefore, Requerio, $, Redux, $organismsAfter));
