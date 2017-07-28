'use strict';

import organismsIncept from './organisms-incept.js';
import prototypeOverride from './prototype-override.js';
import reducerGet from './reducer-get.js';

class Requerio {
  constructor($, Redux, $organisms, actions) {
    this.$ = $;
    this.Redux = Redux;
    this.$orgs = $organisms;
    this.actions = actions;

    if (typeof window === 'object') {
      this.$window = $(window);
    }
    else if (typeof global === 'object') {
      // Properties to server-side $window to be assigned in testing suite.
      this.$window = global.$window = {};
    }

    this.actions = actionsGet(this);
  }

  get $orgs() {
    return this.$orgs;
  }

  init() {
    const reducer = reducerGet(this.$orgs);
    const store = Redux.createStore(reducer);

    prototypeOverride(store);
    organismsIncept(this.$orgs);
  }
}

export default Requerio;
