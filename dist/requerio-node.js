'use strict';

/**
 * Populate $orgs values with jQuery or Cheerio objects.
 *
 * @param {object} $orgs
 */
var organismsIncept = $orgs => {

  for (let i in $orgs) {
    if (!$orgs.hasOwnProperty(i)) {
      continue;
    }

    const $org = $(`${i}`);

    // Cheerio doesn't have .selector property.
    // .selector property removed in jQuery 3.
    if (typeof $org.selector === 'undefined') {
      $org.selector = i;
    }

    /**
     * @property {array} $items
     * A true Array of the selection's numerically-keyed properties.
     * This is necessary for selection by class and tag, where results number more than one.
     * Members of this array will be fully-incepted organisms.
     */
    $org.$items = [];

    /**
     * @property {function} $itemsReset - Empty and fill $org.$items array with organisms selected by jQuery/Cheerio.
     * To be run on organism inception and dispatch of action.
     * Must only fill $items property of $orgs at top level of the $orgs object.
     */
    $org.$itemsReset = function () {
      const $orgReset = $(`${i}`);

      $org.$items = [];

      $orgReset.each(function () {
        const $this = $(this);

        $this.$parentSelector = i;
        $org.$items.push($this);
      });
    };

    $org.$itemsReset();
    $orgs[i] = $org;
  }
};

/**
 * Override $.prototype with custom methods for dealing with state.
 *
 * @param {object} stateStore
 */
var prototypeOverride = ($orgs, stateStore) => {

  /**
   * A shorthand for dispatching state actions.
   *   1. Apply the jQuery or Cheerio method.
   *   2. Apply any additional changes.
   *   3. Call the Redux store.dispatch() method.
   *
   * @param {string} method - The name of the method native to the component's object prototype.
   * @param {*} args_ - This param contains the values to be passed within the args array to this[method].apply()
   *   If args_ is not an array, we want to preemptively limit the allowed types to string, number, and object.
   *   If it is one of these types, it will get wrapped in an array and submitted.
   * @return {object} The new application state.
   */
  if (!$.prototype.dispatchAction) {
    $.prototype.dispatchAction = function (method, args_, itemIdx) {

      if (typeof itemIdx !== 'undefined' && !this.$items[itemIdx]) {
        return;
      }

      let args = [];

      if (Array.isArray(args_)) {
        args = args_;
      }
      else if (
        typeof args_ === 'string' ||
        typeof args_ === 'number' ||
        args_ instanceof Object && args_.constructor === Object
      ) {
        args = [args_];
      }

      // Reset $items before proceeding.
      this.$itemsReset();

      // Submission of itemIdx indicates that the action is to be dispatched on the specific item of the CSS class.
      let item;
      if (typeof itemIdx !== 'undefined') {
        item = this.$items[itemIdx];
      }

      // On the client, side-effects must happen here. stateStore.dispatch() depends on this.
      if (
        typeof itemIdx === 'undefined' && typeof this[method] === 'function' ||
        typeof itemIdx !== 'undefined' && typeof item[method] === 'function'
      ) {

        // Make addClass more convenient by checking if the class already exists.
        if (method === 'addClass') {
          if (!this.hasClass(args[0])) {
            if (typeof itemIdx === 'undefined') {
              this[method].apply(this, args);
            }
            else {
              item[method].apply(item, args);
            }
          }
        }
        else {
          if (typeof itemIdx === 'undefined') {
            this[method].apply(this, args);
          }
          else {
            item[method].apply(item, args);
          }
        }
      }

      const stateNew = stateStore.dispatch({
        type: '',
        selector: this.selector,
        $org: this,
        $items: this.$items,
        itemIdx: itemIdx,
        method: method,
        args: args
      });

      return stateNew;
    };
  }

  /**
   * A reference to Redux store.getState().
   *
   * @return {object} The component's state.
   */
  if (!$.prototype.getState) {
    $.prototype.getState = function () {
      return stateStore.getState()[this.selector];
    };
  }

  /**
   * A reference to Redux store.
   *
   * @return {object} This app's state store.
   */
  if (!$.prototype.getStore) {
    $.prototype.getStore = function () {
      return stateStore;
    };
  }
};

/**
 * Closure to generate reducers specific to organisms.
 *
 * @param {string} orgSelector
 * @return
 */
function reducerClosure(orgSelector) {

  /**
   * Clone an old state, update the clone based on an action, and return the clone.
   *
   * @param {object} state_ - Old state.
   * @param {object} action - An object with properties defining an action.
   * @return {object} New state.
   */
  return function (state_, action) {

    /**
     * A contract for future states. Initial state contains empty values. Do not to let states bloat for no reason (as 
     *   it could with large innerHTML).
     *
     * @property {object} attribs - equivalent to the attribs property of a Cheerio object. This consists of simple
     *   key-value pairs, and as such, is preferable to use for storing state than a replica of the much more complex
     *   Element.attributes collection, as utilized by jQuery. The attribs property is not documented in the Cheerio
     *   documentation, and may change without notice. However, this is unlikely, since it is derived from its
     *   htmlparser2 dependency. The htmlparser2 package has had this property since its initial release.
     * @property {null|string} innerHTML - to DOM Element.innerHTML spec. null means the initial innerHTML state wasn't
     *   modified. null has a completely different meaning than empty string.
     * @property {null|number} scrollTop - number of pixels scrolled.
     * @property {object} style - to DOM Element.style spec.
     */
    const stateDefault = {
      attribs: {},
      innerHTML: null,
      scrollTop: null,
      style: {},
      $items: []
    };

    /**
     * This builds state objects for organisms and their member items.
     *
     * @param {object} $org - Organism.
     * @param {object} state - Preinitialized state.
     * @return {undefined} This function mutates the state param.
     */
    function stateBuild($org, state) {

      /**
       * Helper function to add class to state.
       *
       * @param {array} classesForReducedState
       * @param {string} classParam
       * @return {undefined} This function mutates the new state object.
       */
      function addClass(classesForReducedState, classParam) {
        let classesToAdd;

        if (typeof classParam === 'string') {
          classesToAdd = classParam.split(' ');
        }
        else if (typeof classParam === 'function') {
          const retval = classParam();

          if (typeof retval === 'string') {
            classesToAdd = retval.split(' ');
          }
        }

        classesToAdd.forEach(classToAdd => {
          if (classesForReducedState.indexOf(classToAdd) === -1) {
            state.attribs.class += ` ${classToAdd}`;
          }
        });
      }

      /**
       * Helper function to remove class from state.
       *
       * @param {array} classesForReducedState
       * @param {string} classParam
       * @param {number} classIdx
       * @return {undefined} This function mutates the new state object.
       */
      function removeClass(classesForReducedState, classParam, classIdx_) {
        let classesToRemove;

        if (typeof classParam === 'string') {
          classesToRemove = classParam.split(' ');
        }
        else if (typeof classParam === 'function') {
          const retval = classParam();

          if (typeof retval === 'string') {
            classesToRemove = retval.split(' ');
          }
        }

        classesToRemove.forEach(classToRemove => {
          const classIdx = classIdx_ || classesForReducedState.indexOf(classToRemove);

          if (classIdx > -1) {
            classesForReducedState.splice(classIdx, 1);
          }
        });

        state.attribs.class = classesForReducedState.join(' ');
      }

      // ///////////////////////////////////////////////////////////////////////
      // END FUNCTION DECLARATIONS WITHIN THIS FUNCTION.
      // BEGIN MAIN EXECUTION.
      // ///////////////////////////////////////////////////////////////////////

      try {
        // The attributes property of jQuery objects is based off of the DOM's Element.attributes collection.
        const domElAttr = $org[0].attributes;
        // jQuery.
        if (domElAttr) {
          for (let i = 0; i < domElAttr.length; i++) {
            state.attribs[domElAttr[i].name] = domElAttr[i].value;
          }

        // Cheerio.
        } else {
          state.attribs = $org[0].attribs;
        }

        let classesForReducedState = [];
        if (state.attribs.class) {
          classesForReducedState = state.attribs.class.split(' ');
        }

        switch (action.method) {

          case 'addClass':
            if (action.args.length === 1) {
              addClass(classesForReducedState, action.args[0]);
            }
            break;

          case 'removeClass':
            if (action.args.length === 1) {
              removeClass(classesForReducedState, action.args[0]);
            }
            break;

          case 'toggleClass':
            let classesToToggle;

            if (typeof action.args[0] === 'string') {
              classesToToggle = action.args[0].split(' ');
            }
            else if (typeof action.args[0] === 'function') {
              const retval = actions.args[0]();

              if (typeof retval === 'string') {
                classesToToggle = retval.split(' ');
              }
            }

            classesToToggle.forEach(classToToggle => {

              if (action.args.length === 1) {
                const classIdx = classesForReducedState.indexOf(classToToggle);

                if (classIdx === -1) {
                  addClass(classesForReducedState, classToToggle);
                }
                else {
                  removeClass(classesForReducedState, classToToggle, classIdx);
                }
              }

              else if (action.args.length === 2) {
                if (action.args[1]) {
                  addClass(classesForReducedState, classToToggle);
                }
                else {
                  const classIdx = classesForReducedState.indexOf(classToToggle);

                  removeClass(classesForReducedState, classToToggle, classIdx);
                }
              }
            });

            break;

          case 'css':
            if (action.args.length === 2) {
              if (typeof action.args[0] === 'string') {
                if (typeof action.args[1] === 'string') {
                  state.style[action.args[0]] = action.args[1];
                }
                else if (typeof action.args[1] === 'function') {
                  const retval = action.args[1]();

                  if (typeof retval === 'string') {
                    state.style[action.args[0]] = retval;
                  }
                }
              }
            }
            else if (
              action.args.length === 1 &&
              action.args[0] instanceof Object &&
              action.args[0].constructor === Object
            ) {
              for (let i in action.args[0]) {
                if (!action.args[0].hasOwnProperty(i)) {
                  continue;
                }
                state.style[i] = action.args[0][i];
              }
            }
            break;

          case 'html':
            if (action.args.length === 1) {
              if (typeof action.args[0] === 'string') {
                state.innerHTML = action.args[0];
              }
              else if (typeof action.args[0] === 'function') {
                const retval = action.args[0]();

                if (typeof retval === 'string') {
                  state.style[action.args[0]] = retval;
                }
              }
            }
            break;

          case 'prop':
            if (action.args.length === 2) {
              if (typeof action.args[0] === 'string') {
                if (typeof action.args[1] === 'string') {
                  state.attribs[action.args[0]] = action.args[1];
                }
                else if (typeof action.args[1] === 'function') {
                  const retval = action.args[1]();

                  if (typeof retval === 'string') {
                    state.attribs[action.args[0]] = retval;
                  }
                }
              }
            }
            else if (
              action.args.length === 1 &&
              action.args[0] instanceof Object &&
              action.args[0].constructor === Object
            ) {
              for (let i in action.args[0]) {
                if (!action.args[0].hasOwnProperty(i)) {
                  continue;
                }
                state.attribs[i] = action.args[0][i];
              }
            }
            break;

          case 'scrollTop':
            if (action.args.length === 1) {
              if (typeof action.args[0] === 'number') {
                state.scrollTop = action.args[0];
              }
            }
            break;
        }

      } catch (err) {
        console.error(err); // eslint-disable-line no-console
        throw err;
      }
    }

    // /////////////////////////////////////////////////////////////////////////
    // END VAR AND FUNCTION DECLARATIONS FOR THIS CLOSURE.
    // BEGIN MAIN EXECUTION.
    // /////////////////////////////////////////////////////////////////////////

    // If this is the reducer for the selected organism, reduce and return a new state.
    if (action.selector === orgSelector) {

      let state;
      const $org = action.$org;

      try {
        // Clone old state into new state.
        state = JSON.parse(JSON.stringify(state_));
      } catch (err) {
        // Clone default state into new state if state_ param is undefined.
        state = JSON.parse(stateDefault);
      }

      // Preset state.attribs.
      state.attribs.class = $org.attr('class');

      // Build new state for organism.
      stateBuild($org, state);

      // Populate $items array with clones of stateDefault.
      action.$items.forEach($item => {
        state.$items.push(JSON.parse(JSON.stringify(stateDefault)));
      });

      // Build new state for selected item in $items array.
      if (typeof action.itemIdx !== 'undefined') {
        stateBuild($org.$items[action.itemIdx], state.$items[action.itemIdx]);
      }

      return state;
    }

    // If this is not the reducer for the selected organism, return the unmutated state if submitted as a defined param.
    // Else return the default state.
    else {
      if (state_) {
        return state_;
      }
      else {
        return stateDefault;
      }
    }
  };
}

/**
 * Combine organism-specific reducers for consumption by whole app.
 *
 * @param {object} $orgs
 * @return {object} combined reducers
 */
var reducerGet = $orgs => {
  const reducers = {};

  for (let i in $orgs) {
    if (!$orgs.hasOwnProperty(i)) {
      continue;
    }

    reducers[i] = reducerClosure(i);
  }

  return Redux.combineReducers(reducers);
};

class Requerio {
  constructor($, Redux, $organisms, actionsGet) {
    this.$ = $;
    this.Redux = Redux;
    this.$orgs = $organisms;

    if (typeof window === 'object') {
      this.$window = $(window);
    }
    else if (typeof global === 'object') {
      // Properties to server-side $window to be assigned in testing suite.
      this.$window = global.$window = {};
    }

    this.actions = actionsGet(this);
  }

  init() {
    const reducer = reducerGet(this.$orgs);
    const store = Redux.createStore(reducer);

    prototypeOverride(this.$orgs, store);
    organismsIncept(this.$orgs);
  }
}

module.exports = Requerio;
