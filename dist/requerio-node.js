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

    let $org;
    if (i === 'document') {
      if (typeof document === 'object') {
        $org = $(document);
      }
      else {
        $org = {};
      }
    }
    else if (i === 'window') {
      if (typeof window === 'object') {
        $org = $(window);
      }
      else {
        $org = {};
      }
    }
    else {
      $org = $(`${i}`);
    }

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
     * @param {object} $orgReset - A copy, not reference, of the updated organism.
     * To be run on organism inception and dispatch of action.
     * Must only fill $items property of $orgs at top level of the $orgs object.
     */
    $org.$itemsReset = function ($orgReset) {
      $org.$items = [];

      $orgReset.each(function () {
        const $this = $(this);

        $this.parentSelector = i;
        $org.$items.push($this);
      });
    };

    if (i !== 'window') {
      const $orgReset = $(`${i}`);

      $org.$itemsReset($orgReset);
    }

    /**
     * Set methods that server-side tests are likely to depend on.
     * These methods come with client-side jQuery, but not with server-side Cheerio.
     * Just return empty values as defaults.
     */
    if (typeof $org.scrollTop === 'undefined') {
      $org.scrollTop = () => {
        return 0;
      };
    }
    if (typeof $org.width === 'undefined') {
      $org.width = () => {
        return 0;
      };
    }
    if (typeof $org.height === 'undefined') {
      $org.height = () => {
        return 0;
      };
    }

    $orgs[i] = $org;
  }
};

/**
 * Override $.prototype with custom methods for dealing with state.
 *
 * @param {object} stateStore
 */
var prototypeOverride = ($orgs, stateStore) => {

  if (!$.prototype.hasRequerio) {
    $.prototype.hasRequerio = true;
  }

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

      if (typeof itemIdx !== 'undefined' && typeof this[itemIdx] === 'undefined') {
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

      // Submission of itemIdx indicates that the action is to be dispatched on the specific item of the CSS class.
      let $item;
      if (typeof itemIdx !== 'undefined') {
        $item = $(this[itemIdx]);
      }

      // On the client, side-effects must happen here. stateStore.dispatch() depends on this.
      if (
        typeof itemIdx === 'undefined' && typeof this[method] === 'function' ||
        typeof itemIdx !== 'undefined' && $item.length && typeof $item[method] === 'function'
      ) {

        function applyMethod($org, method, args, itemIdx, $item) {
          if (typeof $item === 'undefined') {
            // Apply to $org.
            $org[method].apply($org, args);
          }
          else {
            // Apply to $item.
            $item[method].apply($item, args);
          }
        }

        switch (method) {

          // Make addClass more convenient by checking if the class already exists.
          case 'addClass':
            if (!this.hasClass(args[0])) {
              applyMethod(this, method, args, itemIdx, $item);
            }
            break;

          // Need to reset $org and $org.$items on removeClass.
          case 'removeClass':
            applyMethod(this, method, args, itemIdx, $item);

            const $orgReset = $(this.selector);

            for (let i in $orgReset) {
              if (!$orgReset.hasOwnProperty(i)) {
                continue;
              }

              this[i] = $orgReset[i];
            }

            this.$itemsReset($orgReset);
            break;

          // scrollTop, width, and height methods with no args take measurements and update state.
          case 'scrollTop':
          case 'width':
          case 'height':
            if (args.length) {
              applyMethod(this, method, args, itemIdx, $item);
            }
            else {
              if (typeof $item === 'undefined') {
                // Apply to $org.
                args[0] = this[method].apply(this);
              }
              else {
                // Apply to $item.
                args[0] = $item[method].apply($item);
              }
            }
            break;

          // Method applications for other methods.
          default:
            applyMethod(this, method, args, itemIdx, $item);
        }
      }

      const stateNew = stateStore.dispatch({
        type: '',
        selector: this.selector,
        $org: this,
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
    $.prototype.getState = function (itemIdx) {

      // In order to return the latest, most accurate state, dispatch these actions to update their properties.
      // Do not preemptively update .innerHTML property because we don't want to bloat the app with too much data.
      // Do not preemptively update .style property because we only want to keep track of styles dispatched through js.

      // case state.scrollTop:
      this.dispatchAction('scrollTop', [], itemIdx);

      // case state.width:
      this.dispatchAction('width', [], itemIdx);

      // case state.height:
      this.dispatchAction('height', [], itemIdx);

      // case state.attribs:
      // Cheerio.
      if (this[0].attribs) {
        if (typeof itemIdx === 'undefined') {
          this.dispatchAction('attr', this[0].attribs);
        }
        else {
          this.dispatchAction('attr', this[itemIdx].attribs, itemIdx);
        }
      }

      // case state.attribs:
      // jQuery.
      else if (this[0].attributes && this[0].attributes.length) {
        const attribs = {};

        if (typeof itemIdx === 'undefined') {
          for (let i = 0; i < this[0].attributes.length; i++) {
            const attr = this[0].attributes[i];

            attribs[attr.name] = attr.value;
          }

          this.dispatchAction('attr', attribs);
        }

        else {
          for (let i = 0; i < this[itemIdx].attributes.length; i++) {
            const attr = this[itemIdx].attributes[i];

            attribs[attr.name] = attr.value;
          }

          this.dispatchAction('attr', attribs, itemIdx);
        }
      }

      if (typeof itemIdx === 'undefined') {
        return stateStore.getState()[this.selector];
      }
      else {
        return stateStore.getState()[this.selector].$items[itemIdx];
      }
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
     * @property {null|number} width - width in number of pixels.
     * @property {null|number} height - height in number of pixels.
     * @property {array} $items - jQuery/Cheerio object members belonging to selection.
     */
    const stateDefault = {
      attribs: {},
      innerHTML: null,
      scrollTop: null,
      style: {},
      width: null,
      height: null,
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
          classesToAdd = classParam.split(/s+/);
        }
        else if (typeof classParam === 'function') {
          const retval = classParam();

          if (typeof retval === 'string') {
            classesToAdd = retval.split(/s+/);
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
          classesToRemove = classParam.split(/s+/);
        }
        else if (typeof classParam === 'function') {
          const retval = classParam();

          if (typeof retval === 'string') {
            classesToRemove = retval.split(/s+/);
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
        if (state.attribs && state.attribs.class) {
          classesForReducedState = state.attribs.class.split(/s+/);
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
              classesToToggle = action.args[0].split(/s+/);
            }
            else if (typeof action.args[0] === 'function') {
              const retval = actions.args[0]();

              if (typeof retval === 'string') {
                classesToToggle = retval.split(/s+/);
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

          case 'attr':
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

          case 'height':
            if (action.args.length === 1) {
              if (typeof action.args[0] === 'number') {
                state.height = action.args[0];
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

          case 'scrollTop':
            if (action.args.length === 1) {
              if (typeof action.args[0] === 'number') {
                state.scrollTop = action.args[0];
              }
            }
            break;

          case 'width':
            if (action.args.length === 1) {
              if (typeof action.args[0] === 'number') {
                state.width = action.args[0];
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
        state = JSON.parse(JSON.stringify(stateDefault));
      }

      // Populate or update $items array.
      if (action.method === 'removeClass') {
        try {
          // Update $items array with clones of stateDefault.
          state.$items = [];
          $org.$items.forEach(($item, idx) => {
            state.$items[idx] = JSON.parse(JSON.stringify(stateDefault));
          });

        } catch (err) {
          console.error(err); // eslint-disable-line no-console
        }
      }
      else {
        try {
          // Populate $items array with clones of stateDefault if necessary.
          $org.$items.forEach(($item, idx) => {
            if (!state.$items[idx]) {
              state.$items[idx] = JSON.parse(JSON.stringify(stateDefault));
            }
          });
        } catch (err) {
          console.error(err); // eslint-disable-line no-console
        }
      }

      // Preinitialize.
      if (state.attribs) {
        state.attribs.class = $org.attr('class');
      }

      // Build new state for organism.
      stateBuild($org, state);

      // Build new state for selection in $items array.
      if (
        typeof action.itemIdx !== 'undefined' &&
        typeof $org.$items[action.itemIdx] !== 'undefined' &&
        typeof state.$items[action.itemIdx] !== 'undefined'
      ) {
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
