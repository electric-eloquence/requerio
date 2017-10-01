import organismsIncept from './organisms-incept.js';
import prototypeOverride from './prototype-override.js';
import reducerGet from './reducer-get.js';

class Requerio {
  constructor($, Redux, $organisms, actionsGet) {
    this.$ = $;
    this.Redux = Redux;
    this.$orgs = $organisms;
    this.actions = actionsGet(this);
  }

  init() {
    const reducer = reducerGet(this.$orgs, this.Redux);
    const store = this.Redux.createStore(reducer);

    prototypeOverride(this.$, store);
    organismsIncept(this.$orgs, this.$);
  }
}

export default Requerio;
