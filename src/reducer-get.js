/**
 * Closure to generate reducers specific to organisms.
 *
 * @param {string} orgSelector - The organism's selector.
 * @return {function} A function configured to work on the orgSelector.
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
     * @property {object} attribs - Equivalent to the attribs property of a Cheerio object. This consists of simple
     *   key-value pairs, and as such, is preferable to use for storing state than a replica of the much more complex
     *   Element.attributes collection, as utilized by jQuery. The attribs property is not documented in the Cheerio
     *   documentation, and may change without notice. However, this is unlikely, since it is derived from its
     *   htmlparser2 dependency. The htmlparser2 package has had this property since its initial release.
     * @property {object} boundingClientRect - Key-value copy of object returned by Element.getBoundingClientRect().
     * @property {null|string} innerHTML - To DOM Element.innerHTML spec. null means the initial innerHTML state wasn't
     *   modified. null has a completely different meaning than empty string.
     * @property {null|number} scrollTop - Number of pixels scrolled.
     * @property {object} style - To DOM Element.style spec.
     * @property {null|number} width - Width in number of pixels.
     * @property {null|number} height - Height in number of pixels.
     * @property {array} $items - jQuery/Cheerio object members belonging to selection.
     */
    const stateDefault = {
      attribs: {},
      boundingClientRect: {
        bottom: null,
        height: null,
        left: null,
        right: null,
        top: null,
        width: null
      },
      innerHTML: null,
      innerWidth: null,
      innerHeight: null,
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
       * @param {array} classesForReducedState - Array of classes.
       * @param {string} classParam - Class to add to classesForReducedState.
       * @return {undefined} This function mutates the new state object.
       */
      function addClass(classesForReducedState, classParam) {
        let classesToAdd;

        if (typeof classParam === 'string') {
          classesToAdd = classParam.split(/\s+/);
        }
        else if (typeof classParam === 'function') {
          const retval = classParam();

          if (typeof retval === 'string') {
            classesToAdd = retval.split(/\s+/);
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
       * @param {array} classesForReducedState - Array of classes.
       * @param {string} classParam - Class to remove from classesForReducedState.
       * @param {number} classIdx_ - Index of class to be removed.
       * @return {undefined} This function mutates the new state object.
       */
      function removeClass(classesForReducedState, classParam, classIdx_) {
        let classesToRemove;

        if (typeof classParam === 'string') {
          classesToRemove = classParam.split(/\s+/);
        }
        else if (typeof classParam === 'function') {
          const retval = classParam();

          if (typeof retval === 'string') {
            classesToRemove = retval.split(/\s+/);
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
        // Cheerio.
        if ($org[0].attribs) {
          state.attribs = JSON.parse(JSON.stringify($org[0].attribs));
        }

        // jQuery.
        else if ($org[0].attributes && $org[0].attributes.length) {
          for (let i = 0; i < $org[0].attributes.length; i++) {
            const attr = $org[0].attributes[i];

            state.attribs[attr.name] = attr.value;
          }
        }

        let classesForReducedState = [];
        if (state.attribs && state.attribs.class) {
          classesForReducedState = state.attribs.class.split(/\s+/);
        }

        switch (action.method) {
          case 'addClass': {
            if (action.args.length === 1) {
              addClass(classesForReducedState, action.args[0]);
            }

            break;
          }

          case 'removeClass': {
            if (action.args.length === 1) {
              removeClass(classesForReducedState, action.args[0]);
            }

            break;
          }

          case 'toggleClass': {
            let classesToToggle;

            if (typeof action.args[0] === 'string') {
              classesToToggle = action.args[0].split(/\s+/);
            }
            else if (typeof action.args[0] === 'function') {
              const retval = action.args[0]();

              if (typeof retval === 'string') {
                classesToToggle = retval.split(/\s+/);
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
          }

          case 'attr': {
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
          }

          case 'css': {
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
          }

          case 'getBoundingClientRect': {
            if (action.args.length === 1) {
              if (action.args[0] instanceof Object) {
                // Must copy, not reference, but can't use JSON.parse(JSON.stringify()) in FF and Edge because in those
                // browsers, DOMRect properties are inherited, not "own" properties (as in hasOwnProperty).
                const rectObj = action.args[0];

                for (let i in rectObj) {
                  if (typeof rectObj[i] === 'number') {
                    state.boundingClientRect[i] = rectObj[i];
                  }
                }
              }
            }

            break;
          }

          case 'height': {
            if (action.args.length === 1) {
              if (typeof action.args[0] === 'number') {
                state.height = action.args[0];

                if (typeof global === 'object') {
                  state.boundingClientRect.height = action.args[0];
                }
              }
            }

            break;
          }

          case 'html': {
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
          }

          case 'innerWidth': {
            if (action.args.length === 1) {
              if (typeof action.args[0] === 'number') {
                state.innerWidth = action.args[0];
              }
            }

            break;
          }

          case 'innerHeight': {
            if (action.args.length === 1) {
              if (typeof action.args[0] === 'number') {
                state.innerHeight = action.args[0];
              }
            }

            break;
          }

          case 'scrollTop': {
            if (action.args.length === 1) {
              if (typeof action.args[0] === 'number') {
                state.scrollTop = action.args[0];
              }
            }

            break;
          }

          case 'width': {
            if (action.args.length === 1) {
              if (typeof action.args[0] === 'number') {
                state.width = action.args[0];

                if (typeof global === 'object') {
                  state.boundingClientRect.width = action.args[0];
                }
              }
            }

            break;
          }
        }
      }
      catch (err) {
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

      }
      catch (err) {
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

        }
        catch (err) {
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
        }
        catch (err) {
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
 * @param {object} $orgs - Organisms keyed by selector.
 * @param {object} Redux - Redux object.
 * @return {object} Combined reducers
 */
export default ($orgs, Redux) => {
  const reducers = {};

  for (let i in $orgs) {
    if (!$orgs.hasOwnProperty(i)) {
      continue;
    }

    reducers[i] = reducerClosure(i);
  }

  return Redux.combineReducers(reducers);
};
