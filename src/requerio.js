import organismsIncept from './organisms-incept.js';
import prototypeOverride from './prototype-override.js';
import reducerGet from './reducer-get.js';

class Requerio {
  constructor($, Redux, $organisms, customReducer, customMiddleware) {
    this.$ = $;
    this.Redux = Redux;
    this.$orgs = $organisms;
    this.customReducer = customReducer;
    this.customMiddleware = customMiddleware;
  }

  init() {
    const {applyMiddleware, createStore} = this.Redux;
    const reducer = reducerGet(this.$orgs, this.Redux, this.customReducer);
    let enhancer;

    if (typeof this.customMiddleware === 'function') {
      enhancer = applyMiddleware(this.customMiddleware);
    }

    const store = createStore(reducer, enhancer);

    prototypeOverride(this.$, store);
    organismsIncept(this.$orgs, this.$);
  }
}

if (typeof define === 'function') {
  define(function () {
    return Requerio;
  });
}
else if (typeof window === 'object') {
  window.Requerio = Requerio;
}

export default Requerio;
