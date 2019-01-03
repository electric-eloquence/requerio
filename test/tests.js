import fs from 'fs';
import path from 'path';

import * as Redux from 'redux';
import cheerio from 'cheerio';
import {expect} from 'chai';

import Requerio from '../src/requerio';
import organismsIncept from '../src/organisms-incept';

const html = fs.readFileSync(path.join(__dirname, 'fixtures', 'index.html'), 'utf8');
const $ = global.$ = cheerio.load(html);

const $organismsBefore = {
  'window': null,
  'html': null,
  'body': null,
  '#main': null,
  '.main__section--0': null,
  '.main__section--1': null
};
const $organismsAfter = Object.assign({}, $organismsBefore);

function actionsGet(requerio) {
  return {
    mainHide: () => {
      requerio.$orgs['#main'].dispatchAction('css', ['display', 'none']);
    },

    mainShow: () => {
      requerio.$orgs['#main'].dispatchAction('css', ['display', 'block']);
    }
  };
}

const requerio = new Requerio($, Redux, $organismsAfter, actionsGet);

describe('Requerio', function () {
  it('should instantiate correctly', function () {
    expect(requerio).to.be.an.instanceof(Requerio);
    expect(requerio).to.have.property('$');
    expect(requerio).to.have.property('Redux');
    expect(requerio).to.have.property('$orgs');
    expect(requerio).to.have.property('actions');
    expect(requerio).to.have.property('init');
    expect(requerio.$).to.equal($);
    expect(requerio.Redux).to.equal(Redux);
    expect(requerio.$orgs).to.equal($organismsAfter);
    expect(requerio.actions).to.be.an.instanceof(Object);
    expect(requerio.init).to.be.a('function');
  });

  it('should initialize correctly', function () {
    requerio.init();

    Object.keys($organismsBefore).forEach((selector) => {
      expect($organismsBefore[selector]).to.be.null;
    });
    Object.keys($organismsAfter).forEach((selector) => {
      const $organism = $organismsAfter[selector];

      expect($organism).to.be.an.instanceof(Object);
      expect($organism.selector).to.equal(selector);

      if (selector === 'window') {
        return;
      }

      expect($organism.hasRequerio).to.equal(true);
      expect($organism.$members).to.be.an('array');
      expect($organism.dispatchAction).to.be.a('function');
      expect($organism.getState).to.be.a('function');
      expect($organism.getStore).to.be.a('function');
      expect($organism.$membersPopulate).to.be.a('function');
      expect($organism.setBoundingClientRect).to.be.a('function');
      expect($organism.scrollTop).to.be.a('function');
      expect($organism.width).to.be.a('function');
      expect($organism.height).to.be.a('function');
    });
  });
});
