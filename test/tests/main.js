delete global.window;

import fs from 'fs';
import path from 'path';

import * as Redux from 'redux';
import cheerio from 'cheerio';
import {expect} from 'chai';

import Requerio from '../../src/requerio';
import organismsIncept from '../../src/organisms-incept';

const html = fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'index.html'), 'utf8');
const $ = global.$ = cheerio.load(html);

const $organismsBefore = {
  'window': null,
  'document': null,
  'html': null,
  'body': null,
  '#main': null,
  '.main__section': null,
  '.main__section--0': null,
  '.main__section--1': null
};
const $organismsAfter = JSON.parse(JSON.stringify($organismsBefore));
const $organisms = $organismsAfter;

function actionsGet(requerio) {
  return {
    addClassTest: () => {
      requerio.$orgs['#main'].dispatchAction('addClass', 'test');
    },

    removeClassTest: () => {
      requerio.$orgs['#main'].dispatchAction('removeClass', 'test');
    },

    toggleClassTest: () => {
      requerio.$orgs['#main'].dispatchAction('toggleClass', 'test');
    },

    attrTest: () => {
      requerio.$orgs['#main'].dispatchAction('attr', ['data-test', 'test']);
    },

    cssTest: () => {
      requerio.$orgs['#main'].dispatchAction('css', ['color', 'black']);
    },

    getBoundingClientRectTest: () => {
      return requerio.$orgs['#main'].dispatchAction('getBoundingClientRect');
    },

    setBoundingClientRectTest: () => {
      requerio.$orgs['#main'].dispatchAction(
        'setBoundingClientRect',
        {
          width: 1100,
          height: 1100,
          top: 110,
          right: 1210,
          bottom: 1210,
          left: 110
        }
      );
    },

    setBoundingClientRectTest1: () => {
      requerio.$orgs['.main__section'].dispatchAction(
        'setBoundingClientRect',
        {
          width: 1100,
          height: 1100,
          top: 110,
          right: 1210,
          bottom: 1210,
          left: 110
        },
        1
      );
    },

    heightTest: () => {
      requerio.$orgs['#main'].dispatchAction('height', 1000);
    },

    htmlTest: () => {
      requerio.$orgs['#main'].dispatchAction('html', '<h2>Section 1</h2><p>Paragraph 1</p>');
    },

    innerWidthTest: () => {
      requerio.$orgs['#main'].dispatchAction('innerWidth', 1000);
    },

    innerHeightTest: () => {
      requerio.$orgs['#main'].dispatchAction('innerHeight', 1000);
    },

    scrollTopTest: () => {
      requerio.$orgs['#main'].dispatchAction('scrollTop', 100);
    },

    widthTest: () => {
      requerio.$orgs['#main'].dispatchAction('width', 1000);
    }
  };
}

const requerio = new Requerio($, Redux, $organismsAfter, actionsGet);
const actions = requerio.actions;

describe('Requerio', function () {
  describe('constructor', function() {
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
      // Need to unset these because they were set in jsdom.js.
      delete global.window;
      delete global.document;

      requerio.init();

      Object.keys($organismsBefore).forEach((selector) => {
        expect($organismsBefore[selector]).to.be.null;
      });
      Object.keys($organismsAfter).forEach((selector) => {
        const $organism = $organismsAfter[selector];

        expect($organism).to.be.an.instanceof(Object);
        expect($organism.selector).to.equal(selector);

        if (selector === 'window' || selector === 'document') {
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

  describe('non-prototype methods', function () {
    describe('scrollTop()', function () {
      it('should set a value on the server to mock the method call on the client', function () {
        Object.keys($organisms).forEach((selector) => {
          const $organism = $organisms[selector];

          const scrollTopVal = $organism.scrollTop(1);

          expect(scrollTopVal).to.equal(1);
        });
      });

      it('should get the previously set value', function () {
        Object.keys($organisms).forEach((selector) => {
          const $organism = $organisms[selector];
          const scrollTopVal = $organism.scrollTop();

          expect(scrollTopVal).to.equal(1);
        });
      });
    });

    describe('width()', function () {
      it(
        'should accept a value and return the same value on the server to mock the method call on the client',
        function () {
          Object.keys($organisms).forEach((selector) => {
            const $organism = $organisms[selector];

            const widthVal = $organism.width(1);

            expect(widthVal).to.equal(1);
          });
        }
      );
    });

    describe('height()', function () {
      it(
        'should accept a value and return the same value on the server to mock the method call on the client',
        function () {
          Object.keys($organisms).forEach((selector) => {
            const $organism = $organisms[selector];

            const heightVal = $organism.height(1);

            expect(heightVal).to.equal(1);
          });
        }
      );
    });
  });

  describe('prototype-override', function () {
    it('should .dispatchAction() to change state which should be retrievable by .getState()', function () {
      const $org = $organisms['#main'];

      $org.dispatchAction('css', ['display', 'none']);
      const displayStyle = $org.getState().style.display;

      expect(displayStyle).to.equal('none');
    });

    it(
      'should get the state for a specific $organism $member when .getState() is called in a targeted manner',
      function() {
        const $org = $organisms['.main__section'];

        $org.dispatchAction('css', ['display', 'none'], 1);
        const displayStyle0 = $org.getState(0).style.display;
        const displayStyle1 = $org.getState(1).style.display;

        expect(displayStyle0).to.be.undefined;
        expect(displayStyle1).to.equal('none');
      }
    );

    it('should get Redux store when .getStore() is called', function() {
      const $org = $organisms['#main'];

      const stateStore = $org.getStore();

      expect(stateStore).to.have.property('dispatch');
      expect(stateStore).to.have.property('subscribe');
      expect(stateStore).to.have.property('getState');
      expect(stateStore).to.have.property('replaceReducer');
    });

    it('should reset .$members when .$membersPopulate() is called', function() {
      const $org = $organisms['.main__section'];
      $org.$members = [];
      const $membersLengthBefore = $org.$members.length;

      $org.$membersPopulate($org);
      const $members =  $org.$members
      const $membersLengthAfter = $members.length;

      expect($membersLengthBefore).to.equal(0);
      expect($membersLengthAfter).to.equal(2);
      expect($members[0][0].attribs.class).to.equal('main__section main__section--0');
      expect($members[1][0].attribs.class).to.equal('main__section main__section--1');
    });

    it(
      'should set .boundingClientRect properties when .setBoundingClientRect() is called',
      function() {
        const $org = $organisms['#main'];
        const boundingClientRectBefore = JSON.parse(JSON.stringify($org.getState().boundingClientRect));

        $org.setBoundingClientRect(
          {
            width: 1000,
            height: 1000,
            top: 100,
            right: 1100,
            bottom: 1100,
            left: 100
          }
        );
        const boundingClientRectAfter = $org.getState().boundingClientRect;

        Object.keys(boundingClientRectBefore).forEach((i) => {
          expect(boundingClientRectBefore[i]).to.equal(null);
        });
        expect(boundingClientRectAfter.width).to.equal(1000);
        expect(boundingClientRectAfter.height).to.equal(1000);
        expect(boundingClientRectAfter.top).to.equal(100);
        expect(boundingClientRectAfter.right).to.equal(1100);
        expect(boundingClientRectAfter.bottom).to.equal(1100);
        expect(boundingClientRectAfter.left).to.equal(100);
      }
    );

    it(
      'should set .boundingClientRect properties on a specific $organism $member when .setBoundingClientRect() is called in a targeted manner',
      function() {
        const $org = $organisms['.main__section'];
        const stateBefore0 = JSON.parse(JSON.stringify($org.getState(0)));
        const stateBefore1 = JSON.parse(JSON.stringify($org.getState(1)));

        $org.setBoundingClientRect(
          {
            width: 1000,
            height: 1000,
            top: 100,
            right: 1100,
            bottom: 1100,
            left: 100
          },
          1
        );
        const stateAfter0 = $org.getState(0);
        const stateAfter1 = $org.getState(1);
        const boundingClientRectBefore0 = stateBefore0.boundingClientRect;
        const boundingClientRectBefore1 = stateBefore1.boundingClientRect;
        const boundingClientRectAfter0 = stateAfter0.boundingClientRect;
        const boundingClientRectAfter1 = stateAfter1.boundingClientRect;

        Object.keys(boundingClientRectBefore0).forEach((i) => {
          expect(boundingClientRectBefore0[i]).to.equal(null);
        });
        Object.keys(boundingClientRectBefore1).forEach((i) => {
          expect(boundingClientRectBefore1[i]).to.equal(null);
        });
        Object.keys(boundingClientRectAfter0).forEach((i) => {
          expect(boundingClientRectAfter0[i]).to.equal(null);
        });
        expect(boundingClientRectAfter1.width).to.equal(1000);
        expect(boundingClientRectAfter1.height).to.equal(1000);
        expect(boundingClientRectAfter1.top).to.equal(100);
        expect(boundingClientRectAfter1.right).to.equal(1100);
        expect(boundingClientRectAfter1.bottom).to.equal(1100);
        expect(boundingClientRectAfter1.left).to.equal(100);
      }
    );

    it('should get .boundingClientRect properties when .getBoundingClientRect() is called', function() {
      const $org = $organisms['.main__section'];

      const boundingClientRect = $org[1].getBoundingClientRect();

      expect(boundingClientRect.width).to.equal(1000);
      expect(boundingClientRect.height).to.equal(1000);
      expect(boundingClientRect.top).to.equal(100);
      expect(boundingClientRect.right).to.equal(1100);
      expect(boundingClientRect.bottom).to.equal(1100);
      expect(boundingClientRect.left).to.equal(100);
    });
  });

  describe('reducer-get', function () {
    it('should dispatch the "addClass" action', function () {
      actions.addClassTest();
      const state = $organisms['#main'].getState();

      expect(state.attribs['class']).to.equal('test');
    });

    it('should dispatch the "removeClass" action', function () {
      actions.removeClassTest();
      const state = $organisms['#main'].getState();

      expect(state.attribs['class']).to.equal('');
    });

    it('should dispatch the "toggleClass" action', function () {
      actions.toggleClassTest();
      const state = $organisms['#main'].getState();

      expect(state.attribs['class']).to.equal('test');
    });

    it('should dispatch the "attr" action', function () {
      actions.attrTest();
      const state = $organisms['#main'].getState();

      expect(state.attribs['data-test']).to.equal('test');
    });

    it('should dispatch the "css" action', function () {
      actions.cssTest();
      const state = $organisms['#main'].getState();

      expect(state.style.color).to.equal('black');
    });

    it('should dispatch the "getBoundingClientRect" action', function () {
      // On the client, getBoundingClientRect takes measurements and set the state.
      // On the server, it will normally do nothing.
      // However, since it ensures that the .boundingClientRect object is fully populated, we can test that it works by
      // first unsetting the .boundingClientRect properties and checking whether it resets them.
      const $org = $organisms['#main'];
      const stateBefore = $org.getState();
      stateBefore.boundingClientRect = {};
      const boundingClientRectBefore = JSON.parse(JSON.stringify(stateBefore.boundingClientRect));

      actions.getBoundingClientRectTest();
      const stateAfter = $org.getState();
      const boundingClientRectAfter = stateAfter.boundingClientRect;

      expect(Object.keys(boundingClientRectBefore)).to.have.lengthOf(0);
      expect(boundingClientRectAfter.width).to.equal(1000);
      expect(boundingClientRectAfter.height).to.equal(1000);
      expect(boundingClientRectAfter.top).to.equal(100);
      expect(boundingClientRectAfter.right).to.equal(1100);
      expect(boundingClientRectAfter.bottom).to.equal(1100);
      expect(boundingClientRectAfter.left).to.equal(100);
    });

    it('should dispatch the "setBoundingClientRect" action', function () {
      actions.setBoundingClientRectTest();
      const state = $organisms['#main'].getState();
      const boundingClientRect = state.boundingClientRect;

      expect(boundingClientRect.width).to.equal(1100);
      expect(boundingClientRect.height).to.equal(1100);
      expect(boundingClientRect.top).to.equal(110);
      expect(boundingClientRect.right).to.equal(1210);
      expect(boundingClientRect.bottom).to.equal(1210);
      expect(boundingClientRect.left).to.equal(110);
    });

    it('should dispatch the "setBoundingClientRect" action in a targeted manner', function () {
      actions.setBoundingClientRectTest1();
      const state0 = $organisms['.main__section'].getState(0);
      const boundingClientRect0 = state0.boundingClientRect;
      const state1 = $organisms['.main__section'].getState(1);
      const boundingClientRect1 = state1.boundingClientRect;

      expect(boundingClientRect0.width).to.equal(null);
      expect(boundingClientRect0.height).to.equal(null);
      expect(boundingClientRect0.top).to.equal(null);
      expect(boundingClientRect0.right).to.equal(null);
      expect(boundingClientRect0.bottom).to.equal(null);
      expect(boundingClientRect0.left).to.equal(null);
      expect(boundingClientRect1.width).to.equal(1100);
      expect(boundingClientRect1.height).to.equal(1100);
      expect(boundingClientRect1.top).to.equal(110);
      expect(boundingClientRect1.right).to.equal(1210);
      expect(boundingClientRect1.bottom).to.equal(1210);
      expect(boundingClientRect1.left).to.equal(110);
    });

    it('should dispatch the "height" action', function () {
      actions.heightTest();
      const state = $organisms['#main'].getState();

      expect(state.height).to.equal(1000);
    });

    it('should dispatch the "html" action', function () {
      actions.htmlTest();
      const state = $organisms['#main'].getState();

      expect(state.innerHTML).to.equal('<h2>Section 1</h2><p>Paragraph 1</p>');
    });

    it('should dispatch the "innerWidth" action', function () {
      actions.innerWidthTest();
      const state = $organisms['#main'].getState();

      expect(state.innerWidth).to.equal(1000);
    });

    it('should dispatch the "scrollTop" action', function () {
      actions.scrollTopTest();
      const state = $organisms['#main'].getState();

      expect(state.scrollTop).to.equal(100);
    });

    it('should dispatch the "width" action', function () {
      actions.widthTest();
      const state = $organisms['#main'].getState();

      expect(state.width).to.equal(1000);
    });
  });
});
