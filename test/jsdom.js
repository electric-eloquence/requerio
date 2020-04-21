import fs from 'fs';
import path from 'path';

import * as Redux from 'redux';
import cheerio from 'cheerio';
import {JSDOM} from 'jsdom';

import $organismsBefore from './fixtures/organisms';
import tests from './tests/jsdom';

const html = fs.readFileSync(path.join(__dirname, 'fixtures', 'index.html'), 'utf8');
const $ = global.$ = cheerio.load(html);
const $organismsAfter = JSON.parse(JSON.stringify($organismsBefore));
const {window} = new JSDOM(html);

global.window = window;
global.document = window.document;

// Using require so that Requerio is loaded after global.window is set.
const requerioPath = '../src/requerio';
require(requerioPath);

describe('Requerio', tests($organismsBefore, window.Requerio, $, Redux, $organismsAfter));
