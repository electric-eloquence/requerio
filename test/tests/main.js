delete global.window;

import fs from 'fs';
import path from 'path';

import * as Redux from 'redux';
import cheerio from 'cheerio';
import {expect} from 'chai';

import Requerio from '../../src/requerio';

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
const requerio = new Requerio($, Redux, $organismsAfter);
const actions = {
  addClassString: () => {
    requerio.$orgs['#main'].dispatchAction('addClass', 'add-class-string');
  },

  addClassFunction: () => {
    requerio.$orgs['#main'].dispatchAction('addClass', () => 'add-class-function');
  },

  addClass1: () => {
    requerio.$orgs['.main__section'].dispatchAction('addClass', 'add-class-1', 1);
  },

  addClass2: () => {
    requerio.$orgs['.main__section'].dispatchAction('addClass', 'out-of-bounds', 2);
  },

  removeClassString: () => {
    requerio.$orgs['#main'].dispatchAction('removeClass', 'remove-class-string');
  },

  removeClassFunction: () => {
    requerio.$orgs['#main'].dispatchAction('removeClass', () => 'remove-class-function');
  },

  toggleClassString: () => {
    requerio.$orgs['#main'].dispatchAction('toggleClass', 'toggle-class-string');
  },

  toggleClassFunction: () => {
    requerio.$orgs['#main'].dispatchAction('toggleClass', () => 'toggle-class-function');
  },

  toggleClassTrue: () => {
    requerio.$orgs['#main'].dispatchAction('toggleClass', ['toggle-class-true', true]);
  },

  toggleClassFalse: () => {
    requerio.$orgs['#main'].dispatchAction('toggleClass', ['toggle-class-false', false]);
  },

  attrArrayString: () => {
    requerio.$orgs['#main'].dispatchAction('attr', ['data-test', 'testing12345']);
  },

  attrArrayFunction: () => {
    requerio.$orgs['#main'].dispatchAction('attr', ['data-test', () => 'testing67890']);
  },

  cssArrayString: () => {
    requerio.$orgs['#main'].dispatchAction('css', ['color', 'red']);
  },

  cssArrayFunction: () => {
    requerio.$orgs['#main'].dispatchAction('css', ['color', () => 'green']);
  },

  cssObject: () => {
    requerio.$orgs['#main'].dispatchAction('css', {color: 'blue'});
  },

  getBoundingClientRect: () => {
    requerio.$orgs['#main'].dispatchAction('getBoundingClientRect');
  },

  setBoundingClientRect: () => {
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

  setBoundingClientRect1: () => {
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

  height: () => {
    requerio.$orgs['#main'].dispatchAction('height', 1000);
  },

  htmlString: () => {
    requerio.$orgs['#main'].dispatchAction('html', '<h2>Section 1</h2><p>Paragraph 1</p>');
  },

  htmlFunction: () => {
    requerio.$orgs['#main'].dispatchAction('html', () => '<h2>Section 1</h2><p>Paragraph 1</p>');
  },

  innerWidth: () => {
    requerio.$orgs['#main'].dispatchAction('innerWidth', 1000);
  },

  innerHeight: () => {
    requerio.$orgs['#main'].dispatchAction('innerHeight', 1000);
  },

  scrollTop: () => {
    requerio.$orgs['#main'].dispatchAction('scrollTop', 100);
  },

  width: () => {
    requerio.$orgs['#main'].dispatchAction('width', 1000);
  }
};

describe('Requerio', function () {
  describe('constructor', function () {
    it('should instantiate correctly', function () {
      expect(requerio).to.be.an.instanceof(Requerio);
      expect(requerio).to.have.property('$');
      expect(requerio).to.have.property('Redux');
      expect(requerio).to.have.property('$orgs');
      expect(requerio).to.have.property('init');
      expect(requerio.$).to.equal($);
      expect(requerio.Redux).to.equal(Redux);
      expect(requerio.$orgs).to.equal($organismsAfter);
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
      function () {
        const $org = $organisms['.main__section'];

        $org.dispatchAction('css', ['display', 'none'], 1);
        const displayStyle0 = $org.getState(0).style.display;
        const displayStyle1 = $org.getState(1).style.display;

        expect(displayStyle0).to.be.undefined;
        expect(displayStyle1).to.equal('none');
      }
    );

    it('should reset members and .$members when .getState() is called', function () {
      const $org = $organisms['.main__section'];
      delete $org[0].getBoundingClientRect;
      delete $org[1].getBoundingClientRect;
      delete $org[1];
      $org.length = 1;
      $org.$members = [];
      const membersLengthBefore = $org.length;
      const $membersLengthBefore = $org.$members.length;

      $org.getState();

      const $members = $org.$members;
      const membersLengthAfter = $org.length;
      const $membersLengthAfter = $members.length;

      expect(membersLengthBefore).to.equal(1);
      expect(membersLengthAfter).to.equal(2);
      expect($membersLengthBefore).to.equal(0);
      expect($membersLengthAfter).to.equal(2);
      expect($org[0]).to.not.be.undefined;
      expect($org[1]).to.not.be.undefined;
      expect($members[0][0].attribs.class).to.equal('main__section main__section--0');
      expect($members[1][0].attribs.class).to.equal('main__section main__section--1');
    });

    it('should get the Redux store when .getStore() is called', function () {
      const $org = $organisms['#main'];

      const stateStore = $org.getStore();

      expect(stateStore).to.have.property('dispatch');
      expect(stateStore).to.have.property('subscribe');
      expect(stateStore).to.have.property('getState');
      expect(stateStore).to.have.property('replaceReducer');
    });

    it('should reset .$members when .$membersPopulate() is called', function () {
      const $org = $organisms['.main__section'];
      $org.$members = [];
      const $membersLengthBefore = $org.$members.length;

      $org.$membersPopulate();
      const $members = $org.$members;
      const $membersLengthAfter = $members.length;

      expect($membersLengthBefore).to.equal(0);
      expect($membersLengthAfter).to.equal(2);
      expect($members[0][0].attribs.class).to.equal('main__section main__section--0');
      expect($members[1][0].attribs.class).to.equal('main__section main__section--1');
    });

    it(
      'should set .boundingClientRect properties when .setBoundingClientRect() is called',
      function () {
        const $org = $organisms['#main'];
        const boundingClientRectBefore = $org.getState().boundingClientRect;

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
      function () {
        const $org = $organisms['.main__section'];
        const stateBefore0 = $org.getState(0);
        const stateBefore1 = $org.getState(1);

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

    it('should get .boundingClientRect properties when .getBoundingClientRect() is called', function () {
      const $org = $organisms['#main'];

      const boundingClientRect = $org[0].getBoundingClientRect();

      expect(boundingClientRect.width).to.equal(1000);
      expect(boundingClientRect.height).to.equal(1000);
      expect(boundingClientRect.top).to.equal(100);
      expect(boundingClientRect.right).to.equal(1100);
      expect(boundingClientRect.bottom).to.equal(1100);
      expect(boundingClientRect.left).to.equal(100);
    });
  });

  describe('reducer-get', function () {
    it('should update the state $members if the $org $members increase in number', function () {
      const $org = $organisms['.main__section'];
      const stateMembersLengthBefore = $org.getState().$members.length;
      const htmlSnippet = '<section class="main__section"><h2>Section</h2></section>';

      $org.$members.push($(htmlSnippet));
      const stateMembersLengthAfter = $org.getState().$members.length;

      expect($org.$members.length).to.equal(3);
      expect(stateMembersLengthBefore).to.equal(2);
      expect(stateMembersLengthAfter).to.equal(3);
    });

    it('should update the state $members if the $org $members decrease in number', function () {
      const $org = $organisms['.main__section'];
      const stateMembersLengthBefore = $org.getState().$members.length;

      $org.$members.pop();
      const stateMembersLengthAfter = $org.getState().$members.length;

      expect($org.$members.length).to.equal(2);
      expect(stateMembersLengthBefore).to.equal(3);
      expect(stateMembersLengthAfter).to.equal(2);
    });

    it('should dispatch the "addClass" action with a string argument', function () {
      actions.addClassString();
      const state = $organisms['#main'].getState();

      expect(state.attribs.class).to.equal('add-class-string');
    });

    it('should dispatch the "addClass" action with a function argument', function () {
      actions.addClassFunction();
      const state = $organisms['#main'].getState();

      expect(state.attribs.class).to.have.string('add-class-function');
    });

    it('should dispatch the "addClass" action in a targeted manner', function () {
      actions.addClass1();
      const state0 = $organisms['.main__section'].getState(0);
      const state1 = $organisms['.main__section'].getState(1);

      expect(state0.attribs.class).to.not.have.string('add-class-1');
      expect(state1.attribs.class).to.have.string('add-class-1');
    });

    it('should not dispatch the "addClass" action if the target is out-of-bounds', function () {
      actions.addClass2();
      const state0 = $organisms['.main__section'].getState(0);
      const state1 = $organisms['.main__section'].getState(1);

      expect(state0.attribs.class).to.not.have.string('out-of-bounds');
      expect(state1.attribs.class).to.not.have.string('out-of-bounds');
    });

    it('should dispatch the "removeClass" action with a string argument', function () {
      requerio.$orgs['#main'].dispatchAction('addClass', 'remove-class-string');
      const stateBefore = $organisms['#main'].getState();
      actions.removeClassString();
      const stateAfter = $organisms['#main'].getState();

      expect(stateBefore.attribs.class).to.have.string('remove-class-string');
      expect(stateAfter.attribs.class).to.not.have.string('remove-class-string');
    });

    it('should dispatch the "removeClass" action with a function argument', function () {
      requerio.$orgs['#main'].dispatchAction('addClass', 'remove-class-function');
      const stateBefore = $organisms['#main'].getState();
      actions.removeClassFunction();
      const stateAfter = $organisms['#main'].getState();

      expect(stateBefore.attribs.class).to.have.string('remove-class-function');
      expect(stateAfter.attribs.class).to.not.have.string('remove-class-function');
    });

    it('should dispatch the "toggleClass" action with a string argument', function () {
      const state0 = $organisms['#main'].getState();
      actions.toggleClassString();
      const state1 = $organisms['#main'].getState();
      actions.toggleClassString();
      const state2 = $organisms['#main'].getState();

      expect(state0.attribs.class).to.not.have.string('toggle-class-string');
      expect(state1.attribs.class).to.have.string('toggle-class-string');
      expect(state2.attribs.class).to.not.have.string('toggle-class-string');
    });

    it('should dispatch the "toggleClass" action with a function argument', function () {
      const state0 = $organisms['#main'].getState();
      actions.toggleClassFunction();
      const state1 = $organisms['#main'].getState();
      actions.toggleClassFunction();
      const state2 = $organisms['#main'].getState();

      expect(state0.attribs.class).to.not.have.string('toggle-class-function');
      expect(state1.attribs.class).to.have.string('toggle-class-function');
      expect(state2.attribs.class).to.not.have.string('toggle-class-function');
    });

    it('should dispatch the "toggleClass" action with a true boolean argument', function () {
      const state0 = $organisms['#main'].getState();
      actions.toggleClassTrue();
      const state1 = $organisms['#main'].getState();
      actions.toggleClassTrue();
      const state2 = $organisms['#main'].getState();

      expect(state0.attribs.class).to.not.have.string('toggle-class-true');
      expect(state1.attribs.class).to.have.string('toggle-class-true');
      expect(state2.attribs.class).to.have.string('toggle-class-true');
    });

    it('should dispatch the "toggleClass" action with a false boolean argument', function () {
      requerio.$orgs['#main'].dispatchAction('addClass', 'toggle-class-false');
      const state0 = $organisms['#main'].getState();
      actions.toggleClassFalse();
      const state1 = $organisms['#main'].getState();
      actions.toggleClassFalse();
      const state2 = $organisms['#main'].getState();

      expect(state0.attribs.class).to.have.string('toggle-class-false');
      expect(state1.attribs.class).to.not.have.string('toggle-class-false');
      expect(state2.attribs.class).to.not.have.string('toggle-class-false');
    });

    it('should dispatch the "attr" action with an array argument comprising strings', function () {
      actions.attrArrayString();
      const state = $organisms['#main'].getState();

      expect(state.attribs['data-test']).to.equal('testing12345');
    });

    it('should dispatch the "attr" action with an array argument comprising a string and a function', function () {
      actions.attrArrayFunction();
      const state = $organisms['#main'].getState();

      expect(state.attribs['data-test']).to.equal('testing67890');
    });

    it('should dispatch the "css" action with an array argument comprising strings', function () {
      actions.cssArrayString();
      const state = $organisms['#main'].getState();

      expect(state.style.color).to.equal('red');
    });

    it('should dispatch the "css" action with an array argument comprising a string and a function', function () {
      actions.cssArrayFunction();
      const state = $organisms['#main'].getState();

      expect(state.style.color).to.equal('green');
    });

    it('should dispatch the "css" action with an object argument', function () {
      actions.cssObject();
      const state = $organisms['#main'].getState();

      expect(state.style.color).to.equal('blue');
    });

    it('should dispatch the "getBoundingClientRect" action', function () {
      // On the client, getBoundingClientRect takes measurements and set the state.
      // On the server, it will normally do nothing.
      // However, since it ensures that the .boundingClientRect object is fully populated, we can test that it works by
      // first unsetting the .boundingClientRect properties and checking whether it resets them.
      const $org = $organisms['#main'];
      const stateBefore = $org.getState();
      stateBefore.boundingClientRect = {};
      const boundingClientRectBefore = stateBefore.boundingClientRect;

      actions.getBoundingClientRect();
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
      actions.setBoundingClientRect();
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
      actions.setBoundingClientRect1();
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
      actions.height();
      const state = $organisms['#main'].getState();

      expect(state.height).to.equal(1000);
    });

    it('should dispatch the "html" action with a string argument', function () {
      actions.htmlString();
      const state = $organisms['#main'].getState();

      expect(state.innerHTML).to.equal('<h2>Section 1</h2><p>Paragraph 1</p>');
    });

    it('should dispatch the "html" action with a function argument', function () {
      actions.htmlFunction();
      const state = $organisms['#main'].getState();

      expect(state.innerHTML).to.equal('<h2>Section 1</h2><p>Paragraph 1</p>');
    });

    it('should dispatch the "innerWidth" action', function () {
      actions.innerWidth();
      const state = $organisms['#main'].getState();

      expect(state.innerWidth).to.equal(1000);
    });

    it('should dispatch the "innerHeight" action', function () {
      actions.innerHeight();
      const state = $organisms['#main'].getState();

      expect(state.innerHeight).to.equal(1000);
    });

    it('should dispatch the "scrollTop" action', function () {
      actions.scrollTop();
      const state = $organisms['#main'].getState();

      expect(state.scrollTop).to.equal(100);
    });

    it('should dispatch the "width" action', function () {
      actions.width();
      const state = $organisms['#main'].getState();

      expect(state.width).to.equal(1000);
    });
  });
});
