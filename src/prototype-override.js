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

        // Make addClass more convenient by checking if the class already exists.
        if (method === 'addClass') {
          if (!this.hasClass(args[0])) {
            if (typeof itemIdx === 'undefined') {
              // Apply to $org.
              this[method].apply(this, args);
            }
            else {
              // Apply to $item.
              $item[method].apply($item, args);
            }
          }
        }

        // Method applications for other methods.
        else {
          if (typeof itemIdx === 'undefined') {
            // Apply to $org.
            this[method].apply(this, args);
          }
          else {
            // Apply to $item.
            $item[method].apply($item, args);
          }
        }

        // After application, reset object properties to new values.
        const $orgReset = $(this.selector);

        for (let i in $orgReset) {
          if (!$orgReset.hasOwnProperty(i)) {
            continue;
          }

          this[i] = $orgReset[i];
        }

        this.$itemsReset($orgReset);
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
