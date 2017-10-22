'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/**
 * Populate $orgs values with jQuery or Cheerio objects.
 *
 * @param {object} $orgs - Organisms keyed by selector.
 * @param {object} $ - jQuery object.
 */
var organismsIncept = (function ($orgs, $) {
  var _loop = function _loop(i) {
    if (!$orgs.hasOwnProperty(i)) {
      return 'continue';
    }

    var $org = void 0;

    if (i === 'document') {
      if ((typeof document === 'undefined' ? 'undefined' : _typeof(document)) === 'object') {
        $org = $(document);
      } else {
        $org = {};
      }
    } else if (i === 'window') {
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
        $org = $(window);
      } else {
        $org = {};
      }
    } else {
      $org = $('' + i);
    }

    // Cheerio doesn't have .selector property.
    // .selector property removed in jQuery 3.
    // Needs to get set here and not in the prototype override because $org.$itemsPopulate() depends on it and there
    // doesn't seem to be an easy way to determine it from within the prototype.
    if (typeof $org.selector === 'undefined') {
      $org.selector = i;
    }

    if (i !== 'document' && i !== 'window') {
      $org.$itemsPopulate($org);
    }

    // /////////////////////////////////////////////////////////////////////////
    // Set methods that server-side tests are likely to depend on.
    // They need to be defined here and not in the prototype override because
    // `document` and `window` organisms are not Cheerio objects.
    //
    // Just return empty values as defaults.
    // /////////////////////////////////////////////////////////////////////////

    /**
     * @param {number} [num] - Distance.
     * @return {number} Measurement.
     */
    if (typeof $org.scrollTop === 'undefined') {
      $org.scrollTop = function (num) {
        if (typeof num !== 'undefined') {
          $org._scrollTop = num;
        }

        return $org._scrollTop;
      };
    }

    /**
     * @return {number} Measurement.
     */
    if (typeof $org.width === 'undefined') {
      $org.width = function () {
        return 0;
      };
    }

    /**
     * @return {number} Measurement.
     */
    if (typeof $org.height === 'undefined') {
      $org.height = function () {
        return 0;
      };
    }

    // /////////////////////////////////////////////////////////////////////////
    // Attach the organism to the object of organisms and finish.
    // /////////////////////////////////////////////////////////////////////////

    $orgs[i] = $org;
  };

  for (var i in $orgs) {
    var _ret = _loop(i);

    if (_ret === 'continue') continue;
  }
});

/**
 * Apply the jQuery or Cheerio method on the organism.
 *
 * @param {object} $org - Organism object.
 * @param {string} method - Name of the method to be applied.
 * @param {array} args - Arguments array, (not array-like object).
 * @param {number} [itemIdx] - Index of child item if targeting a child.
 * @param {object} [$item] - Child item if targeting a child.
 */
function applyMethod($org, method, args, itemIdx, $item) {
  if (typeof $item === 'undefined') {
    // Apply to $org.
    $org[method].apply($org, args);
  } else {
    // Apply to $item.
    $item[method].apply($item, args);
  }
}

/**
 * Create a stand-in for Element.getBoundingClientRect for the server.
 * Need this closure to return a function with $org and itemIdx baked in.
 *
 * @param {object} $org - Organism object.
 * @param {number|undefined} itemIdx_ - If targeting an organism item, its index.
 * @return {function} The returned function returns an object with properties correspond to the properties of DOMRect.
 */
function getBoundingClientRectClosure($org, itemIdx_) {
  return function () {
    var itemIdx = void 0;

    if (itemIdx_) {
      itemIdx = itemIdx_;
    } else {
      itemIdx = 0;
    }

    var rectState = $org.getStore().getState()[$org.selector].$items[itemIdx].boundingClientRect;

    for (var i in rectState) {
      if (!rectState.hasOwnProperty(i)) {
        continue;
      }

      if (rectState[i] !== null) {
        return rectState;
      }
    }

    return {
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0
    };
  };
}

/**
 * Resets the organism's items as they are added or removed.
 * Executes the .$itemsReset() method attached to the prototype. The reason for this private function is that outside
 * this file's scope, we don't want to query for the result of the entire selector, only its items.
 *
 * @param {object} prototype - The `this` reference from the jQuery/Cheerio prototype.
 */
function $itemsReset(prototype) {
  if (prototype.selector === 'document' || prototype.selector === 'window') {
    return;
  }

  var $orgToReset = $(prototype.selector);

  if (prototype.length !== $orgToReset.length) {
    for (var i in $orgToReset) {
      if (!$orgToReset.hasOwnProperty(i)) {
        continue;
      }

      prototype[i] = $orgToReset[i];

      if (i === parseInt(i, 10).toString()) {
        if ((typeof global === 'undefined' ? 'undefined' : _typeof(global)) === 'object') {
          prototype[i].getBoundingClientRect = getBoundingClientRectClosure(prototype, i);
        }
      }
    }
  }

  prototype.$itemsPopulate($orgToReset);
}

/**
 * Override $.prototype with custom methods for dealing with state.
 *
 * @param {object} $ - jQuery or Cheerio.
 * @param {object} stateStore - Redux state store.
 */
var prototypeOverride = (function ($, stateStore) {
  if (!$.prototype.hasRequerio) {
    $.prototype.hasRequerio = true;
  }

  /**
   * A true Array of the selection's numerically-keyed properties.
   * This is necessary for selection by class and tag, where results number more than one.
   * Members of this array will be fully-incepted organisms.
   */
  $.prototype.$items = [];

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
   * @param {number} [itemIdx] - Index of child item if targeting a child.
   * @return {object} The new application state.
   */
  if (!$.prototype.dispatchAction) {
    $.prototype.dispatchAction = function (method, args_, itemIdx) {
      if (typeof itemIdx !== 'undefined' && typeof this[itemIdx] === 'undefined') {
        return;
      }

      var args = [];

      if (Array.isArray(args_)) {
        args = args_;
      } else if (typeof args_ === 'string' || typeof args_ === 'number' || args_ instanceof Object) {
        args = [args_];
      }

      // Submission of itemIdx indicates that the action is to be dispatched on the specific item of the CSS class.
      var $item = void 0;

      if (typeof itemIdx !== 'undefined') {
        $item = $(this[itemIdx]);
      }

      // Side-effects must happen here. stateStore.dispatch() depends on this.
      if (typeof itemIdx === 'undefined' && (typeof this[method] === 'function' || typeof this[0][method] === 'function') || typeof itemIdx !== 'undefined' && $item.length && (typeof $item[method] === 'function' || typeof this[itemIdx][method] === 'function')) {

        switch (method) {

          // Make addClass more convenient by checking if the class already exists.
          case 'addClass':
            {
              if (!this.hasClass(args[0])) {
                applyMethod(this, method, args, itemIdx, $item);
              }

              break;
            }

          // attr method with no arg retrieves data and updates state.
          case 'attr':
            {
              if (args.length) {
                applyMethod(this, method, args, itemIdx, $item);
              } else {

                // Cheerio objects have an .attribs property for member element attributes, which is undocumented and may
                // change without notice. However, this is unlikely, since it is derived from its htmlparser2 dependency.
                // The htmlparser3 package has had this property since its initial release.
                if (this[0].attribs) {
                  if (typeof itemIdx === 'undefined') {
                    args[0] = this[0].attribs;
                  } else {
                    args[0] = this[itemIdx].attribs;
                  }
                }

                // jQuery saves and keys selected DOM Element objects in an array-like manner on the jQuery object.
                // The .attributes property of each Element object are per the DOM spec.
                // We need to parse the .attributes property to create a key-value store, which we'll submit as args[0].
                else if (this[0].attributes && this[0].attributes.length) {
                    var attribs = {};

                    if (typeof itemIdx === 'undefined') {
                      for (var i = 0; i < this[0].attributes.length; i++) {
                        var attr = this[0].attributes[i];

                        attribs[attr.name] = attr.value;
                      }

                      args[0] = attribs;
                    } else {
                      for (var _i = 0; _i < this[itemIdx].attributes.length; _i++) {
                        var _attr = this[itemIdx].attributes[_i];

                        attribs[_attr.name] = _attr.value;
                      }

                      args[0] = attribs;
                    }
                  }
              }

              break;
            }

          // Need to reset $org and $org.$items on removeClass.
          case 'removeClass':
            {
              applyMethod(this, method, args, itemIdx, $item);
              $itemsReset($(this.selector));

              break;
            }

          // getBoundingClientRect takes measurements and updates state. This never accepts an argument.
          // Also has to operate on the DOM Element member of the jQuery object (or its Cheerio facsimile).
          case 'getBoundingClientRect':
            {
              if (this.selector === 'document' || this.selector === 'window') {
                break;
              }

              if (typeof $item === 'undefined') {
                // Apply to $org.
                args[0] = this[0][method].apply(this[0]);
              } else {
                // Apply to $item.
                args[0] = this[itemIdx][method].apply(this[itemIdx]);
              }

              break;
            }

          case 'setBoundingClientRect':
            {
              break;
            }

          // If innerWidth and innerHeight methods are applied to the window object, copy the respective property to the
          // state.
          case 'innerWidth':
          case 'innerHeight':
            {
              if (this.selector === 'window' && (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
                this[method] = window[method];
                args[0] = window[method];

                break;
              }
            }

          // scrollTop, width, height, innerWidth, and innerHeight methods with no args take measurements and update
          // state. innerWidth and innerHeight, when not applied to window, run the jQuery method.
          case 'scrollTop':
          case 'width':
          case 'height':
          case 'innerWidth':
          case 'innerHeight':
            {
              if (args.length) {
                applyMethod(this, method, args, itemIdx, $item);
              } else {
                if (typeof $item === 'undefined') {
                  // Apply to $org.
                  args[0] = this[method].apply(this);
                } else {
                  // Apply to $item.
                  args[0] = $item[method].apply($item);
                }
              }

              break;
            }

          // Method applications for other methods.
          default:
            applyMethod(this, method, args, itemIdx, $item);
        }
      }

      var stateNew = stateStore.dispatch({
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
   * @param {number} [itemIdx] - If targeting a child of a selector, that child's index.
   * @return {object} The organism's state.
   */
  if (!$.prototype.getState) {
    $.prototype.getState = function (itemIdx) {

      // In order to return the latest, most accurate state, dispatch these actions to update their properties.
      // Do not preemptively update .innerHTML property because we don't want to bloat the app with too much data.
      // Do not preemptively update .style property because we only want to keep track of styles dispatched through js.
      $itemsReset(this);

      // case state.attribs:
      this.dispatchAction('attr', [], itemIdx);

      // case state.getBoundingClientRect:
      this.dispatchAction('getBoundingClientRect', [], itemIdx);

      // case state.innerWidth:
      this.dispatchAction('innerWidth', [], itemIdx);

      // case state.innerHeight:
      this.dispatchAction('innerHeight', [], itemIdx);

      // case state.scrollTop:
      this.dispatchAction('scrollTop', [], itemIdx);

      // case state.width:
      this.dispatchAction('width', [], itemIdx);

      // case state.height:
      this.dispatchAction('height', [], itemIdx);

      if (typeof itemIdx === 'undefined') {
        return stateStore.getState()[this.selector];
      } else {
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

  /**
   * Populate organism's items with child organisms.
   *
   * @param {object} $orgToPopulate - The parent to the child organisms.
   */
  if (!$.prototype.$itemsPopulate) {
    $.prototype.$itemsPopulate = function ($orgToPopulate) {
      if (this.selector === 'document' || this.selector === 'window') {
        return;
      }

      this.$items = [];

      var $org = this;

      $orgToPopulate.each(function () {
        var $this = $(this);

        $this.parentSelector = $org.selector;

        $org.$items.push($this);
      });
    };
  }

  /**
   * Give the ability to set boundingClientRect properties. Only for server-side testing.
   *
   * @param {object} rectObj - Object of boundingClientRect measurements. Does not need to include all of them.
   * @param {number} [itemIdx] - Index of item if child item.
   */
  if ((typeof global === 'undefined' ? 'undefined' : _typeof(global)) === 'object') {
    $.prototype.setBoundingClientRect = function (rectObj, itemIdx) {
      this.dispatchAction('setBoundingClientRect', rectObj, itemIdx);
    };
  }
});

/**
 * Helper function to add class to state.
 *
 * @param {array} classesForReducedState - Array of classes.
 * @param {string|function} classParam - Class to add to classesForReducedState.
 * @param {object} state - Current state.
 * @return {undefined} This function mutates the new state object.
 */
function addClass(classesForReducedState, classParam, state) {
  var classesToAdd = void 0;

  if (typeof classParam === 'string') {
    classesToAdd = classParam.split(/\s+/);
  } else if (typeof classParam === 'function') {
    var retval = classParam();

    if (typeof retval === 'string') {
      classesToAdd = retval.split(/\s+/);
    }
  }

  classesToAdd.forEach(function (classToAdd) {
    if (classesForReducedState.indexOf(classToAdd) === -1) {
      state.attribs.class += ' ' + classToAdd;
    }
  });
}

/**
 * Helper function to remove class from state.
 *
 * @param {array} classesForReducedState - Array of classes.
 * @param {string|function} classParam - Class to remove from classesForReducedState.
 * @param {number|null} classIdx_ - Index of class to be removed.
 * @param {object} state - Current state.
 * @return {undefined} This function mutates the new state object.
 */
function removeClass(classesForReducedState, classParam, classIdx_, state) {
  var classesToRemove = [];

  if (typeof classParam === 'string') {
    classesToRemove = classParam.split(/\s+/);
  } else if (typeof classParam === 'function') {
    var retval = classParam();

    if (typeof retval === 'string') {
      classesToRemove = retval.split(/\s+/);
    }
  }

  classesToRemove.forEach(function (classToRemove) {
    var classIdx = void 0;

    if (typeof classIdx_ === 'number') {
      classIdx = classIdx_;
    } else {
      classesForReducedState.indexOf(classToRemove);
    }

    if (classIdx > -1) {
      classesForReducedState.splice(classIdx, 1);
    }
  });

  state.attribs.class = classesForReducedState.join(' ');
}

/**
 * This builds state objects for organisms and their member items.
 *
 * @param {object} $org - Organism.
 * @param {object} state - Preinitialized state.
 * @param {object} action - Object defining how we'll act.
 * @return {undefined} This function mutates the state param.
 */
function stateBuild($org, state, action) {
  try {
    // Cheerio.
    if ($org[0].attribs) {
      state.attribs = JSON.parse(JSON.stringify($org[0].attribs));
    }

    // jQuery.
    else if ($org[0].attributes && $org[0].attributes.length) {
        for (var i = 0; i < $org[0].attributes.length; i++) {
          var attr = $org[0].attributes[i];

          state.attribs[attr.name] = attr.value;
        }
      }

    var classesForReducedState = [];
    if (state.attribs && state.attribs.class) {
      classesForReducedState = state.attribs.class.split(/\s+/);
    }

    switch (action.method) {
      case 'addClass':
        {
          if (action.args.length === 1) {
            addClass(classesForReducedState, action.args[0], state);
          }

          break;
        }

      case 'removeClass':
        {
          if (action.args.length === 1) {
            removeClass(classesForReducedState, action.args[0], null, state);
          }

          break;
        }

      case 'toggleClass':
        {
          var classesToToggle = [];

          if (typeof action.args[0] === 'string') {
            classesToToggle = action.args[0].split(/\s+/);
          } else if (typeof action.args[0] === 'function') {
            var retval = action.args[0]();

            if (typeof retval === 'string') {
              classesToToggle = retval.split(/\s+/);
            }
          }

          classesToToggle.forEach(function (classToToggle) {
            if (action.args.length === 1) {
              var classIdx = classesForReducedState.indexOf(classToToggle);

              if (classIdx === -1) {
                addClass(classesForReducedState, classToToggle, state);
              } else {
                removeClass(classesForReducedState, classToToggle, classIdx, state);
              }
            } else if (action.args.length === 2) {
              if (action.args[1]) {
                addClass(classesForReducedState, classToToggle, state);
              } else {
                var _classIdx = classesForReducedState.indexOf(classToToggle);

                removeClass(classesForReducedState, classToToggle, _classIdx, state);
              }
            }
          });

          break;
        }

      case 'attr':
        {
          if (action.args.length === 2) {
            if (typeof action.args[0] === 'string') {
              if (typeof action.args[1] === 'string') {
                state.attribs[action.args[0]] = action.args[1];
              } else if (typeof action.args[1] === 'function') {
                var _retval = action.args[1]();

                if (typeof _retval === 'string') {
                  state.attribs[action.args[0]] = _retval;
                }
              }
            }
          } else if (action.args.length === 1 && action.args[0] instanceof Object && action.args[0].constructor === Object) {
            for (var _i in action.args[0]) {
              if (!action.args[0].hasOwnProperty(_i)) {
                continue;
              }
              state.attribs[_i] = action.args[0][_i];
            }
          }

          break;
        }

      case 'css':
        {
          if (action.args.length === 2) {
            if (typeof action.args[0] === 'string') {
              if (typeof action.args[1] === 'string') {
                state.style[action.args[0]] = action.args[1];
              } else if (typeof action.args[1] === 'function') {
                var _retval2 = action.args[1]();

                if (typeof _retval2 === 'string') {
                  state.style[action.args[0]] = _retval2;
                }
              }
            }
          } else if (action.args.length === 1 && action.args[0] instanceof Object && action.args[0].constructor === Object) {
            for (var _i2 in action.args[0]) {
              if (!action.args[0].hasOwnProperty(_i2)) {
                continue;
              }

              state.style[_i2] = action.args[0][_i2];
            }
          }

          break;
        }

      case 'getBoundingClientRect':
        {
          if (action.args.length === 1) {
            if (action.args[0] instanceof Object) {

              // Must copy, not reference, but can't use JSON.parse(JSON.stringify()) in FF and Edge because in those
              // browsers, DOMRect properties are inherited, not "own" properties (as in hasOwnProperty).
              var rectObj = action.args[0];

              for (var _i3 in rectObj) {
                if (typeof rectObj[_i3] === 'number') {
                  state.boundingClientRect[_i3] = rectObj[_i3];
                }
              }
            }
          }

          break;
        }

      case 'setBoundingClientRect':
        {
          if (action.args[0] instanceof Object) {
            state.boundingClientRect = JSON.parse(JSON.stringify(action.args[0]));
          }

          break;
        }

      case 'height':
        {
          if (action.args.length === 1) {
            if (typeof action.args[0] === 'number') {
              state.height = action.args[0];

              if ((typeof global === 'undefined' ? 'undefined' : _typeof(global)) === 'object') {
                state.boundingClientRect.height = action.args[0];
              }
            }
          }

          break;
        }

      case 'html':
        {
          if (action.args.length === 1) {
            if (typeof action.args[0] === 'string') {
              state.innerHTML = action.args[0];
            } else if (typeof action.args[0] === 'function') {
              var _retval3 = action.args[0]();

              if (typeof _retval3 === 'string') {
                state.style[action.args[0]] = _retval3;
              }
            }
          }

          break;
        }

      case 'innerWidth':
        {
          if (action.args.length === 1) {
            if (typeof action.args[0] === 'number') {
              state.innerWidth = action.args[0];
            }
          }

          break;
        }

      case 'innerHeight':
        {
          if (action.args.length === 1) {
            if (typeof action.args[0] === 'number') {
              state.innerHeight = action.args[0];
            }
          }

          break;
        }

      case 'scrollTop':
        {
          if (action.args.length === 1) {
            if (typeof action.args[0] === 'number') {
              state.scrollTop = action.args[0];
            }
          }

          break;
        }

      case 'width':
        {
          if (action.args.length === 1) {
            if (typeof action.args[0] === 'number') {
              state.width = action.args[0];

              if ((typeof global === 'undefined' ? 'undefined' : _typeof(global)) === 'object') {
                state.boundingClientRect.width = action.args[0];
              }
            }
          }

          break;
        }
    }
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    throw err;
  }
}

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
    var stateDefault = {
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

    // If this is the reducer for the selected organism, reduce and return a new state.
    if (action.selector === orgSelector) {

      var state = void 0;
      var $org = action.$org;

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
          $org.$items.forEach(function ($item, idx) {
            state.$items[idx] = JSON.parse(JSON.stringify(stateDefault));
          });
        } catch (err) {
          console.error(err); // eslint-disable-line no-console
        }
      } else {
        try {
          // Populate $items array with clones of stateDefault if necessary.
          $org.$items.forEach(function ($item, idx) {
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
      stateBuild($org, state, action);

      // Build new state for selection in $items array.
      if (typeof action.itemIdx !== 'undefined' && typeof $org.$items[action.itemIdx] !== 'undefined' && typeof state.$items[action.itemIdx] !== 'undefined') {
        stateBuild($org.$items[action.itemIdx], state.$items[action.itemIdx], action);
      }

      return state;
    }

    // If this is not the reducer for the selected organism, return the unmutated state if submitted as a defined param.
    // Else return the default state.
    else {
        if (state_) {
          return state_;
        } else {
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
var reducerGet = (function ($orgs, Redux) {
  var reducers = {};

  for (var i in $orgs) {
    if (!$orgs.hasOwnProperty(i)) {
      continue;
    }

    reducers[i] = reducerClosure(i);
  }

  return Redux.combineReducers(reducers);
});

var Requerio = function () {
  function Requerio($, Redux, $organisms, actionsGet) {
    classCallCheck(this, Requerio);

    var root = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window || (typeof global === 'undefined' ? 'undefined' : _typeof(global)) === 'object' && global;

    this.$ = $;
    this.Redux = Redux;
    this.$orgs = $organisms;
    this.actions = actionsGet(this, root);
  }

  createClass(Requerio, [{
    key: 'init',
    value: function init() {
      var reducer = reducerGet(this.$orgs, this.Redux);
      var store = this.Redux.createStore(reducer);

      prototypeOverride(this.$, store);
      organismsIncept(this.$orgs, this.$);
    }
  }]);
  return Requerio;
}();

if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
  window.Requerio = Requerio;
}

module.exports = Requerio;
