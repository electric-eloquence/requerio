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

      // In order to return latest, most accurate state, dispatch these actions to update their properties.
      // Do not preemptively update .innerHTML property because we don't want to bloat the app with too much data.
      // Do not preemptively update .style property because we only want to keep track of styles dispatched through js.

      // case state.scrollTop:
      this.dispatchAction('scrollTop', []);

      // case state.width:
      this.dispatchAction('width', []);

      // case state.height:
      this.dispatchAction('height', []);

      // Cheerio.
      if (this[0].attribs) {

        // case state.attribs:
        if (this[0].attribs) {
          this.dispatchAction('attr', this[0].attribs);
        }
      }

      // jQuery.
      else if (this[0].attributes && this[0].attributes.length) {
        const attribs = {};

        // case state.attribs:
        if (this[0].attributes) {
          for (let i = 0; i < this[0].attributes.length; i++) {
            const attr = this[0].attributes[i];

            attribs[attr.name] = attr.value;
          }

          this.dispatchAction('attr', attribs);
        }
      }

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
