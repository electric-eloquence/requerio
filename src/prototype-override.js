'use strict';

/**
 * Override $.prototype with custom methods for dealing with state.
 *
 * @param {object} stateStore
 */
export default ($orgs, stateStore) => {

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
        args_ instanceof Object
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
        typeof itemIdx === 'undefined' &&
          (typeof this[method] === 'function' || typeof this[0][method] === 'function') ||
        typeof itemIdx !== 'undefined' && $item.length &&
          (typeof $item[method] === 'function' || typeof this[itemIdx][method] === 'function')
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

          // attr method with no arg retrieves data and updates state.
          case 'attr':
            if (args.length) {
              applyMethod(this, method, args, itemIdx, $item);
            }
            else {
              // Cheerio objects have an .attribs property for member element attributes, which is undocumented and may
              // change without notice. However, this is unlikely, since it is derived from its htmlparser2 dependency.
              // The htmlparser2 package has had this property since its initial release.
              if (this[0].attribs) {
                if (typeof itemIdx === 'undefined') {
                  args[0] = this[0].attribs;
                }
                else {
                  args[0] = this[itemIdx].attribs;
                }
              }

              // jQuery saves and keys selected DOM Element objects in an array-like manner on the jQuery object.
              // The .attributes property of each Element object are per the DOM spec.
              // We need to parse the .attributes property to create a key-value store, which we'll submit as args[0].
              else if (this[0].attributes && this[0].attributes.length) {
                const attribs = {};

                if (typeof itemIdx === 'undefined') {
                  for (let i = 0; i < this[0].attributes.length; i++) {
                    const attr = this[0].attributes[i];

                    attribs[attr.name] = attr.value;
                  }

                  args[0] = attribs;
                }

                else {
                  for (let i = 0; i < this[itemIdx].attributes.length; i++) {
                    const attr = this[itemIdx].attributes[i];

                    attribs[attr.name] = attr.value;
                  }

                  args[0] = attribs;
                }
              }
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

          // getBoundingClientRect takes measurements and updates state. This never accepts an argument.
          // Also has to operate on the DOM Element member of the jQuery object (or its Cheerio facsimile).
          case 'getBoundingClientRect':
            if (this.selector === 'document' || this.selector === 'window') {
              break;
            }

            if (typeof $item === 'undefined') {
              // Apply to $org.
              args[0] = this[0][method].apply(this[0]);
            }
            else {
              // Apply to $item.
              args[0] = this[itemIdx][method].apply(this[itemIdx]);
            }
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

      // case state.attribs:
      this.dispatchAction('attr', [], itemIdx);

      // case state.getBoundingClientRect:
      this.dispatchAction('getBoundingClientRect', [], itemIdx);

      // case state.scrollTop:
      this.dispatchAction('scrollTop', [], itemIdx);

      // case state.width:
      this.dispatchAction('width', [], itemIdx);

      // case state.height:
      this.dispatchAction('height', [], itemIdx);

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
