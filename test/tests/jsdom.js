import {expect} from 'chai';

export default ($organismsBefore, Requerio, $, Redux, $organismsAfter) => {
  const requerio = new Requerio($, Redux, $organismsAfter);
  requerio.init();

  return function () {
    describe('with JSDOM', function () {
      it('dispatches the "focus" action', function () {
        requerio.$orgs['.main__input'].dispatchAction('focus');

        const state = requerio.$orgs.document.getState();

        expect(state.activeOrganism).to.equal('.main__input');
      });

      it('dispatches the "blur" action', function () {
        requerio.$orgs['.main__input'].dispatchAction('blur');

        const state = requerio.$orgs.document.getState();

        expect(state.activeOrganism).to.be.null;
      });

      it('picks up on a user-enacted focus on an id selector', function () {
        const stateBefore = requerio.$orgs.document.getState();

        document.querySelector('#yoda__input').focus();

        const stateAfter = requerio.$orgs.document.getState();

        expect(stateBefore.activeOrganism).to.not.equal(stateAfter.activeOrganism);
        // User-enacted focus cannot specifically target the organism by id if the tagname is an organism as well.
        expect(stateAfter.activeOrganism).to.equal('input');

        requerio.$orgs['input'].dispatchAction('blur');
        document.querySelector('#yoda__input').blur();
      });

      it('picks up on a user-enacted focus on a class selector', function () {
        const stateBefore = requerio.$orgs.document.getState();

        document.querySelector('.main__input').focus();

        const stateAfter = requerio.$orgs.document.getState();

        expect(stateBefore.activeOrganism).to.not.equal(stateAfter.activeOrganism);
        // User-enacted focus cannot specifically target the organism by class if the tagname is an organism as well.
        expect(stateAfter.activeOrganism).to.equal('input');
      });

      it('picks up on a user-enacted focus on a tag selector', function () {
        // Testing mainly for coverage.
        document.querySelector('input').focus();

        const stateAfter = requerio.$orgs.document.getState();

        expect(stateAfter.activeOrganism).to.equal('input');
      });

      // Cheerio.
      if ($._root && $._root.attribs) {
        it('dispatches the "getBoundingClientRect" action on the "window" organism', function () {
          const stateBefore = requerio.$orgs.window.getState();

          requerio.$orgs.window.dispatchAction('getBoundingClientRect');

          const stateAfter = requerio.$orgs.window.getState();

          expect(JSON.stringify(stateBefore)).to.equal(
            // eslint-disable-next-line max-len
            '{"data":{},"innerWidth":null,"innerHeight":null,"outerWidth":null,"outerHeight":null,"scrollLeft":null,"scrollTop":null,"width":null,"height":null}'
          );
          expect(JSON.stringify(stateAfter)).to.equal(
            // eslint-disable-next-line max-len
            '{"data":{},"innerWidth":1024,"innerHeight":768,"outerWidth":1024,"outerHeight":768,"scrollLeft":0,"scrollTop":0,"width":1024,"height":768}'
          );
        });
      }
      // jQuery.
      else {
        it('dispatches the "getBoundingClientRect" action on the "window" organism', function () {
          const stateBefore = requerio.$orgs.window.getState();

          requerio.$orgs.window.dispatchAction('getBoundingClientRect');

          const stateAfter = requerio.$orgs.window.getState();

          expect(JSON.stringify(stateBefore)).to.equal(
            // eslint-disable-next-line max-len
            '{"data":{},"innerWidth":null,"innerHeight":null,"outerWidth":null,"outerHeight":null,"scrollLeft":null,"scrollTop":null,"width":null,"height":null}'
          );
          expect(JSON.stringify(stateAfter)).to.equal(
            // eslint-disable-next-line max-len
            '{"data":{},"innerWidth":1024,"innerHeight":768,"outerWidth":1024,"outerHeight":768,"scrollLeft":0,"scrollTop":0,"width":1024,"height":768}'
          );
        });
      }

      it('dispatches the "innerWidth" action on the "window" organism', function () {
        requerio.$orgs.window.dispatchAction('innerWidth');

        const state = requerio.$orgs.window.getState();

        expect(state.innerWidth).to.equal(1024);
      });

      it('dispatches the "innerHeight" action on the "window" organism', function () {
        requerio.$orgs.window.dispatchAction('innerHeight');

        const state = requerio.$orgs.window.getState();

        expect(state.innerHeight).to.equal(768);
      });

      it('dispatches the "outerWidth" action on the "window" organism', function () {
        requerio.$orgs.window.dispatchAction('outerWidth');

        const state = requerio.$orgs.window.getState();

        expect(state.outerWidth).to.equal(1024);
      });

      it('dispatches the "outerHeight" action on the "window" organism', function () {
        requerio.$orgs.window.dispatchAction('outerHeight');

        const state = requerio.$orgs.window.getState();

        expect(state.outerHeight).to.equal(768);
      });
    });
  };
};
