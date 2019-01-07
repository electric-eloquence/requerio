'use strict';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

/**
 * Populate $orgs values with jQuery or Cheerio objects.
 *
 * @param {object} $orgs - Organisms keyed by selector.
 * @param {object} $ - jQuery object.
 */
var organismsIncept = (function ($orgs, $) {
  var _loop = function _loop(i) {
    /* istanbul ignore if */
    if (!$orgs.hasOwnProperty(i)) {
      return "continue";
    }

    var $org = void 0;

    if (i === 'document') {
      if ((typeof document === "undefined" ? "undefined" : _typeof(document)) === 'object') {
        $org = $(document);
      } else {
        $org = {};
      }
    } else if (i === 'window') {
      if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object') {
        $org = $(window);
      } else {
        $org = {};
      }
    } else {
      $org = $("".concat(i));
    } // Cheerio doesn't have .selector property.
    // .selector property removed in jQuery 3.
    // Needs to get set here and not in the prototype override because $org.$membersPopulate() depends on it and there
    // doesn't seem to be an easy way to determine it from within the prototype.


    if (typeof $org.selector === 'undefined') {
      $org.selector = i;
    }

    if (i !== 'document' && i !== 'window') {
      $org.$membersPopulate($org);
    } // /////////////////////////////////////////////////////////////////////////
    // Set methods that server-side tests are likely to depend on.
    // They need to be defined here and not in the prototype override because
    // `document` and `window` organisms are not Cheerio objects.
    // /////////////////////////////////////////////////////////////////////////

    /**
     * @param {number} [distance] - Distance.
     * @returns {number|undefined} Distance.
     */


    if (typeof $org.innerWidth === 'undefined') {
      $org.innerWidth = function (distance) {
        return distance;
      };
    }
    /**
     * @param {number} [distance] - Distance.
     * @returns {number|undefined} Distance.
     */


    if (typeof $org.innerHeight === 'undefined') {
      $org.innerHeight = function (distance) {
        return distance;
      };
    }
    /**
     * @param {number} [distance] - Distance.
     * @returns {number|undefined} Distance.
     */


    if (typeof $org.scrollTop === 'undefined') {
      $org.scrollTop = function (distance) {
        if (typeof distance !== 'undefined') {
          $org._scrollTop = distance;
        }

        return $org._scrollTop;
      };
    }
    /**
     * @param {number} [distance] - Distance.
     * @returns {number|undefined} Distance.
     */


    if (typeof $org.width === 'undefined') {
      $org.width = function (distance) {
        return distance;
      };
    }
    /**
     * @param {number} [distance] - Distance.
     * @returns {number|undefined} Distance.
     */


    if (typeof $org.height === 'undefined') {
      $org.height = function (distance) {
        return distance;
      };
    } // /////////////////////////////////////////////////////////////////////////
    // Attach the organism to the object of organisms and finish.
    // /////////////////////////////////////////////////////////////////////////


    $orgs[i] = $org;
  };

  for (var i in $orgs) {
    var _ret = _loop(i);

    if (_ret === "continue") continue;
  }
});

/**
 * Apply the jQuery or Cheerio method on the organism.
 *
 * @param {object} $org - Organism object.
 * @param {string} method - Name of the method to be applied.
 * @param {array} args - Arguments array, (not array-like object).
 * @param {number} [memberIdx] - Index of member if targeting a member.
 * @param {object} [$member] - Organism member if targeting a member.
 */
function applyMethod($org, method, args, memberIdx, $member) {
  if (typeof $member === 'undefined') {
    // Apply to $org.
    $org[method].apply($org, args);
  } else {
    // Apply to $member.
    $member[method].apply($member, args);
  }
}
/**
 * Create a stand-in for Element.getBoundingClientRect for the server.
 * Need this closure to return a function with $org and memberIdx baked in.
 *
 * @param {object} $org - Organism object.
 * @param {number} memberIdx - The index of the organism member.
 * @returns {function} The returned function returns an object with properties correspond to the properties of DOMRect.
 */


function getBoundingClientRectClosure($org, memberIdx) {
  return function () {
    var rectState = $org.getStore().getState()[$org.selector].$members[memberIdx].boundingClientRect;

    for (var i in rectState) {
      /* istanbul ignore if */
      if (!rectState.hasOwnProperty(i)) {
        continue;
      }

      if (rectState[i] !== null) {
        return rectState;
      }
    }

    return {
      bottom: null,
      height: null,
      left: null,
      right: null,
      top: null,
      width: null
    };
  };
}
/**
 * Resets the organism's members as they are added or removed.
 * Executes the .$membersReset() method attached to the prototype. The reason for this private function is that outside
 * this file's scope, we don't want to query for the result of the entire selector, only its members.
 *
 * @param {object} prototype - The `this` reference from the jQuery/Cheerio prototype.
 */


function $membersReset(prototype) {
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
        if ((typeof global === "undefined" ? "undefined" : _typeof(global)) === 'object') {
          prototype[i].getBoundingClientRect = getBoundingClientRectClosure(prototype, i);
        }
      }
    }
  }

  prototype.$membersPopulate($orgToReset);
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


  $.prototype.$members = [];
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
   * @param {number} [memberIdx] - Index of member if targeting a member.
   * @returns {object} The new application state.
   */

  if (!$.prototype.dispatchAction) {
    $.prototype.dispatchAction = function (method, args_, memberIdx) {
      if (typeof memberIdx !== 'undefined' && typeof this[memberIdx] === 'undefined') {
        return;
      }

      var args = [];

      if (Array.isArray(args_)) {
        args = args_;
      } else if (typeof args_ === 'string' || typeof args_ === 'number' || args_ instanceof Object) {
        args = [args_];
      } // Submission of memberIdx indicates that the action is to be dispatched on the specific member of the CSS class.


      var $member;

      if (typeof memberIdx !== 'undefined') {
        $member = $(this[memberIdx]);
      } // Side-effects must happen here. stateStore.dispatch() depends on this.


      if (typeof memberIdx === 'undefined' && (typeof this[method] === 'function' || this[0] && typeof this[0][method] === 'function') || typeof memberIdx !== 'undefined' && $member.length && (typeof $member[method] === 'function' || this[memberIdx] && typeof this[memberIdx][method] === 'function')) {
        switch (method) {
          // Make addClass more convenient by checking if the class already exists.
          case 'addClass':
            {
              if (typeof memberIdx === 'undefined') {
                if (!this.hasClass(args[0])) {
                  applyMethod(this, method, args, memberIdx, $member);
                }
              } else {
                if (!$member.hasClass(args[0])) {
                  applyMethod(this, method, args, memberIdx, $member);
                }
              }

              break;
            }
          // attr method with no arg retrieves data and updates state.

          case 'attr':
            {
              if (args.length) {
                applyMethod(this, method, args, memberIdx, $member);
              } else {
                // Cheerio objects have an .attribs property for member element attributes, which is undocumented and may
                // change without notice. However, this is unlikely, since it is derived from its htmlparser2 dependency.
                // The htmlparser2 package has had this property since its initial release.
                if (this[0] && this[0].attribs) {
                  if (typeof memberIdx === 'undefined') {
                    args[0] = this[0].attribs;
                  } else if (this[memberIdx] && this[memberIdx].attribs) {
                    args[0] = this[memberIdx].attribs;
                  }
                } // jQuery saves and keys selected DOM Element objects in an array-like manner on the jQuery object.
                // The .attributes property of each Element object are per the DOM spec.
                // We need to parse the .attributes property to create a key-value store, which we'll submit as args[0].
                else if (this[0] && this[0].attributes) {
                    if (typeof memberIdx === 'undefined' && this[0].attributes.length) {
                      var attribs = {};

                      for (var i = 0; i < this[0].attributes.length; i++) {
                        var attr = this[0].attributes[i];
                        attribs[attr.name] = attr.value;
                      }

                      args[0] = attribs;
                    } else if (this[memberIdx] && this[memberIdx].attributes && this[memberIdx].attributes.length) {
                      var _attribs = {};

                      for (var _i = 0; _i < this[memberIdx].attributes.length; _i++) {
                        var _attr = this[memberIdx].attributes[_i];
                        _attribs[_attr.name] = _attr.value;
                      }

                      args[0] = _attribs;
                    }
                  }
              }

              break;
            }
          // getBoundingClientRect takes measurements and updates state. This never accepts an argument.
          // Also has to operate on the DOM Element member of the jQuery object (or its Cheerio facsimile).

          case 'getBoundingClientRect':
            {
              /* istanbul ignore if */
              if (this.selector === 'document' || this.selector === 'window') {
                break;
              }

              if (typeof $member === 'undefined') {
                // Apply to $org.
                args[0] = this[0][method].apply(this[0]);
              } else {
                // Apply to $member.
                args[0] = this[memberIdx][method].apply(this[memberIdx]);
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
              if (this.selector === 'window' && (typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object') {
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
                applyMethod(this, method, args, memberIdx, $member);
              } else {
                /* istanbul ignore else */
                if (typeof $member === 'undefined') {
                  // Apply to $org.
                  args[0] = this[method].apply(this);
                } else {
                  // Apply to $member.
                  args[0] = $member[method].apply($member);
                }
              }

              break;
            }
          // Method applications for other methods.

          default:
            applyMethod(this, method, args, memberIdx, $member);
        }
      }

      var stateNew = stateStore.dispatch({
        type: '',
        selector: this.selector,
        $org: this,
        memberIdx: memberIdx,
        method: method,
        args: args
      });
      return stateNew;
    };
  }
  /**
   * A reference to Redux store.getState().
   *
   * @param {number} [memberIdx] - If targeting a child of a selector, that child's index.
   * @returns {object} The organism's state.
   */


  if (!$.prototype.getState) {
    $.prototype.getState = function (memberIdx) {
      // In order to return the latest, most accurate state, dispatch these actions to update their properties.
      // Do not preemptively update .innerHTML property because we don't want to bloat the app with too much data.
      // Do not preemptively update .style property because we only want to keep track of styles dispatched through js.
      $membersReset(this); // case state.attribs:

      this.dispatchAction('attr', [], memberIdx); // case state.getBoundingClientRect:

      this.dispatchAction('getBoundingClientRect', [], memberIdx); // case state.innerWidth:

      this.dispatchAction('innerWidth', [], memberIdx); // case state.innerHeight:

      this.dispatchAction('innerHeight', [], memberIdx); // case state.scrollTop:

      this.dispatchAction('scrollTop', [], memberIdx); // case state.width:

      this.dispatchAction('width', [], memberIdx); // case state.height:

      this.dispatchAction('height', [], memberIdx);

      if (typeof memberIdx === 'undefined') {
        return stateStore.getState()[this.selector];
      } else {
        return stateStore.getState()[this.selector].$members[memberIdx];
      }
    };
  }
  /**
   * A reference to Redux store.
   *
   * @returns {object} This app's state store.
   */


  if (!$.prototype.getStore) {
    $.prototype.getStore = function () {
      return stateStore;
    };
  }
  /**
   * Populate organism's members with child organisms.
   *
   * @param {object} $orgToPopulate - The parent to the child organisms.
   */


  if (!$.prototype.$membersPopulate) {
    $.prototype.$membersPopulate = function ($orgToPopulate) {
      /* istanbul ignore if */
      if (this.selector === 'document' || this.selector === 'window') {
        return;
      }

      this.$members = [];
      var $org = this;
      $orgToPopulate.each(function () {
        var $this = $(this);
        $this.parentSelector = $org.selector;
        $org.$members.push($this);
      });

      if ((typeof global === "undefined" ? "undefined" : _typeof(global)) === 'object') {
        for (var i in this) {
          if (i === parseInt(i, 10).toString()) {
            this[i].getBoundingClientRect = getBoundingClientRectClosure(this, i);
          }
        }
      }
    };
  }
  /**
   * Give the ability to set boundingClientRect properties. Only for server-side testing.
   *
   * @param {object} rectObj - Object of boundingClientRect measurements. Does not need to include all of them.
   * @param {number} [memberIdx] - Index of member if child member.
   */


  if ((typeof global === "undefined" ? "undefined" : _typeof(global)) === 'object') {
    $.prototype.setBoundingClientRect = function (rectObj, memberIdx) {
      this.dispatchAction('setBoundingClientRect', rectObj, memberIdx);
    };
  }
});

/**
 * Helper function to add class to state.
 *
 * @param {array} classesForReducedState - Array of classes.
 * @param {string|function} classParam - Class to add to classesForReducedState.
 * @param {object} state - Current state.
 * @returns {undefined} This function mutates the new state object.
 */
function addClass(classesForReducedState, classParam, state) {
  var classesToAdd;

  if (typeof classParam === 'string') {
    classesToAdd = classParam.split(/\s+/);
  } else if (typeof classParam === 'function') {
    var retVal = classParam();

    if (typeof retVal === 'string') {
      classesToAdd = retVal.split(/\s+/);
    }
  }

  classesToAdd.forEach(function (classToAdd) {
    if (classesForReducedState.indexOf(classToAdd) === -1) {
      state.attribs.class += " ".concat(classToAdd);
    }
  });
  state.classArray = classesToAdd;
  state.classList = state.classArray;
}
/**
 * Helper function to remove class from state.
 *
 * @param {array} classesForReducedState - Array of classes.
 * @param {string|function} classParam - Class to remove from classesForReducedState.
 * @param {number|null} classIdx_ - Index of class to be removed.
 * @param {object} state - Current state.
 * @returns {undefined} This function mutates the new state object.
 */


function removeClass(classesForReducedState, classParam, classIdx_, state) {
  var classesToRemove = [];

  if (typeof classParam === 'string') {
    classesToRemove = classParam.split(/\s+/);
  } else if (typeof classParam === 'function') {
    var retVal = classParam();

    if (typeof retVal === 'string') {
      classesToRemove = retVal.split(/\s+/);
    }
  }

  classesToRemove.forEach(function (classToRemove) {
    var classIdx;

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
  state.classArray = classesForReducedState;
  state.classList = state.classArray;
}
/**
 * This builds state objects for organisms and their members.
 *
 * @param {object} $org - Organism.
 * @param {object} state - Preinitialized state.
 * @param {object} action - Object defining how we'll act.
 * @returns {undefined} This function mutates the state param.
 */


function stateBuild($org, state, action) {
  try {
    // Cheerio.
    if ($org[0] && $org[0].attribs) {
      state.attribs = JSON.parse(JSON.stringify($org[0].attribs));
    } // jQuery.
    else if ($org[0] && $org[0].attributes && $org[0].attributes.length) {
        for (var i = 0; i < $org[0].attributes.length; i++) {
          var attr = $org[0].attributes[i];
          state.attribs[attr.name] = attr.value;
        }
      }

    var classesForReducedState = [];

    if (state.attribs && state.attribs.class) {
      classesForReducedState = state.attribs.class.split(/\s+/);
      state.classArray = classesForReducedState;
      state.classList = state.classArray;
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
            var retVal = action.args[0]();

            if (typeof retVal === 'string') {
              classesToToggle = retVal.split(/\s+/);
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
                var _retVal = action.args[1]();

                if (typeof _retVal === 'string') {
                  state.attribs[action.args[0]] = _retVal;
                }
              }
            }
          } else if (action.args.length === 1 && action.args[0] instanceof Object && action.args[0].constructor === Object) {
            for (var _i in action.args[0]) {
              /* istanbul ignore if */
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
                var _retVal2 = action.args[1]();

                if (typeof _retVal2 === 'string') {
                  state.style[action.args[0]] = _retVal2;
                }
              }
            }
          } else if (action.args.length === 1 && action.args[0] instanceof Object && action.args[0].constructor === Object) {
            for (var _i2 in action.args[0]) {
              /* istanbul ignore if */
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
            var _rectObj = JSON.parse(JSON.stringify(action.args[0]));

            Object.assign(state.boundingClientRect, _rectObj); // If this is called on the server, we need to copy the rectObj to the state $members.

            if ((typeof global === "undefined" ? "undefined" : _typeof(global)) === 'object') {
              if (typeof action.memberIdx !== 'undefined' && typeof state.$members[action.memberIdx] !== 'undefined') {
                Object.assign(state.$members[action.memberIdx].boundingClientRect, _rectObj);
              } else {
                state.$members.forEach(function ($member) {
                  Object.assign($member.boundingClientRect, _rectObj);
                });
              }
            }
          }

          break;
        }

      case 'height':
        {
          if (action.args.length === 1) {
            if (typeof action.args[0] === 'number') {
              state.height = action.args[0];

              if ((typeof global === "undefined" ? "undefined" : _typeof(global)) === 'object') {
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
              var _retVal3 = action.args[0]();

              if (typeof _retVal3 === 'string') {
                state.style[action.args[0]] = _retVal3;
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

              if ((typeof global === "undefined" ? "undefined" : _typeof(global)) === 'object') {
                state.boundingClientRect.width = action.args[0];
              }
            }
          }

          break;
        }
    }
  } catch (err) {
    /* istanbul ignore next */
    console.error(err); // eslint-disable-line no-console

    /* istanbul ignore next */

    throw err;
  }
}
/**
 * Closure to generate reducers specific to organisms.
 *
 * @param {string} orgSelector - The organism's selector.
 * @returns {function} A function configured to work on the orgSelector.
 */


function reducerClosure(orgSelector) {
  /**
   * Clone an old state, update the clone based on an action, and return the clone.
   *
   * @param {object} state_ - Old state.
   * @param {object} action - An object with properties defining an action.
   * @returns {object} New state.
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
     * @property {array} $members - jQuery/Cheerio object members belonging to selection.
     */
    var stateDefault = {
      attribs: {},
      boundingClientRect: {
        width: null,
        height: null,
        top: null,
        right: null,
        bottom: null,
        left: null
      },
      classArray: [],
      classList: [],
      innerHTML: null,
      innerWidth: null,
      innerHeight: null,
      scrollTop: null,
      style: {},
      width: null,
      height: null,
      $members: []
    }; // If this is the reducer for the selected organism, reduce and return a new state.

    if (action.selector === orgSelector) {
      var state;
      var $org = action.$org;

      try {
        // Clone old state into new state.
        state = JSON.parse(JSON.stringify(state_));
      } catch (err) {
        // Clone default state into new state if state_ param is undefined.

        /* istanbul ignore next */
        state = JSON.parse(JSON.stringify(stateDefault));
      } // Update length of state.$members array to match length of $org.$members.


      if ($org.$members.length < state.$members.length) {
        try {
          // Update $members array with clones of stateDefault.
          state.$members = [];
          $org.$members.forEach(function ($member, idx) {
            state.$members[idx] = JSON.parse(JSON.stringify(stateDefault));
          });
        } catch (err) {
          /* istanbul ignore next */
          console.error(err); // eslint-disable-line no-console
        }
      } else if ($org.$members.length > state.$members.length) {
        try {
          // Populate $members array with clones of stateDefault if necessary.
          $org.$members.forEach(function ($member, idx) {
            if (!state.$members[idx]) {
              state.$members[idx] = JSON.parse(JSON.stringify(stateDefault));
            }
          });
        } catch (err) {
          /* istanbul ignore next */
          console.error(err); // eslint-disable-line no-console
        }
      } // Preinitialize.


      if (state.attribs) {
        state.attribs.class = $org.attr('class');
      } // Build new state for organism.


      stateBuild($org, state, action); // Build new state for selection in $members array.

      if (typeof action.memberIdx !== 'undefined' && typeof $org.$members[action.memberIdx] !== 'undefined' && typeof state.$members[action.memberIdx] !== 'undefined') {
        stateBuild($org.$members[action.memberIdx], state.$members[action.memberIdx], action);
      }

      return state;
    } // If this is not the reducer for the selected organism, return the unmutated state if submitted as a defined param.
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
 * @returns {object} Combined reducers
 */


var reducerGet = (function ($orgs, Redux) {
  var reducers = {};

  for (var i in $orgs) {
    /* istanbul ignore if */
    if (!$orgs.hasOwnProperty(i)) {
      continue;
    }

    reducers[i] = reducerClosure(i);
  }

  return Redux.combineReducers(reducers);
});

var Requerio =
/*#__PURE__*/
function () {
  function Requerio($, Redux, $organisms, actionsGet) {
    _classCallCheck(this, Requerio);

    var root = (typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' && window || (typeof global === "undefined" ? "undefined" : _typeof(global)) === 'object' && global;
    this.$ = $;
    this.Redux = Redux;
    this.$orgs = $organisms;
    this.actions = actionsGet(this, root);
  }

  _createClass(Requerio, [{
    key: "init",
    value: function init() {
      var reducer = reducerGet(this.$orgs, this.Redux);
      var store = this.Redux.createStore(reducer);
      prototypeOverride(this.$, store);
      organismsIncept(this.$orgs, this.$);
    }
  }]);

  return Requerio;
}();

if (typeof define === 'function') {
  define(function () {
    return Requerio;
  });
} else if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object') {
  window.Requerio = Requerio;
}

module.exports = Requerio;
