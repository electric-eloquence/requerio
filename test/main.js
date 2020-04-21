import fs from 'fs';
import path from 'path';

import * as Redux from 'redux';
import cheerio from 'cheerio';

import $organismsBefore from './fixtures/organisms';
import Requerio from '../src/requerio';
import tests from './tests/main';

const html = fs.readFileSync(path.join(__dirname, 'fixtures', 'index.html'), 'utf8');
const $ = global.$ = cheerio.load(html);
const $organismsAfter = JSON.parse(JSON.stringify($organismsBefore));

describe('Requerio', tests($organismsBefore, Requerio, $, Redux, $organismsAfter));
