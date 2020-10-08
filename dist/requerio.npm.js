'use strict';

/**
 * Populate $orgs values with jQuery or Cheerio components.
 *
 * @param {object} $orgs - Organisms keyed by selector.
 * @param {object} $ - jQuery or Cheerio.
 */
var organismsIncept = ($orgs, $) => {
  for (const i of Object.keys($orgs)) {
    /* istanbul ignore if */
    if ($orgs[i] && $orgs[i].hasRequerio) {
      continue;
    }

    let $org;

    if (i === 'document') {
      if (typeof document === 'object') {
        $org = $(document);
      }
      else {
        $org = $(i);

        $org.$members.push({});
      }
    }

    if (i === 'window') {
      if (typeof window === 'object') {
        $org = $(window);
      }
      else {
        $org = $(i);

        $org.$members.push({});
      }
    }

    if (!$org) {
      $org = $(i);
    }

    // Use this property to save the Redux action object returned by a Redux dispatch.
    $org.prevAction = null;

    // Cheerio doesn't have .selector property.
    // .selector property was removed in jQuery 3.
    // Needs to get set here and not in the prototype override because $org.populateMembers() depends on it and there
    // doesn't seem to be an easy way to determine it from within the prototype.
    if (typeof $org.selector === 'undefined') {
      $org.selector = i;
    }

    if (i !== 'document' && i !== 'window') {
      $org.populateMembers();
    }

    // /////////////////////////////////////////////////////////////////////////
    // Set methods that server-side tests are likely to depend on.
    // They need to be defined here and not in the prototype override because
    // `document` and `window` organisms are not Cheerio components.
    // /////////////////////////////////////////////////////////////////////////

    /**
     * @param {number} [distance] - Distance.
     * @returns {number|null|object} Distance, null, or organism.
     */
    if (typeof $org.innerWidth === 'undefined') {
      $org.innerWidth = (distance) => {
        if (typeof distance === 'undefined') {
          /* istanbul ignore else */
          if ($org.$members[0]) {
            return $org.$members[0]._innerWidth;
          }
          else {
            return null;
          }
        }
        else {
          for (let i = 0; i < $org.$members.length; i++) {
            $org.$members[i]._innerWidth = distance;
          }

          return $org;
        }
      };
    }

    /**
     * @param {number} [distance] - Distance.
     * @returns {number|null|object} Distance, null, or organism.
     */
    if (typeof $org.innerHeight === 'undefined') {
      $org.innerHeight = (distance) => {
        if (typeof distance === 'undefined') {
          /* istanbul ignore else */
          if ($org.$members[0]) {
            return $org.$members[0]._innerHeight;
          }
          else {
            return null;
          }
        }
        else {
          for (let i = 0; i < $org.$members.length; i++) {
            $org.$members[i]._innerHeight = distance;
          }

          return $org;
        }
      };
    }

    /**
     * @param {number} [distance] - Distance.
     * @returns {number|null|object} Distance, null, or organism.
     */
    if (typeof $org.outerWidth === 'undefined') {
      $org.outerWidth = (distance) => {
        if (typeof distance === 'undefined') {
          /* istanbul ignore else */
          if ($org.$members[0]) {
            return $org.$members[0]._outerWidth;
          }
          else {
            return null;
          }
        }
        else {
          for (let i = 0; i < $org.$members.length; i++) {
            $org.$members[i]._outerWidth = distance;
          }

          return $org;
        }
      };
    }

    /**
     * @param {number} [distance] - Distance.
     * @returns {number|null|object} Distance, null, or organism.
     */
    if (typeof $org.outerHeight === 'undefined') {
      $org.outerHeight = (distance) => {
        if (typeof distance === 'undefined') {
          /* istanbul ignore else */
          if ($org.$members[0]) {
            return $org.$members[0]._outerHeight;
          }
          else {
            return null;
          }
        }
        else {
          for (let i = 0; i < $org.$members.length; i++) {
            $org.$members[i]._outerHeight = distance;
          }

          return $org;
        }
      };
    }

    /**
     * @param {number} [distance] - Distance.
     * @returns {number|null|object} Distance, null, or organism.
     */
    if (typeof $org.scrollLeft === 'undefined') {
      $org.scrollLeft = (distance) => {
        if (typeof distance === 'undefined') {
          /* istanbul ignore else */
          if ($org.$members[0]) {
            return $org.$members[0]._scrollLeft;
          }
          else {
            return null;
          }
        }
        else {
          for (let i = 0; i < $org.$members.length; i++) {
            $org.$members[i]._scrollLeft = distance;
          }

          return $org;
        }
      };
    }

    /**
     * @param {number} [distance] - Distance.
     * @returns {number|null|object} Distance, null, or organism.
     */
    if (typeof $org.scrollTop === 'undefined') {
      $org.scrollTop = (distance) => {
        if (typeof distance === 'undefined') {
          /* istanbul ignore else */
          if ($org.$members[0]) {
            return $org.$members[0]._scrollTop;
          }
          else {
            return null;
          }
        }
        else {
          for (let i = 0; i < $org.$members.length; i++) {
            $org.$members[i]._scrollTop = distance;
          }

          return $org;
        }
      };
    }

    /**
     * @param {number} [distance] - Distance.
     * @returns {number|null|object} Distance, null, or organism.
     */
    if (typeof $org.width === 'undefined') {
      $org.width = (distance) => {
        if (typeof distance === 'undefined') {
          /* istanbul ignore else */
          if ($org.$members[0]) {
            return $org.$members[0]._width;
          }
          else {
            return null;
          }
        }
        else {
          for (let i = 0; i < $org.$members.length; i++) {
            $org.$members[i]._width = distance;
          }

          return $org;
        }
      };
    }

    /**
     * @param {number} [distance] - Distance.
     * @returns {object} Organism.
     */
    if (typeof $org.height === 'undefined') {
      $org.height = (distance) => {
        if (typeof distance === 'undefined') {
          /* istanbul ignore else */
          if ($org.$members[0]) {
            return $org.$members[0]._height;
          }
          else {
            return null;
          }
        }
        else {
          for (let i = 0; i < $org.$members.length; i++) {
            $org.$members[i]._height = distance;
          }

          return $org;
        }
      };
    }

    // /////////////////////////////////////////////////////////////////////////
    // Attach the organism to the object of organisms and finish.
    // /////////////////////////////////////////////////////////////////////////

    $orgs[i] = $org;
  }
};

/* eslint-disable valid-jsdoc */

/**
 * Only useful for finding when the focus has changed due to user interaction, or mocked user interaction.
 */
function getActiveOrganism($orgs, lastActiveOrganism) {
  // Return if no `document` object or `document` doesn't have .activeElement.
  /* istanbul ignore if */
  if (typeof document !== 'object' || !document.activeElement) {
    return;
  }

  // Return if user hasn't focused anywhere.
  if (document.activeElement === document.body) {
    return;
  }

  // Check if last active organism is still active organism.
  if (
    document.activeElement.tagName &&
    lastActiveOrganism &&
    document.activeElement.tagName.toLowerCase() === lastActiveOrganism.toLowerCase()
  ) {
    return lastActiveOrganism;
  }

  for (let i = 0; i < document.activeElement.attributes.length; i++) {
    const attribute = document.activeElement.attributes[i];

    if (
      attribute.name === 'id' && `#${attribute.value}` === lastActiveOrganism ||
      attribute.name === 'class' && `.${attribute.value}` === lastActiveOrganism
    ) {
      return lastActiveOrganism;
    }
  }

  for (const orgSelector of Object.keys($orgs)) {
    const $org = $orgs[orgSelector];

    for (let i = 0; i < $org.length; i++) {
      const elem = $org[i];

      // If using Cheerio and JSDOM.
      /* istanbul ignore else */
      if (typeof global === 'object' && typeof document === 'object' && global.$._root && global.$._root.attribs) {
        if (
          !document.activeElement.tagName ||
          !elem.name ||
          document.activeElement.tagName.toLowerCase() !== elem.name.toLowerCase()
        ) {
          continue;
        }

        // Try matching active element with the organism's element attributes.
        for (let j = 0; j < document.activeElement.attributes.length; j++) {
          const attribute = document.activeElement.attributes[j];

          if (
            attribute.name === 'id' && attribute.value === elem.attribs.id ||
            attribute.name === 'class' && attribute.value === elem.attribs.class
          ) {
            return $org.selector;
          }
        }
      }

      // Use strict object compare if using DOM on browser.
      else if (document.activeElement === elem) {
        return $org.selector;
      }
    }
  }
}

var postInception = (requerio) => {
  const {$orgs, store} = requerio;

  for (const orgSelector of Object.keys($orgs)) {
    if ($orgs[orgSelector] && $orgs[orgSelector].hasRequerio) {
      continue;
    }

    const $org = $orgs[orgSelector];

    // Indicate that the `$` component is an incepted organism. Nothing prevents anyone from using jQuery or Cheerio
    // without Requerio within a Requerio app. This property will only be true for incepted organisms (but not their
    // $members).
    $org.hasRequerio = true;

    /**
### blur()
Remove focus from the specified element, if that element has focus.
If there is a 'document' organism and it has `state.activeOrganism` set, unset that property.
*/
    if ($orgs.document) {
      let blurOrig = () => {};

      if (typeof $org.blur === 'function') {
        blurOrig = $org.blur;
      }

      $org.blur = () => {
        blurOrig.call($org);

        // If using JSDOM.
        if (typeof global === 'object' && document && document.querySelector) {
          document.querySelector($org.selector).blur();
        }

        if (requerio.store.getState()['document'].activeOrganism === $org.selector) {
          $orgs.document.dispatchAction('setActiveOrganism', null);
        }
      };
    }

    /**
### focus()
Set focus on the specified element, if that element can take focus. If it can take focus, and if there is a 'document'
organism, set the focused organism's selector as `state.activeOrganism`.
*/
    if ($orgs.document) {
      let focusOrig = () => {};

      if (typeof $org.focus === 'function') {
        focusOrig = $org.focus;
      }

      $org.focus = () => {
        focusOrig.call($org);

        // If using JSDOM.
        if (typeof global === 'object' && document && document.querySelector) {
          document.querySelector($org.selector).focus();
        }

        $orgs.document.dispatchAction('setActiveOrganism', $org.selector);
      };
    }

    /**
     * For document and window organisms only.
     * Do not document.
     */
    if (orgSelector === 'document' || orgSelector === 'window') {
      $org.getState = () => {
        if (orgSelector === 'document' && typeof document === 'object') {
          const lastActiveOrganism = store.getState()[orgSelector].activeOrganism;
          const activeOrganism = getActiveOrganism($orgs, lastActiveOrganism);

          if (typeof activeOrganism !== 'undefined' && activeOrganism !== lastActiveOrganism) {
            $org.dispatchAction('setActiveOrganism', activeOrganism);
          }
        }

        const state = store.getState()[orgSelector];

        $org.updateMeasurements(state);

        return state;
      };
    }
  }
};

/**
 * Apply the jQuery or Cheerio method on the organism.
 *
 * @param {object} $org - Organism object.
 * @param {string} method - Name of the method to be applied.
 * @param {array} args - Arguments array, (not array-like object).
 * @param {object|object[]} [$member] - Organism member, or array of members.
 */
function applyMethod($org, method, args, $member) {
  if (Array.isArray($member)) {
    // Apply on each iteration of $member array.
    for (let i = 0; i < $member.length; i++) {
      if (typeof $member[i][method] === 'function') {
        $member[i][method].apply($member[i], args);
      }
    }
  }
  else if ($member) {
    // Apply to $member.
    if (typeof $member[method] === 'function') {
      $member[method].apply($member, args);
    }
  }
  else {
    // Apply to $org.
    if (typeof $org[method] === 'function') {
      $org[method].apply($org, args);
    }
  }
}

/**
 * Apply the .attr() jQuery/Cheerio method.
 *
 * @param {object} $org - Organism object.
 * @param {array} args - Arguments array, (not array-like object).
 * @param {object|object[]} [$member] - Organism member, or array of members.
 * @param {number|number[]} [memberIdx] - Organism member index, or array of indices.
 */
function applyAttr($org, args, $member, memberIdx) {
  if (args.length) {
    applyMethod($org, 'attr', args, $member);
  }
  else {

    // Cheerio components have an .attribs property for element attributes, which is undocumented and may change without
    // notice. However, this is unlikely, since it is derived from its htmlparser2 dependency. The htmlparser2 package
    // has had this property since its initial release and its public position is that this won't change.
    // https://github.com/fb55/htmlparser2/issues/35
    // https://github.com/cheeriojs/cheerio/issues/547
    if ($org[0] && $org[0].attribs) {
      if (Array.isArray(memberIdx)) {
        // Get attribs from first valid iteration of elements.
        for (let i = 0; i < memberIdx.length; i++) {
          const idx = memberIdx[i];

          if ($org[idx] && $org[idx].attribs) {
            args[0] = $org[idx].attribs;

            break;
          }
        }
      }
      else if ($org[memberIdx] && $org[memberIdx].attribs) {
        args[0] = $org[memberIdx].attribs;
      }
      else {
        args[0] = $org[0].attribs;
      }
    }

    // jQuery saves and keys selected DOM Element objects in an array-like manner on the jQuery component.
    // The .attributes property of each Element object are per the DOM spec.
    // We need to parse the .attributes property to create a key:value store, which we'll submit as args[0].
    else if ($org[0] && $org[0].attributes) {
      if (Array.isArray(memberIdx)) {
        // Get attribs from first valid iteration of elements.
        for (let i = 0; i < memberIdx.length; i++) {
          const idx = memberIdx[i];

          if ($org[idx] && $org[idx].attributes && $org[idx].attributes.length) {
            const attribs = {};

            // .attributes is not an Iterable so no for of.
            for (let j = 0; j < $org[idx].attributes.length; j++) {
              const attribute = $org[idx].attributes[j];
              attribs[attribute.name] = attribute.value;
            }

            args[0] = attribs;

            break;
          }
        }
      }
      else if ($org[memberIdx] && $org[memberIdx].attributes && $org[memberIdx].attributes.length) {
        const attribs = {};

        // .attributes is not an Iterable, so no for...of.
        for (let i = 0; i < $org[memberIdx].attributes.length; i++) {
          const attribute = $org[memberIdx].attributes[i];
          attribs[attribute.name] = attribute.value;
        }

        args[0] = attribs;
      }
      else if ($org[0].attributes.length) {
        const attribs = {};

        // .attributes is not an Iterable so no for of.
        for (let i = 0; i < $org[0].attributes.length; i++) {
          const attribute = $org[0].attributes[i];
          attribs[attribute.name] = attribute.value;
        }

        args[0] = attribs;
      }
    }
  }
}

/**
 * Apply the .css() jQuery/Cheerio method. If a string or array is submitted as the arg, will update the state with the
 * current style value.
 *
 * @param {object} $org - Organism object.
 * @param {array} args - Arguments array, (not array-like object).
 * @param {object|object[]} [$member] - Organism member, or array of members.
 */
function applyCss($org, args, $member) {
  const method = 'css';

  if (Array.isArray($member)) {
    // Set operation.
    if (args[0] instanceof Object && args[0].constructor === Object) {
      // Apply on each iteration of $member array.
      for (let i = 0; i < $member.length; i++) {
        $member[i][method].apply($member[i], args);
      }
    }

    // Get operation. Only iterate once.
    for (let i = 0; i < $member.length; i++) {
      const $elem = $member[i];

      if (args[0] instanceof Object && args[0].constructor === Object) {
        // Retrieve evaluated css after setting in previous block.
        const keys = Object.keys(args[0]);
        args[0] = $elem[method].apply($elem, [keys]);
      }
      else if (typeof args[0] === 'string') {
        const key = args[0];
        const value = $elem[method].apply($elem, args);
        args[0] = {};
        args[0][key] = value;
      }
      else if (Array.isArray(args[0])) {
        args[0] = $elem[method].apply($elem, args);
      }
      else /* istanbul ignore next */ {
        args[0] = {};
      }

      break;
    }

    if (!$member.length) {
      /* istanbul ignore next */
      args[0] = {};
    }
  }
  else if ($member) {
    // Set operation.
    if (args[0] instanceof Object && args[0].constructor === Object) {
      // Apply to $member.
      $member[method].apply($member, args);

      // Retrieve evaluated css.
      const keys = Object.keys(args[0]);

      if (keys.length === 1) {
        args[0] = {};
        args[0][keys[0]] = $member[method].apply($member, keys);
      }
      else {
        args[0] = $member[method].apply($member, [keys]);
      }
    }
    // Get operation.
    else if (typeof args[0] === 'string') {
      const key = args[0];
      const value = $member[method].apply($member, args);
      args[0] = {};
      args[0][key] = value;
    }
    else if (Array.isArray(args[0])) {
      args[0] = $member[method].apply($member, args);
    }
  }
  else {
    // Set operation.
    if (args[0] instanceof Object && args[0].constructor === Object) {
      // Apply to $org.
      $org[method].apply($org, args);

      // Retrieve evaluated css.
      const keys = Object.keys(args[0]);

      if (keys.length === 1) {
        args[0] = {};
        args[0][keys[0]] = $org[method].apply($org, keys);
      }
      else {
        args[0] = $org[method].apply($org, [keys]);
      }
    }
    // Get operation.
    else {
      if (typeof args[0] === 'string') {
        const key = args[0];
        const value = $org[method].apply($org, args);
        args[0] = {};
        args[0][key] = value;
      }
      else if (Array.isArray(args[0])) {
        args[0] = $org[method].apply($org, args);
      }
    }
  }

  if (typeof window === 'object') { // jQuery
    if (args[0] instanceof Object && args[0].constructor === Object) {
      for (const property of Object.keys(args[0])) {
        let camel;

        if (property.indexOf('-') > -1) {
          const hyphenatedArr = property.split('-');
          const camelArr = [];

          for (let i = 0; i < hyphenatedArr.length; i++) {
            if (i === 0) {
              camelArr[i] = hyphenatedArr[i];

              continue;
            }

            camelArr[i] = hyphenatedArr[i][0].toUpperCase() + hyphenatedArr[i].slice(1);
          }

          camel = camelArr.join('');
        }

        if ($org[0] && $org[0].style && camel in $org[0].style) {
          args[0][camel] = args[0][property];
        }
      }
    }
  }
}

function applyData($org, args, $member) {
  const method = 'data';

  if (args[0] instanceof Object && args[0].constructor === Object) {
    applyMethod($org, method, args, $member);
  }

  if (Array.isArray($member)) {
    // Get all data to submit for updating state. Only iterate once.
    for (let i = 0; i < $member.length; i++) {
      const data = $member[i][method].apply($member[i]);
      args[0] = data;

      break;
    }
  }
  else if ($member) {
    const data = $member[method].apply($member);
    args[0] = data;
  }
  else {
    const data = $org[method].apply($org);
    args[0] = data;
  }
}

/**
 * Convert camelCase "method" to CAPS_SNAKE_CASE "type".
 *
 * @param {string} method - The jQuery/Cheerio/Requerio "method" name.
 * @returns {string} The Redux action "type" per Redux casing convention.
 */
function convertMethodToType(method) {
  return method.replace(/([A-Z])/g, '_$1').toUpperCase();
}

/**
 * Convenience method for getting boundingClientRect whether on client or server.
 *
 * @param {object} $org - Organism object.
 * @param {array} args - Arguments array, (not array-like object). Must always be an empty array. Will write the
 *   measurement to its element 0.
 * @param {number|number[]} [memberIdx] - Organism member index, or array of member indices.
 * @returns {array} The `args` array.
 */
function getBoundingClientRect($org, args, memberIdx) {
  const method = 'getBoundingClientRect';

  if (Array.isArray(memberIdx)) {
    for (let i = 0; i < memberIdx.length; i++) {
      const idx = memberIdx[i];

      // Apply on indexed element.
      /* istanbul ignore else */
      if (typeof $org[method] === 'function') {
        args[0] = $org[method].call($org, idx);
      }
      else if (typeof window === 'object') {
        if ($org[idx] && typeof $org[idx][method] === 'function') {
          args[0] = $org[idx][method].call($org[idx]);
        }
      }
    }
  }
  else if (typeof memberIdx === 'number') {
    // Apply on indexed element.
    /* istanbul ignore else */
    if (typeof $org[method] === 'function') {
      args[0] = $org[method].call($org, memberIdx);
    }
    else if (typeof window === 'object') {
      if ($org[memberIdx] && typeof $org[memberIdx][method] === 'function') {
        args[0] = $org[memberIdx][method].call($org[memberIdx]);
      }
    }
  }
  else {
    // If no memberIdx, apply on first item.
    /* istanbul ignore else */
    if (typeof $org[method] === 'function') {
      args[0] = $org[method].call($org);
    }
    else if (typeof window === 'object') {
      if ($org[0] && typeof $org[0][method] === 'function') {
        args[0] = $org[0][method].call($org[0]);
      }
    }
  }

  return args;
}

/**
 * Convenience method for getting measurements in a DOM environment.
 *
 * @param {object} $org - Organism object.
 * @param {string} method - Name of the method to be applied.
 *   measurement to its element 0.
 * @param {object} computedStyle - Only defined for jQuery. Per DOM `CSSStyleDeclaration` spec.
 * @param {object} elem - Per DOM `HTMLElement` spec.
 * @returns {array} The `args` array.
 */
function getMeasurementSwitch($org, method, computedStyle = {}, elem) {
  switch (method) {
    case 'innerWidth':
      if ($org.selector === 'window') {
        return elem.innerWidth;
      }
      else if ($org.selector === 'document') {
        return;
      }
      else {
        if (computedStyle.boxSizing === 'content-box') {
          return parseInt(computedStyle.width, 10) +
            (parseInt(computedStyle.paddingLeft, 10) || 0) +
            (parseInt(computedStyle.paddingRight, 10) || 0);
        }
        else {
          return parseInt(computedStyle.width, 10) -
            (parseInt(computedStyle.borderLeftWidth, 10) || 0) -
            (parseInt(computedStyle.borderRightWidth, 10) || 0);
        }
      }

    case 'innerHeight':
      if ($org.selector === 'window') {
        return elem.innerHeight;
      }
      else if ($org.selector === 'document') {
        return;
      }
      else {
        if (computedStyle.boxSizing === 'content-box') {
          return parseInt(computedStyle.height, 10) +
            (parseInt(computedStyle.paddingTop, 10) || 0) +
            (parseInt(computedStyle.paddingBottom, 10) || 0);
        }
        else {
          return parseInt(computedStyle.height, 10) -
            (parseInt(computedStyle.borderTopWidth, 10) || 0) -
            (parseInt(computedStyle.borderBottomWidth, 10) || 0);
        }
      }

    case 'outerWidth':
      if ($org.selector === 'window') {
        return elem.outerWidth;
      }
      else if ($org.selector === 'document') {
        return;
      }
      else {
        if (computedStyle.boxSizing === 'content-box') {
          return parseInt(computedStyle.width, 10) +
            (parseInt(computedStyle.paddingLeft, 10) || 0) +
            (parseInt(computedStyle.paddingRight, 10) || 0) +
            (parseInt(computedStyle.borderLeftWidth, 10) || 0) +
            (parseInt(computedStyle.borderRightWidth, 10) || 0) +
            (parseInt(computedStyle.marginLeft, 10) || 0) +
            (parseInt(computedStyle.marginRight, 10) || 0);
        }
        else {
          return parseInt(computedStyle.width, 10) +
            (parseInt(computedStyle.marginLeft, 10) || 0) +
            (parseInt(computedStyle.marginRight, 10) || 0);
        }
      }

    case 'outerHeight':
      if ($org.selector === 'window') {
        return elem.outerHeight;
      }
      else if ($org.selector === 'document') {
        return;
      }
      else {
        if (computedStyle.boxSizing === 'content-box') {
          return parseInt(computedStyle.height, 10) +
            (parseInt(computedStyle.paddingTop, 10) || 0) +
            (parseInt(computedStyle.paddingBottom, 10) || 0) +
            (parseInt(computedStyle.borderTopWidth, 10) || 0) +
            (parseInt(computedStyle.borderBottomWidth, 10) || 0) +
            (parseInt(computedStyle.marginTop, 10) || 0) +
            (parseInt(computedStyle.marginBottom, 10) || 0);
        }
        else {
          return parseInt(computedStyle.height, 10) +
            (parseInt(computedStyle.marginTop, 10) || 0) +
            (parseInt(computedStyle.marginBottom, 10) || 0);
        }
      }

    case 'scrollLeft':
      if ($org.selector === 'window') {
        return elem.pageXOffset;
      }
      else if ($org.selector === 'document') {
        return elem.documentElement.scrollLeft;
      }
      else {
        return elem.scrollLeft;
      }

    case 'scrollTop':
      if ($org.selector === 'window') {
        return elem.pageYOffset;
      }
      else if ($org.selector === 'document') {
        return elem.documentElement.scrollTop;
      }
      else {
        return elem.scrollTop;
      }

    case 'width':
      if ($org.selector === 'window') {
        return elem.innerWidth;
      }
      else if ($org.selector === 'document') {
        return Math.max(
          elem.body.scrollWidth,
          elem.documentElement.scrollWidth,
          elem.body.offsetWidth,
          elem.documentElement.offsetWidth,
          elem.documentElement.clientWidth
        );
      }
      else {
        if (computedStyle.boxSizing === 'content-box') {
          return parseInt(computedStyle.width, 10);
        }
        else {
          return parseInt(computedStyle.width, 10) -
            (parseInt(computedStyle.paddingLeft, 10) || 0) -
            (parseInt(computedStyle.paddingRight, 10) || 0) -
            (parseInt(computedStyle.borderLeftWidth, 10) || 0) -
            (parseInt(computedStyle.borderRightWidth, 10) || 0);
        }
      }

    case 'height':
      if ($org.selector === 'window') {
        return elem.innerHeight;
      }
      else if ($org.selector === 'document') {
        return Math.max(
          elem.body.scrollHeight,
          elem.documentElement.scrollHeight,
          elem.body.offsetHeight,
          elem.documentElement.offsetHeight,
          elem.documentElement.clientHeight
        );
      }
      else {
        if (computedStyle.boxSizing === 'content-box') {
          return parseInt(computedStyle.height, 10);
        }
        else {
          return parseInt(computedStyle.height, 10) -
            (parseInt(computedStyle.paddingTop, 10) || 0) -
            (parseInt(computedStyle.paddingBottom, 10) || 0) -
            (parseInt(computedStyle.borderTopWidth, 10) || 0) -
            (parseInt(computedStyle.borderBottomWidth, 10) || 0);
        }
      }
  }
}

/**
 * Get a measurement as efficiently as possible.
 *
 * @param {object} $org - Organism object.
 * @param {string} method - Name of the method to be applied.
 * @param {array} args - Arguments array, (not array-like object). Must always be an empty array. Will write the
 *   measurement to its element 0.
 * @param {object|undefined} computedStyle - Only defined for jQuery. Per DOM `CSSStyleDeclaration` spec.
 * @param {object|object[]} [$member] - Organism member, or array of members.
 * @returns {array} The `args` array.
 */
function getMeasurement($org, method, args, computedStyle, $member) {
  if (Array.isArray($member)) {
    // Apply on first valid iteration of $member array.
    for (let i = 0; i < $member.length; i++) {
      const $elem = $member[i];

      if (typeof window === 'object') { // jQuery
        args[0] = getMeasurementSwitch($org, method, computedStyle, $elem[0]);
      }
      else if (typeof $elem[method] === 'function') { // Cheerio
        args[0] = $elem[method].apply($elem);

        break;
      }
    }
  }
  else if ($member) {
    // Apply to $member.
    /* istanbul ignore if */
    if (typeof window === 'object') { // jQuery
      args[0] = getMeasurementSwitch($org, method, computedStyle, $member[0]);
    }
    else if (typeof $member[method] === 'function') { // Cheerio
      args[0] = $member[method].apply($member);
    }
  }
  else {
    // Apply to $org.
    if (typeof window === 'object') { // jQuery
      if ($org.selector === 'window') {
        args[0] = getMeasurementSwitch($org, method, computedStyle, window);
      }
      else if ($org.selector === 'document') {
        args[0] = getMeasurementSwitch($org, method, computedStyle, document);
      }
      else {
        args[0] = getMeasurementSwitch($org, method, computedStyle, $org[0]);
      }
    }
    else if (typeof $org[method] === 'function') { // Cheerio
      args[0] = $org[method].apply($org);
    }
  }

  args[0] = isNaN(args[0]) ? void 0 : args[0];

  return args;
}

/**
 * Override $.prototype with custom methods for dealing with state.
 *
 * @param {object} requerio - Requerio instance.
 */
var prototypeOverride = (requerio) => {
  /* eslint-disable max-len */
  /* eslint-disable valid-jsdoc */

  const {$, $orgs, store} = requerio;
  $.prototype.$members = [];

  /**
   * Must redefine .after() because we may need to reset the elements and members of sibling and descendent organisms.
   * Same params as jQuery/Cheerio .after().
   * Do not document.
   */
  const afterFnOrig = $.prototype.after;

  $.prototype.after = function () {
    const descendantsToReset = [];
    const $parent = this.parent();

    if (arguments.length) {
      for (const orgSelector1 of Object.keys($orgs)) {
        const $org1 = $orgs[orgSelector1];

        // Iterate through organisms and check if the parent of this organism (dispatching the 'after' action)
        // is an ancestor.
        // This is much more efficient than searching through branches of descendants.
        for (let i = 0; i < $parent.length; i++) {
          if ($org1.parents($parent[i]).length) {
            descendantsToReset.push($org1);

            break;
          }
        }
      }
    }

    const retVal = afterFnOrig.apply(this, arguments);

    if (arguments.length) {
      this.resetElementsAndMembers();

      descendantsToReset.forEach(descendantToReset => descendantToReset.resetElementsAndMembers());
    }

    return retVal;
  };

  /**
   * Must redefine .append() because we may need to reset the elements and members of descendent organisms.
   * Same params as jQuery/Cheerio .append().
   * Do not document.
   */
  const appendFnOrig = $.prototype.append;

  $.prototype.append = function () {
    const descendantsToReset = [];

    if (arguments.length) {
      for (const orgSelector1 of Object.keys($orgs)) {
        const $org1 = $orgs[orgSelector1];

        // Iterate through organisms and check if this organism (dispatching the 'append' action) is an ancestor.
        // This is much more efficient than searching through branches of descendants.
        for (let i = 0; i < this.length; i++) {
          if ($org1.parents(this[i]).length) {
            descendantsToReset.push($org1);

            break;
          }
        }
      }
    }

    const retVal = appendFnOrig.apply(this, arguments);

    if (arguments.length) {
      this.resetElementsAndMembers();

      descendantsToReset.forEach(descendantToReset => descendantToReset.resetElementsAndMembers());
    }

    return retVal;
  };

  /**
   * Must redefine .before() because we may need to reset the elements and members of sibling and descendent organisms
   * Same params as jQuery/Cheerio .before().
   * Do not document.
   */
  const beforeFnOrig = $.prototype.before;

  $.prototype.before = function () {
    const descendantsToReset = [];
    const $parent = this.parent();

    if (arguments.length) {
      for (const orgSelector1 of Object.keys($orgs)) {
        const $org1 = $orgs[orgSelector1];

        // Iterate through organisms and check if the parent of this organism (dispatching the 'before' action)
        // is an ancestor.
        // This is much more efficient than searching through branches of descendants.
        for (let i = 0; i < $parent.length; i++) {
          if ($org1.parents($parent[i]).length) {
            descendantsToReset.push($org1);

            break;
          }
        }
      }
    }

    const retVal = beforeFnOrig.apply(this, arguments);

    if (arguments.length) {
      this.resetElementsAndMembers();

      descendantsToReset.forEach(descendantToReset => descendantToReset.resetElementsAndMembers());
    }

    return retVal;
  };

  /**
### .blur()
A server-side stand-in for client-side `.blur()`.
*/
  if (!$.prototype.blur) {
    $.prototype.blur = function () {};
  }

  /**
   * Must redefine .detach() because we need to reset the elements and members of parent organisms.
   * Same params as jQuery .detach().
   * Do not document.
   */
  const detachFnOrig = $.prototype.detach;

  $.prototype.detach = function () {
    const parentsToReset = [];

    for (const orgSelector1 of Object.keys($orgs)) {
      for (let i = 0; i < this.$members.length; i++) {
        if (this.$members[i].parent(orgSelector1).length) {
          parentsToReset.push($orgs[orgSelector1]);

          break;
        }
      }
    }

    if (typeof detachFnOrig === 'function') {
      detachFnOrig.apply(this);
    }
    else {
      // We can just use .remove() in Cheerio since there are no additional data to retain.
      this.remove();
    }

    parentsToReset.forEach(parentToReset => parentToReset.resetElementsAndMembers());

    return this;
  };

  /**
### .dispatchAction(method, [args], [memberIdx])
Dispatches actions for reduction. Side-effects occur here (not in the reducer).
1. Applies the jQuery or Cheerio method.
2. Applies any additional changes.
3. Calls the Redux `store.dispatch()` method.

__Returns__: `object` - The organism. Allows for action dispatches to be chained.

| Param | Type | Description |
| --- | --- | --- |
| method | `string` | The name of the method on the organism's prototype. |
| [args] | `*` | This param contains the values to be passed as arguments to the method. `null` may be submitted if not passing arguments, but targeting a memberIdx. |
| [memberIdx] | `number`\|`number[]` | The index, or array of indices, of the organism member(s), if targeting one or more members. |
*/
  $.prototype.dispatchAction = function (method, args_, memberIdx_) {
    const type = convertMethodToType(method);

    let args = [];

    // eslint-disable-next-line eqeqeq
    if (args_ != null) {
      args = [args_];
    }

    let memberIdx = memberIdx_;
    let membersLength = 0;

    this.$members.forEach(() => membersLength++);

    if (membersLength < this.$members.length) {
      memberIdx = [];

      // forEach loop necessary to retain original idx in case items were deleted.
      this.$members.forEach(($member, idx) => memberIdx.push(idx));
    }

    // Submission of memberIdx indicates that the action is to be dispatched on the specific member of the CSS class.
    let $member;

    if (Array.isArray(memberIdx)) {
      $member = [];

      for (let i = 0; i < memberIdx.length; i++) {
        $member.push($(this[memberIdx[i]]));
      }
    }
    else if (typeof memberIdx === 'number') {
      // Exit if the memberIdx points to nothing.
      if (typeof this[memberIdx] === 'undefined') {
        return;
      }

      $member = $(this[memberIdx]);
    }

    // Side-effects must happen here. store.dispatch() depends on this.
    switch (method) {

      case 'attr': {
        applyAttr(this, args, $member, memberIdx); // Mutates args.

        break;
      }

      // Dispatching 'css' with a property (or properties) but no value will write the existing property and value to
      // the .style property on the state.
      case 'css': {
        applyCss(this, args, $member); // Mutates args.

        break;
      }

      case 'data': {
        applyData(this, args, $member); // Mutates args.

        break;
      }

      case 'empty': {
        if ($member) {
          applyMethod(this, 'empty', args, $member);
        }
        else {
          applyMethod(this, 'empty', args, this.$members);
        }

        break;
      }

      // getBoundingClientRect takes measurements and updates state. This never accepts an argument.
      // On the client, it has to operate on the DOM Element member of the jQuery component.
      case 'getBoundingClientRect': {
        if (this.selector === 'window' || this.selector === 'document') {
          break;
        }

        getBoundingClientRect(this, args, memberIdx);

        break;
      }

      case 'html':
      case 'append':
      case 'prepend':
      case 'text': {
        if (args.length) {
          applyMethod(this, method, args, $member);
        }

        let html;
        let text;

        if (Array.isArray($member) && Array.isArray(memberIdx)) {
          if (args.length) {
            if (typeof window === 'object') { // jQuery
              for (let i = 0; i < memberIdx.length; i++) {
                const idx = memberIdx[i];

                if (this[idx]) {
                  if (method === 'html' && args[0] !== null) {
                    html = args[0];
                  }
                  else {
                    html = this[idx].innerHTML;
                  }

                  if (method === 'text' && args[0] !== null) {
                    text = args[0];
                  }
                  else {
                    text = this[idx].textContent;
                  }

                  break;
                }
              }
            }
            else { // Cheerio
              for (let i = 0; i < $member.length; i++) {
                const $elem = $member[i];

                if ($elem) {
                  if (method === 'html' && args[0] !== null) {
                    html = args[0];
                  }
                  else {
                    html = $elem.html();
                  }

                  if (method === 'text' && args[0] !== null) {
                    text = args[0];
                  }
                  else {
                    text = $elem.text();
                  }

                  break;
                }
              }
            }
          }
          else {
            for (let i = 0; i < $member.length; i++) {
              const $elem = $member[i];
              let htmlScoped;
              let textScoped;

              // On each iteration of $member array.
              if (typeof window === 'object') { // jQuery
                if ($elem && $elem[0]) {
                  htmlScoped = $elem[0].innerHTML;
                  textScoped = $elem[0].textContent;
                }
              }
              else { // Cheerio
                if ($elem) {
                  htmlScoped = $elem.html();
                  textScoped = $elem.text();
                }
              }

              store.dispatch({
                type: 'HTML',
                selector: this.selector,
                $org: this,
                method: 'html',
                args: [htmlScoped],
                i
              });

              store.dispatch({
                type: 'TEXT',
                selector: this.selector,
                $org: this,
                method: 'text',
                args: [textScoped],
                i
              });

              if (i === 0) {
                html = htmlScoped;
                text = textScoped;
              }
            }
          }
        }
        else if ($member && typeof memberIdx === 'number') {
          // On $member.
          if (typeof window === 'object') { // jQuery
            if ($member[0]) {
              html = $member[0].innerHTML;
              text = $member[0].textContent;
            }
          }
          else { // Cheerio
            html = $member.html();
            text = $member.text();
          }
        }
        else {
          // On $org.
          if (typeof window === 'object') { // jQuery
            if (this[0]) {
              html = this[0].innerHTML;
              text = this[0].textContent;
            }
          }
          else { // Cheerio
            html = this.html();
            text = this.$members[0].text();
          }
        }

        if (method !== 'html') {
          // eslint-disable-next-line eqeqeq
          if (html != null) {
            store.dispatch({
              type: 'HTML',
              selector: this.selector,
              $org: this,
              method: 'html',
              args: [html],
              memberIdx
            });
          }
        }

        if (method !== 'text') {
          // eslint-disable-next-line eqeqeq
          if (text != null) {
            store.dispatch({
              type: 'TEXT',
              selector: this.selector,
              $org: this,
              method: 'text',
              args: [text],
              memberIdx
            });
          }
        }

        // eslint-disable-next-line eqeqeq
        if (method === 'html' && args[0] == null) {
          args[0] = html;
        }

        // eslint-disable-next-line eqeqeq
        if (method === 'text' && args[0] == null) {
          args[0] = text;
        }

        break;
      }

      case 'innerWidth':
      case 'innerHeight':
      case 'outerWidth':
      case 'outerHeight':
      case 'scrollLeft':
      case 'scrollTop':
      case 'width':
      case 'height': {
        let computedStyle = {};

        if (typeof window === 'object') { // jQuery
          if (this.selector !== 'window' && this.selector !== 'document') {
            if (Array.isArray($member) && Array.isArray(memberIdx)) {
              for (let i = 0; i < memberIdx.length; i++) {
                if (this[memberIdx[i]]) {
                  computedStyle = window.getComputedStyle(this[memberIdx[i]]);

                  break;
                }
              }
            }
            else if ($member && typeof memberIdx === 'number') {
              if ($member[0]) {
                computedStyle = window.getComputedStyle($member[0]);
              }
            }
            else {
              computedStyle = window.getComputedStyle(this[0]);
            }
          }
        }

        if (args.length) {
          applyMethod(this, method, args, $member);
        }
        else {
          getMeasurement(this, method, args, computedStyle, $member); // Mutates args.
        }

        break;
      }

      case 'setActiveOrganism': {
        break;
      }

      case 'setBoundingClientRect': {
        break;
      }

      case 'toggleClass': {
        if (Array.isArray(args[0])) {
          args = args[0];
        }
        applyMethod(this, method, args, $member);

        break;
      }

      // Method applications for other methods.
      default: {
        applyMethod(this, method, args, $member);
      }
    }

    if (membersLength < this.$members.length) {
      this.populateMembers();
    }

    this.prevAction = store.dispatch({
      type,
      selector: this.selector,
      $org: this,
      method,
      args,
      memberIdx
    });

    return this;
  };

  /**
   * Must redefine .empty() because we may need to reset the elements and members of descendent organisms.
   * Same params as jQuery/Cheerio .empty().
   * Do not document.
   */

  const emptyFnOrig = $.prototype.empty;

  $.prototype.empty = function () {
    const descendantsToReset = [];

    for (const orgSelector1 of Object.keys($orgs)) {
      const $org1 = $orgs[orgSelector1];

      // Iterate through organisms and check if this organism (dispatching the 'empty' action) is an ancestor.
      // This is much more efficient than searching through branches of descendants.
      for (let i = 0; i < this.length; i++) {
        if ($org1.parents(this[i]).length) {
          descendantsToReset.push($org1);

          break;
        }
      }
    }

    const retVal = emptyFnOrig.apply(this);

    this.resetElementsAndMembers();

    descendantsToReset.forEach(descendantToReset => descendantToReset.resetElementsAndMembers());

    return retVal;
  };


  /**
### .exclude(selector)
Excludes (temporarily) selected member or members from an organism's `.$members`
array. A `.dispatchAction()` is meant to be ultimately chained to this method.
Invoking `.dispatchAction()` will restore all original `.$members`.

__Returns__: `object` - The organism with its `.$members` winnowed of selected exclusions.

| Param | Type | Description |
| --- | --- | --- |
| selector | `string`\|`object`\|`function` | A selector string, a DOM (or DOM-like) element, a jQuery/Cheerio component, or a function returning true or false. |
*/
  $.prototype.exclude = function (selector) {
    if (typeof selector === 'function') {
      this.each((i, elem) => {
        if (selector.call(elem, i, elem)) {
          // Hack a mismatch between length and number of array elements to signal to repopulate members.
          delete this.$members[i];
        }
      });

      return this;
    }
    else {
      let $exclusions = selector;

      if (selector.constructor !== $) {
        $exclusions = $(selector);
      }

      const $members = [];

      this.each((i) => {
        if (this.$members[i] && this.$members[i][0]) {
          $members.push(this.$members[i][0]);
        }
      });

      for (let i = 0; i < $members.length; i++) {
        $exclusions.each((j, elem) => {
          if ($members[i] === elem) {
            // Hack a mismatch between length and number of array elements to signal to repopulate members.
            delete this.$members[i];
          }
        });
      }

      return this;
    }
  };

  /**
### .focus([options])
A server-side stand-in for client-side `.focus()`.
*/
  if (!$.prototype.focus) {
    $.prototype.focus = function () {};
  }

  /**
   * Internal. Do not document.
   *
   * Create a stand-in for Element.getBoundingClientRect for the server.
   * Cannot be attached to Cheerio Element stand-ins because they frequently reference each other.
   * Working with or around such references creates far too much complexity.
   *
   * @param {number} [memberIdx] - The index of the organism member (if targeting a member).
   */
  if (typeof global === 'object') {
    $.prototype.getBoundingClientRect = function (memberIdx) {
      const state = store.getState()[this.selector];
      let rectState = {};

      if (typeof memberIdx === 'number') {
        if (state.$members[memberIdx] && state.$members[memberIdx].boundingClientRect) {
          rectState = state.$members[memberIdx].boundingClientRect;
        }
      }
      else {
        rectState = state.boundingClientRect;
      }

      for (const i of Object.keys(rectState)) {
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
### .getState([memberIdx])
Gets state of Requerio organism or member. Invokes Redux `store.getState()`.

__Returns__: `object`\|`null` - The organism's or member's state or `null` if the state doesn't exist.

| Param | Type | Description |
| --- | --- | --- |
| [memberIdx] | `number` | The index of the organism member (if targeting a member). |
*/
  $.prototype.getState = function (memberIdx) {
    const $member = this.$members[memberIdx];
    let orgIdx = 0;
    let state;
    let updateState = false;

    if (typeof memberIdx === 'number') {
      state = store.getState()[this.selector].$members[memberIdx];
      orgIdx = memberIdx;

      /* istanbul ignore if */
      if (!state) {
        updateState = true;
      }
    }

    // Return null if the memberIdx is out-of-bounds.
    // The case of window and document organisms is already handled in post-inception.js.
    if (!this[orgIdx]) {
      return null;
    }

    if (!state) {
      state = store.getState()[this.selector];
    }

    // If still no state, return null.
    /* istanbul ignore if */
    if (!state) {
      return null;
    }

    /* boundingClientRect */
    /* innerWidth */
    /* innerHeight */
    /* outerWidth */
    /* outerHeight */
    /* scrollLeft */
    /* scrollTop */
    /* width */
    /* height */
    // Do update measurements if changed by user interaction, e.g., resizing viewport.
    updateState = this.updateMeasurements(state, $member, memberIdx) || updateState;

    /* .attribs */
    // Do update .attribs if an attribute was changed by user interaction, e.g., `checked` attribute. (Not the best
    // example because it should be updated by the 'prop' action.)
    let attribsNow = {};

    if (typeof window === 'object') { // jQuery
      const attributes = this[orgIdx].attributes;

      for (let i = 0; i < attributes.length; i++) {
        attribsNow[attributes[i].name] = attributes[i].value;
      }
    }
    else { // Cheerio
      attribsNow = this[orgIdx].attribs;
    }

    if (JSON.stringify(state.attribs) !== JSON.stringify(attribsNow)) {
      store.dispatch({
        type: 'ATTR',
        selector: this.selector,
        $org: this,
        method: 'attr',
        args: [attribsNow],
        memberIdx
      });

      updateState = true;
    }

    /* .css */
    /* .data */
    // Do not update while getting state.

    /* .html */
    /* .text */
    // Do update .html property in case it was changed by another action.
    let htmlNow;

    if (typeof window === 'object') { // jQuery
      htmlNow = this[orgIdx].innerHTML;
    }
    else { // Cheerio
      if ($member) {
        htmlNow = $member.html();
      }
      else {
        htmlNow = this.html();
      }
    }

    if (state.html && state.html !== htmlNow) {
      store.dispatch({
        type: 'HTML',
        selector: this.selector,
        $org: this,
        method: 'html',
        args: [htmlNow],
        memberIdx
      });

      let textNow;

      // If html has changed, text has probably changed.
      if (typeof window === 'object') { // jQuery
        textNow = this[orgIdx].textContent;
      }
      else { // Cheerio
        if ($member) {
          textNow = $member.text();
        }
        else {
          textNow = this.text();
        }
      }

      if (state.textContent !== textNow) {
        store.dispatch({
          type: 'TEXT',
          selector: this.selector,
          $org: this,
          method: 'text',
          args: [textNow],
          memberIdx
        });
      }

      updateState = true;
    }

    // To update member count if changed by an action on html/text, dispatch an action with an empty method.
    if (typeof memberIdx === 'undefined' && this.length !== state.$members.length) {
      store.dispatch({
        type: '',
        selector: this.selector,
        $org: this
      });

      updateState = true;
    }

    /* .prop */
    // Do update .prop if a property was changed by user interaction, e.g., `checked` property.
    let propNow = {};

    for (const property of Object.keys(state.prop)) {
      if (typeof window === 'object') { // jQuery
        if (property in this[orgIdx]) {
          propNow[property] = this[orgIdx][property];
        }
      }
      else { // Cheerio
        if ($member) {
          propNow[property] = $member.prop(property);
        }
        else {
          propNow[property] = this.prop(property);
        }
      }
    }

    /* istanbul ignore if */
    if (JSON.stringify(state.prop) !== JSON.stringify(propNow)) {
      store.dispatch({
        type: 'PROP',
        selector: this.selector,
        $org: this,
        method: 'prop',
        args: [propNow],
        memberIdx
      });

      updateState = true;
    }

    /* val */
    // Do update form field values if they were changed by user interaction.
    if (typeof state.val !== 'undefined') {
      let valueNow;

      if (typeof window === 'object') { // jQuery
        valueNow = this[orgIdx].value;
      }
      else { // Cheerio
        if ($member) {
          valueNow = $member.val();
        }
        else {
          valueNow = this.val();
        }
      }

      if (valueNow !== state.val) {
        store.dispatch({
          type: 'VAL',
          selector: this.selector,
          $org: this,
          method: 'val',
          args: [valueNow],
          memberIdx
        });

        updateState = true;
      }
    }

    if (updateState) {
      if (typeof memberIdx === 'number') {
        state = store.getState()[this.selector].$members[memberIdx];
      }
      else {
        state = store.getState()[this.selector];
      }
    }

    const stateNow = JSON.parse(JSON.stringify(state));

    if (typeof memberIdx === 'number') {
      delete stateNow.$members;
      delete stateNow.members;
    }

    return stateNow;
  };

  /**
### .getStore()
A reference to the Redux `store`. The same reference as `requerio.store`.

__Returns__: `object` - This app's state store.
*/
  $.prototype.getStore = function () {
    return store;
  };

  /**
### .hasChild(selector)
Filters (temporarily) an organism's `.$members` array to include only those with
a child matching the selector. A `.dispatchAction()` is meant to be ultimately
chained to this method. Invoking `.dispatchAction()` will restore all original
`$.members`.

__Returns__: `object` - The organism with its `.$members` winnowed of exclusions.

| Param | Type | Description |
| --- | --- | --- |
| selector | `string`\|`object` | A selector string or DOM (or DOM-like) element. No jQuery/Cheerio components. |
*/
  $.prototype.hasChild = function (selector) {
    for (let i = 0; i < this.$members.length; i++) {
      // Hack a mismatch between length and number of array elements to signal to repopulate members.
      if (this.$members[i]) {
        const $children = this.$members[i].children(selector);

        if ($children.length) {
          if (typeof selector === 'string') {
            continue;
          }
          else if ($children[0] === selector) {
            continue;
          }
        }
      }

      delete this.$members[i];
    }

    return this;
  };

  /**
### .hasElement(element)
Filters (temporarily) an organism's `.$members` to include only those whose
elements match the param. A `.dispatchAction()` is meant to be ultimately
chained to this method. Invoking `.dispatchAction()` will restore all original
`$.members`.

__Returns__: `object` - The organism with its `.$members` winnowed of exclusions.

| Param | Type | Description |
| --- | --- | --- |
| element | `object` | A DOM (or DOM-like) element. |
*/
  $.prototype.hasElement = function (element) {
    for (let i = 0; i < this.$members.length; i++) {
      // Hack a mismatch between length and number of array elements to signal to repopulate members.
      if (this.$members[i] && this.$members[i][0] === element) {
        continue;
      }

      delete this.$members[i];
    }

    return this;
  };

  /**
### .hasNext(selector)
Filters (temporarily) an organism's `.$members` array to include only those whose
"next" sibling is matched by the selector. A `.dispatchAction()` is meant to be
ultimately chained to this method. Invoking `.dispatchAction()` will restore all
original `$.members`.

__Returns__: `object` - The organism with its `.$members` winnowed of exclusions.

| Param | Type | Description |
| --- | --- | --- |
| selector | `string`\|`object` | A selector string or DOM (or DOM-like) element. No jQuery/Cheerio components. |
*/
  $.prototype.hasNext = function (selector) {
    for (let i = 0; i < this.$members.length; i++) {
      // Hack a mismatch between length and number of array elements to signal to repopulate members.
      if (this.$members[i]) {
        const $next = this.$members[i].next(selector);

        if ($next.length) {
          if (typeof selector === 'string') {
            continue;
          }
          else if ($next[0] === selector) {
            continue;
          }
        }
      }

      delete this.$members[i];
    }

    return this;
  };

  /**
### .hasParent(selector)
Filters (temporarily) an organism's `.$members` to include only those with a
parent matching the selector. A `.dispatchAction()` is meant to be ultimately
chained to this method. Invoking `.dispatchAction()` will restore all original
`$.members`.

__Returns__: `object` - The organism with its `.$members` winnowed of exclusions.

| Param | Type | Description |
| --- | --- | --- |
| selector | `string`\|`object` | A selector string or DOM (or DOM-like) element. No jQuery/Cheerio components. |
*/
  $.prototype.hasParent = function (selector) {
    for (let i = 0; i < this.$members.length; i++) {
      // Hack a mismatch between length and number of array elements to signal to repopulate members.
      if (this.$members[i]) {
        const $parent = this.$members[i].parent(selector);

        if ($parent.length) {
          if (typeof selector === 'string') {
            continue;
          }
          else if ($parent[0] === selector) {
            continue;
          }
        }
      }

      delete this.$members[i];
    }

    return this;
  };

  /**
### .hasPrev(selector)
Filters (temporarily) an organism's `.$members` to include only those whose
"prev" sibling is matched by the selector. A `.dispatchAction()` is meant to be
ultimately chained to this method. Invoking `.dispatchAction()` will restore all
original `$.members`.

__Returns__: `object` - The organism with its `.$members` winnowed of exclusions.

| Param | Type | Description |
| --- | --- | --- |
| selector | `string`\|`object` | A selector string or DOM (or DOM-like) element. No jQuery/Cheerio components. |
*/
  $.prototype.hasPrev = function (selector) {
    for (let i = 0; i < this.$members.length; i++) {
      // Hack a mismatch between length and number of array elements to signal to repopulate members.
      if (this.$members[i]) {
        const $prev = this.$members[i].prev(selector);

        if ($prev.length) {
          if (typeof selector === 'string') {
            continue;
          }
          else if ($prev[0] === selector) {
            continue;
          }
        }
      }

      delete this.$members[i];
    }

    return this;
  };

  /**
### .hasSelector(selector)
Filters (temporarily) an organism's `.$members` to include only those that match
the selector criteria. A `.dispatchAction()` is meant to be ultimately chained
to this method. Invoking `.dispatchAction()` will restore all original
`$.members`.

__Returns__: `object` - The organism with its `.$members` winnowed of exclusions.

| Param | Type | Description |
| --- | --- | --- |
| selector | `string` | A jQuery/Cheerio selector. |
*/
  $.prototype.hasSelector = function (selector) {
    const $selection = $(selector);

    for (let i = 0; i < this.$members.length; i++) {
      /* istanbul ignore if */
      if (!this.$members[i]) {
        continue;
      }

      let hasSelector = false;

      for (let j = 0; j < $selection.length; j++) {
        // Hack a mismatch between length and number of array elements to signal to repopulate members.
        if (this.$members[i][0] === $selection[j]) {
          hasSelector = true;

          break;
        }
      }

      if (!hasSelector) {
        delete this.$members[i];
      }
    }

    return this;
  };

  /**
### .hasSibling(selector)
Filters (temporarily) an organism's `.$members` to include only those with a
sibling matched by the selector. A `.dispatchAction()` is meant to be ultimately
chained to this method. Invoking `.dispatchAction()` will restore all original
`$.members`.

__Returns__: `object` - The organism with its `.$members` winnowed of exclusions.

| Param | Type | Description |
| --- | --- | --- |
| selector | `string` | A selector string. |
*/
  $.prototype.hasSibling = function (selector) {
    for (let i = 0; i < this.$members.length; i++) {
      /* istanbul ignore if */
      if (!this.$members[i]) {
        continue;
      }

      // Hack a mismatch between length and number of array elements to signal to repopulate members.
      const $siblings = this.$members[i].siblings(selector);
      const hasSibling = $siblings.length ? true : false;

      if (!hasSibling) {
        delete this.$members[i];
      }
    }

    return this;
  };

  /**
   * Must redefine .html() because we may need to reset the elements and members of descendent organisms.
   * Same params as jQuery/Cheerio .html(). However, unlike jQuery, does not accept function params.
   * Do not document.
   */
  const htmlFnOrig = $.prototype.html;

  $.prototype.html = function () {
    const descendantsToReset = [];

    if (arguments.length) {
      for (const orgSelector1 of Object.keys($orgs)) {
        const $org1 = $orgs[orgSelector1];

        // Iterate through organisms and check if this organism (dispatching the 'html' action) is an ancestor.
        // This is much more efficient than searching through branches of descendants.
        for (let i = 0; i < this.length; i++) {
          if ($org1.parents(this[i]).length) {
            descendantsToReset.push($org1);

            break;
          }
        }
      }
    }

    const retVal = htmlFnOrig.apply(this, arguments);

    if (arguments.length) {
      this.resetElementsAndMembers();

      descendantsToReset.forEach(descendantToReset => descendantToReset.resetElementsAndMembers());
    }

    return retVal;
  };

  /**
### .populateMembers()
(Re)populate an organism's `.$members` array with its (recalculated) members.
`.$members` are jQuery/Cheerio components, not fully incepted organisms.
*/
  $.prototype.populateMembers = function () {
    if (!this.selector || !(this.selector in $orgs)) {
      return;
    }

    /* istanbul ignore if */
    if (this.selector === 'window' || this.selector === 'document') {
      return;
    }

    const $org = this;
    $org.$members = [];

    $org.each((i, elem) => {
      $org.$members.push($(elem));
    });
  };

  /**
   * Must redefine .prepend() because we may need to reset the elements and members of descendent organisms.
   * Same params as jQuery/Cheerio .prepend().
   * Do not document.
   */
  const prependFnOrig = $.prototype.prepend;

  $.prototype.prepend = function () {
    const descendantsToReset = [];
    const $parent = this.parent();

    if (arguments.length) {
      for (const orgSelector1 of Object.keys($orgs)) {
        const $org1 = $orgs[orgSelector1];

        // Iterate through organisms and check if this organism (dispatching the 'prepend' action) is an ancestor.
        // This is much more efficient than searching through branches of descendants.
        for (let i = 0; i < $parent.length; i++) {
          if ($org1.parents($parent[i]).length) {
            descendantsToReset.push($org1);

            break;
          }
        }
      }
    }

    const retVal = prependFnOrig.apply(this, arguments);

    if (arguments.length) {
      this.resetElementsAndMembers();

      descendantsToReset.forEach(descendantToReset => descendantToReset.resetElementsAndMembers());
    }

    return retVal;
  };

  /**
   * Must redefine .remove() because we need to reset the elements and members of parent organisms.
   * Same params as jQuery .remove().
   * Do not document.
   */
  const removeFnOrig = $.prototype.remove;

  $.prototype.remove = function () {
    const parentsToReset = [];

    for (const orgSelector1 of Object.keys($orgs)) {
      for (let i = 0; i < this.$members.length; i++) {
        if (this.$members[i].parent(orgSelector1).length) {
          parentsToReset.push($orgs[orgSelector1]);

          break;
        }
      }
    }

    removeFnOrig.apply(this);

    parentsToReset.forEach(parentToReset => parentToReset.resetElementsAndMembers());

    return this;
  };

  /**
### .resetElementsAndMembers()
Reset the organism's elements and members as they are added or removed. This is
necessary because neither jQuery nor Cheerio dynamically updates the indexed
elements or length properties on a saved jQuery or Cheerio component.
*/
  $.prototype.resetElementsAndMembers = function () {
    if (!this.selector || !(this.selector in $orgs)) {
      return;
    }

    const $orgReset = $(this.selector);
    let reset = false;

    if (this.length !== $orgReset.length) {
      reset = true;
    }
    else {
      for (let i = 0; i < this.length; i++) {
        if (this[i] !== $orgReset[i]) {
          reset = true;

          break;
        }
      }
    }

    if (reset) {
      for (let i = 0; i < this.length; i++) {
        delete this[i];
      }

      this.length = $orgReset.length;

      $orgReset.each((i, elem) => {
        this[i] = elem;
      });

      this.populateMembers();
    }
  };

  /**
### .setBoundingClientRect(rectObj, [memberIdx])
Give the ability to set `boundingClientRect` properties. Only for server-side
testing.

| Param | Type | Description |
| --- | --- | --- |
| rectObj | `object` | An object of `boundingClientRect` measurements. Does not need to include all of them. |
| [memberIdx] | `number`\|`number[]` | The index (or array of indices) of the organism member(s) if targeting one or more members. |
*/
  if (typeof global === 'object') {
    $.prototype.setBoundingClientRect = function (rectObj, memberIdx) {
      this.dispatchAction('setBoundingClientRect', rectObj, memberIdx);
    };
  }

  /**
   * Must redefine .text() because we may need to reset the elements and members of descendent organisms.
   * Same params as jQuery/Cheerio .text(). However, unlike jQuery, does not accept function params.
   * Do not document.
   */
  const textFnOrig = $.prototype.text;

  $.prototype.text = function () {
    const descendantsToReset = [];

    if (arguments.length) {
      for (const orgSelector1 of Object.keys($orgs)) {
        const $org1 = $orgs[orgSelector1];

        // Iterate through organisms and check if this organism (dispatching the 'text' action) is an ancestor.
        // This is much more efficient than searching through branches of descendants.
        for (let i = 0; i < this.length; i++) {
          if ($org1.parents(this[i]).length) {
            descendantsToReset.push($org1);

            break;
          }
        }
      }
    }

    const retVal = textFnOrig.apply(this, arguments);

    if (arguments.length) {
      this.resetElementsAndMembers();

      descendantsToReset.forEach(descendantToReset => descendantToReset.resetElementsAndMembers());
    }

    return retVal;
  };

  /**
### .updateMeasurements()
Update measurements on the state object as per changes to attributes and styles.

__Returns__: `boolean` - Whether or not to update state based on a change in measurement.

| Param | Type | Description |
| --- | --- | --- |
| state | `object` | The most recent state. |
| [member] | `object`\|`object[]` | The object (or array or objects) representing the organism member(s) (if targeting one or more members). |
| [memberIdx] | `number`\|`number[]` | The index (or array of indices) of the organism member(s) (if targeting one or more members). |
*/
  $.prototype.updateMeasurements = function (state, $member, memberIdx) {
    /* istanbul ignore if */
    if (typeof memberIdx === 'number' && !this[memberIdx]) {
      return false;
    }

    let computedStyle;
    let updateState = false;

    if (typeof window === 'object') { // jQuery
      if (this.selector !== 'window' && this.selector !== 'document') {
        if (Array.isArray($member) && Array.isArray(memberIdx)) {
          for (let i = 0; i < memberIdx.length; i++) {
            if (this[memberIdx[i]]) {
              computedStyle = window.getComputedStyle(this[memberIdx[i]]);

              break;
            }
          }
        }
        else if ($member && typeof memberIdx === 'number') {
          if ($member[0]) {
            computedStyle = window.getComputedStyle($member[0]);
          }
        }
        else {
          computedStyle = window.getComputedStyle(this[0]);
        }
      }
    }

    // Be sure to add to these if more measurements are added to the state object.
    for (const method of [
      'innerWidth',
      'innerHeight',
      'outerWidth',
      'outerHeight',
      'scrollLeft',
      'scrollTop',
      'width',
      'height'
    ]) {
      const args = [];

      getMeasurement(this, method, args, computedStyle, $member); // Mutates args.

      // eslint-disable-next-line eqeqeq
      if (state[method] != args[0]) { // Allow undefined == null to satisfy condition.
        store.dispatch({
          type: convertMethodToType(method),
          selector: this.selector,
          $org: this,
          method,
          args,
          memberIdx
        });

        updateState = true;
      }
    }

    if (this.selector === 'window' || this.selector === 'document') {
      return updateState;
    }

    const args = [];

    // Dependent on dispatches of other measurements to populate members.
    getBoundingClientRect(this, args, memberIdx); // Mutates args.

    for (const measurement in args[0]) {
      if (state.boundingClientRect[measurement] !== args[0][measurement]) {
        store.dispatch({
          type: 'SET_BOUNDING_CLIENT_RECT',
          selector: this.selector,
          $org: this,
          method: 'setBoundingClientRect',
          args,
          memberIdx
        });

        updateState = true;

        break;
      }
    }

    return updateState;
  };

// DO NOT REMOVE FOLLOWING COMMENT.
}; // end export default (requerio)

/* eslint-disable lines-around-comment */
/* eslint-disable max-len */

/**
 * Contracts for future states. Initial states contain empty values.
 * Do not to let states bloat for no reason (as it could with large .html or .textContent).
 * Be sure to update docs/state-object-defaults.md when updating any of these defaults.
 *
 * @param {string} orgSelector - The organism's selector.
 * @returns {object} Default state.
 */
function getStateDefault(orgSelector) {
  let stateDefault = {};

  if (orgSelector === 'window') {
    stateDefault = {
      data: {},
      innerWidth: null,
      innerHeight: null,
      outerWidth: null,
      outerHeight: null,
      scrollLeft: null,
      scrollTop: null,
      width: null,
      height: null
    };
  }
  else if (orgSelector === 'document') {
    stateDefault = {
      activeOrganism: null,
      data: {},
      scrollLeft: null,
      scrollTop: null,
      width: null,
      height: null
    };
  }
  else {
    stateDefault = {
      attribs: {},
      boundingClientRect: {
        width: null,
        height: null,
        top: null,
        right: null,
        bottom: null,
        left: null,
        x: null,
        y: null
      },
      classArray: [],
      classList: [], // DEPRECATED.
      css: {},
      data: {},
      html: null,
      innerHTML: null, // DEPRECATED.
      innerWidth: null,
      innerHeight: null,
      outerWidth: null,
      outerHeight: null,
      prop: {},
      scrollLeft: null,
      scrollTop: null,
      style: {}, // DEPRECATED.
      textContent: null,
      width: null,
      height: null,
      $members: [], // $members and members are not recursive, i.e. on organism states only, not on member states.
      members: null
    };
  }

  return stateDefault;
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
    const memberIdx = action.memberIdx;

    // attribs

    if ($org[0] && $org[0].attribs) { // Cheerio
      state.attribs = JSON.parse(JSON.stringify($org[0].attribs));
    }

    else if ($org[0] && $org[0].attributes && $org[0].attributes.length) { // jQuery
      for (let i = 0; i < $org[0].attributes.length; i++) {
        const attr = $org[0].attributes[i];
        state.attribs[attr.name] = attr.value;
      }
    }

    // classArray

    let classesForReduction = [];

    if (state.attribs && typeof state.attribs.class === 'string') {
      classesForReduction = state.attribs.class.trim() ? state.attribs.class.split(/\s+/) : [];
      state.classArray = classesForReduction;
      state.classList = state.classArray; // DEPRECATED.
    }

    // prop

    if (state.prop instanceof Object) {
      for (const i of Object.keys(state.prop)) {
        state.prop[i] = $org[0][i];
      }
    }

    switch (action.method) {

      /**
### addClass(classes)
For each submitted class, add that class to all matches which do not have that
class.

| Param | Type | Description |
| --- | --- | --- |
| classes | `string`\|`function` | A space-separated string, or a function that returns a space-separated string. |
*/
      case 'addClass': {
        // Handled by running the method as a side-effect and splitting the class attribute into an array and copying
        // that to .classArray. Not documenting acceptance of array arguments, even though jQuery does, because Cheerio
        // does not.
        break;
      }

      /**
### after(...content)
Add HTML content immediately after all matches.

| Param | Type | Description |
| --- | --- | --- |
| ...content | `string`\|`object`\|`array` | A string, a DOM (or DOM-like) element, a jQuery/Cheerio component, an array thereof, or a comma-separated combination thereof. |

### after(content)
Add HTML content immediately after all matches.

| Param | Type | Description |
| --- | --- | --- |
| content | `function` | A function that returns an HTML string. |
*/
      case 'after': {
        // Handled by running the method as a side-effect. Will reset elements and members of affected organisms.
        // Will not automatically update any state's .html.
        break;
      }

      /**
### append(...content)
Append HTML content to the innerHTML of all matches.

| Param | Type | Description |
| --- | --- | --- |
| ...content | `string`\|`object`\|`array` | A string, a DOM (or DOM-like) element, a jQuery/Cheerio component, an array thereof, or a comma-separated combination thereof. |

### append(content)
Append HTML content to the innerHTML of all matches.

| Param | Type | Description |
| --- | --- | --- |
| content | `function` | A function that returns an HTML string. |
*/
      case 'append': {
        // Handled by running the method as a side-effect. Will reset elements and members of affected organisms.
        break;
      }

      /**
### attr(attributes)
Set one or more attributes for all matches.

| Param | Type | Description |
| --- | --- | --- |
| attributes | `object` | An object of attribute:value pairs. A string value will add or update the corresponding attribute. A null value will remove the corresponding attribute. |
*/
      case 'attr': {
        if (action.args[0] instanceof Object && action.args[0].constructor === Object) {
          for (const i in action.args[0]) {
            state.attribs[i] = action.args[0][i];
          }
        }

        break;
      }

      /**
### before(...content)
Add HTML content immediately before all matches.

| Param | Type | Description |
| --- | --- | --- |
| ...content | `string`\|`object`\|`array` | A string, a DOM (or DOM-like) element, a jQuery/Cheerio component, an array thereof, or a comma-separated combination thereof. |

### before(content)
Add HTML content immediately before all matches.

| Param | Type | Description |
| --- | --- | --- |
| content | `function` | A function that returns an HTML string. |
*/
      case 'before': {
        // Handled by running the method as a side-effect. Will reset elements and members of affected organisms.
        // Will not automatically update any state's .html.
        break;
      }

      /**
### css(properties)
Set one or more CSS properties for all matches. Will set `state.css` as per the
getter below.

| Param | Type | Description |
| --- | --- | --- |
| properties | `object` | An object of property:value pairs to set. |

### css(properties)
Update `state.css` with the style set by Cheerio or jQuery `.css()`. In a DOM
environment, a snapshot of the real-time style will be keyed in camelCase. In
all environments, the static style key will be hyphenated.

| Param | Type | Description |
| --- | --- | --- |
| properties | `string`\|`string[]` | The name or names of properties to get from the element, and set on the state. |
*/
      case 'css': {
        // Copy the styles from the HTML style attribute to state.css in case a camelCase property was submitted without
        // a corresponding hyphenated property.
        if (state.attribs.style) {
          for (const style of state.attribs.style.split(';')) {
            const styleTrimmed = style.trim();

            if (styleTrimmed) {
              const styleSplit = styleTrimmed.split(':');

              state[action.method][styleSplit[0].trim()] = styleSplit[1].trim();
            }
          }
        }

        for (const i in action.args[0]) {
          state[action.method][i] = action.args[0][i];
        }

        state.style = state.css; // DEPRECATED.

        break;
      }

      /**
### data(keyValues)
Set one or more key:value pairs of data. Does not affect HTML data attributes.

| Param | Type | Description |
| --- | --- | --- |
| keyValues | `object` | An object of key:value pairs. |
*/
      case 'data': {
        if (action.args[0] instanceof Object && action.args[0].constructor === Object) {
          for (const i in action.args[0]) {
            state[action.method][i] = action.args[0][i];
          }
        }

        break;
      }

      /**
### detach()
Remove all matches from the DOM, but keep in memory in case they need to be reattached.
*/
      case 'detach': {
        // Handled by running the method as a side-effect. Will reset elements and members of affected parents.
        // Will not automatically update any state's .html.
        break;
      }

      /**
### empty()
Empty innerHTML of all matches.
*/
      case 'empty': {
        // Handled by running the method as a side-effect. Will reset elements and members of affected organisms.
        // Will not automatically update any state's .html.
        break;
      }

      // Internal. Do not document.
      case 'getBoundingClientRect': {
        if (action.args.length === 1) {
          if (
            typeof action.args[0] === 'object' && // Exclude functions. Don't assume what its constructor is.
            action.args[0] instanceof Object
          ) {

            // Must copy, not reference, but can't use JSON.parse(JSON.stringify()) or Object.assign because DOMRect is not a plain
            // object. Couldn't use Object.assign anyway because the bundler doesn't transpile that for IE support.
            const rectObj = action.args[0];

            for (const i in rectObj) {
              if (typeof rectObj[i] === 'number') {
                state.boundingClientRect[i] = rectObj[i];
              }
            }
          }
        }

        break;
      }

      /**
### height(value)
Set the height (not including padding, border, or margin) of all matches.

| Param | Type | Description |
| --- | --- | --- |
| value | `number`\|`string`\|`function` | The number of CSS pixels, a string representing the measurement, or a function returning the measurement. |
*/
      case 'height': {
        if (action.args.length === 1) {
          if (typeof action.args[0] === 'number') {
            state[action.method] = action.args[0];

            // If using Cheerio.
            if (typeof global === 'object' && global.$._root && global.$._root.attribs) {
              if (state.boundingClientRect) {
                state.boundingClientRect.height = action.args[0];
              }
            }
          }
        }

        break;
      }

      /**
### html(htmlString)
Set the innerHTML of all matches. Will set `state.html` as per the getter below.

| Param | Type | Description |
| --- | --- | --- |
| htmlString | `string` | A string of HTML. Functions are not supported. |

### html()
Dispatching an 'html' action without an htmlString parameter will set
`state.html` to the string value of the innerHTML of the actual element. Prior
to that, `state.html` will be null. Simply invoking `.getState()` where
`state.html` is null will not update `state.html`. However, once `state.html`
has been set to a string, subsequent invocations of `.getState()` will update
`state.html`. Set `state.html` only when necessary, since very large innerHTML
strings across many organisms with many members can add up to a large amount of
data.
*/
      case 'html': {
        // Only perform this update
        // IF there is an argument
        // AND
        //   this action is untargeted
        //   OR is targeted and is the member action (not the organism action).
        if (action.args.length === 1 && (typeof memberIdx === 'undefined' || !state.members)) {
          state[action.method] = action.args[0];
          state.innerHTML = state.html; // DEPRECATED.
        }

        break;
      }

      // Internal. Do not document.
      case 'innerHeight':
      case 'innerWidth':
      case 'outerWidth':
      case 'outerHeight': {
        if (action.args.length === 1) {
          if (typeof action.args[0] === 'number') {
            state[action.method] = action.args[0];
          }
        }

        break;
      }

      /**
### prepend(...content)
Prepend HTML content to the innerHTML of all matches.

| Param | Type | Description |
| --- | --- | --- |
| ...content | `string`\|`object`\|`array` | A string, a DOM (or DOM-like) element, a jQuery/Cheerio component, an array thereof, or a comma-separated combination thereof. |

### prepend(content)
Prepend HTML content to the innerHTML of all matches.

| Param | Type | Description |
| --- | --- | --- |
| content | `function` | A function that returns an HTML string. |
*/
      case 'prepend': {
        // Handled by running the method as a side-effect. Will reset elements and members of affected organisms.
        break;
      }

      /**
### prop(properties)
Set one or more properties for all matches. See https://api.jquery.com/prop/
for important distinctions between attributes and properties.

| Param | Type | Description |
| --- | --- | --- |
| properties | `object` | An object of property:value pairs. |
*/
      case 'prop': {
        if (action.args[0] instanceof Object && action.args[0].constructor === Object) {
          for (const i in action.args[0]) {
            state[action.method][i] = action.args[0][i];
          }
        }

        break;
      }

      /**
### remove()
Remove all matches from the DOM, and from memory.
*/
      case 'remove': {
        // Handled by running the method as a side-effect. Will reset elements and members of affected parents.
        // Will not automatically update any state's .html.
        break;
      }

      /**
### removeClass(classes)
For each submitted class, remove that class from all matches which have that
class.

| Param | Type | Description |
| --- | --- | --- |
| classes | `string`\|`function` | A space-separated string, or a function that returns a space-separated string. |
*/
      case 'removeClass': {
        // Handled by running the method as a side-effect and splitting the class attribute into an array and copying
        // that to .classArray. Not documenting acceptance of array arguments, even though jQuery does, because Cheerio
        // does not.
        break;
      }

      /**
### removeData(name)
Remove a previously-stored piece of data. Does not affect HTML attributes in the
DOM.

| Param | Type | Description |
| --- | --- | --- |
| name | `string` | A string naming the piece of data to delete. |

### removeData(list)
Remove previously-stored pieces of data. Does not affect HTML attributes in the
DOM.

| Param | Type | Description |
| --- | --- | --- |
| list | `string`\|`array` | A space-separated string or an array naming the pieces of data to delete. |
*/
      case 'removeData': {
        if (typeof action.args[0] === 'string') {
          if (action.args[0].indexOf(' ') > -1) {
            for (const key of action.args[0].split(' ')) {
              delete state.data[key];
            }
          }
          else {
            delete state.data[action.args[0]];
          }
        }
        else if (Array.isArray(action.args[0])) {
          for (let i = 0; i < action.args[0].length; i++) {
            delete state.data[action.args[0][i]];
          }
        }

        break;
      }

      /**
### scrollLeft(value)
Set the horizontal scroll position (the number of CSS pixels that are hidden
from view to the left of the scrollable area) of the match.

| Param | Type | Description |
| --- | --- | --- |
| value | `number` | The number to set the scroll position to. |
*/
      case 'scrollLeft': {
        if (action.args.length === 1) {
          if (typeof action.args[0] === 'number') {
            state[action.method] = action.args[0];
          }
        }

        break;
      }

      /**
### scrollTop(value)
Set the vertical scroll position (the number of CSS pixels that are hidden from
view above the scrollable area) of the match.

| Param | Type | Description |
| --- | --- | --- |
| value | `number` | The number to set the scroll position to. |
*/
      case 'scrollTop': {
        if (action.args.length === 1) {
          if (typeof action.args[0] === 'number') {
            state[action.method] = action.args[0];
          }
        }

        break;
      }

      /**
### setActiveOrganism(selector)
Only applicable if 'document' is an incepted organism. When a 'focus' action is
dispatched by an organism, this sets the 'document' organism's
`state.activeOrganism` to the selector of the focused organism. The
'setActiveOrganism' action can only be dispatched by the 'document' organism.

| Param | Type | Description |
| --- | --- | --- |
| selector | `string` | The identifying selector of the focused organism. |
*/
      case 'setActiveOrganism': {
        if ($org.selector === 'document') {
          state.activeOrganism = action.args[0] || null;
        }

        break;
      }

      /**
### setBoundingClientRect(boundingClientRect)
Copy properties of the boundingClientRect parameter over the corresponding
properties on `state.boundingClientRect`.

| Param | Type | Description |
| --- | --- | --- |
| boundingClientRect | `object` | An object of key:values. The object may contain one or more properties, but they must correspond to properties defined by the [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) class. |
*/
      case 'setBoundingClientRect': {
        if (
          typeof action.args[0] === 'object' && // Exclude functions. Don't assume what its constructor is.
          action.args[0] instanceof Object
        ) {
          const rectObj = action.args[0];

          // Must copy, not reference, but can't use JSON.parse(JSON.stringify()) or Object.assign because DOMRect is
          // not a plain object. Couldn't use Object.assign anyway because the bundler doesn't transpile that for IE
          // support.
          for (const measurement in state.boundingClientRect) {
            if (
              state.boundingClientRect[measurement] !== action.args[0][measurement] &&
              action.args[0][measurement] != null // eslint-disable-line eqeqeq
            ) {
              state.boundingClientRect[measurement] = action.args[0][measurement];
            }
          }

          // If this is dispatched on the server, we need to copy the rectObj to the state $members.
          if (typeof global === 'object' && global.$._root && global.$._root.attribs) {
            if (
              typeof memberIdx === 'number' &&
              state.$members[memberIdx]
            ) {
              for (const i in rectObj) {
                state.$members[memberIdx].boundingClientRect[i] = rectObj[i];
              }
            }
            else {
              for (let i = 0; i < state.$members.length; i++) {
                for (const j in rectObj) {
                  state.$members[i].boundingClientRect[j] = rectObj[j];
                }
              }
            }
          }
        }

        break;
      }

      /**
### text(text)
Set the textContent of all matches. This is a safer way to change text on the
DOM than dispatching an 'html' action. Will set `state.textContent` as per the
getter below.

| Param | Type | Description |
| --- | --- | --- |
| text | `string` | A string of text. Functions are not supported. |

### text()
Dispatching a 'text' action without a parameter will set `state.textContent` to
the textContent of the targeted element, or if untargeted, the textContent of
the first element. This contrasts with the return value of jQuery/Cheerio
`.text()` which concatenates the textContent of all matching elements. Prior to
the first 'text' action, `state.textContent` will be null. Simply invoking
`.getState()` where `state.textContent` is null will not update
`state.textContent`. However, once `state.textContent` has been set to a string,
subsequent invocations of `.getState()` will update `state.textContent`. Set
`state.textContent` only when necessary, since very large text strings across
many organisms with many members can add up to a large amount of data.
*/
      case 'text': {
        // Only perform this update
        // IF there is an argument
        // AND
        //   this action is untargeted
        //   OR is targeted and is the member action (not the organism action).
        if (action.args.length === 1 && (typeof memberIdx === 'undefined' || !state.members)) {
          state.textContent = action.args[0];
        }

        break;
      }

      /**
### toggleClass(classes)
For each submitted class, add or remove that class from all matches, depending
on whether or not the member has that class.

| Param | Type | Description |
| --- | --- | --- |
| classes | `string`\|`function` | A space-separated string, or a function that returns a space-separated string. |

### toggleClass(paramsArray)
For each submitted class, add or remove that class from all matches, depending
on a true/false switch.

| Param | Type | Description |
| --- | --- | --- |
| paramsArray | `array` | An array: where element 0 is a space-separated string, or a function that returns a space-separated string; and element 1 is a boolean switch, where true means add, false means remove. |
*/
      case 'toggleClass': {
        // Handled by running the method as a side-effect and splitting the class attribute into an array and copying
        // that to .classArray
        break;
      }

      /**
### val(value)
Set the value of all matches, typically form fields. This will set `state.val`.

| Param | Type | Description |
| --- | --- | --- |
| value | `string`\|`number` | The value to which to set the form field's value. Functions are not supported. |
*/
      case 'val': {
        if (action.args.length === 1) {
          // Coerce to string. It's the users' job to make sure they are submitting the right type.
          state[action.method] = action.args[0] + '';
          state.value = state.val; // DEPRECATED.
        }

        break;
      }

      /**
### width(value)
Set the width (not including padding, border, or margin) of all matches.

| Param | Type | Description |
| --- | --- | --- |
| value | `number`\|`string`\|`function` | The number of CSS pixels, a string representing the measurement, or a function returning the measurement. |
*/
      case 'width': {
        if (action.args.length === 1) {
          if (typeof action.args[0] === 'number') {
            state[action.method] = action.args[0];

            // If using Cheerio.
            if (typeof global === 'object' && global.$._root && global.$._root.attribs) {
              if (state.boundingClientRect) {
                state.boundingClientRect.width = action.args[0];
              }
            }
          }
        }

        break;
      }
    // DO NOT REMOVE FOLLOWING COMMENT.
    } // end switch (action.method)
  }
  catch (err) {
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
 * @param {function} [customReducer] - A custom reducer most likely purposed for custom methods.
 * @returns {function} A function configured to work on the orgSelector.
 */
function reducerClosure(orgSelector, customReducer) {

  /**
   * Clone an old state, update the clone based on an action, and return the clone.
   *
   * @param {object} prevState - Old state.
   * @param {object} action - An object with properties defining an action.
   * @returns {object} New state.
   */
  return function (prevState, action) {
    // If this is the reducer for the selected organism, reduce and return a new state.
    if (action.selector === orgSelector) {
      const memberIdx = action.memberIdx;
      const $org = action.$org;
      const stateDefault = getStateDefault(orgSelector);
      let state;

      try {
        // Clone old state into new state.
        state = JSON.parse(JSON.stringify(prevState));
      }
      catch (err) {
        // Clone default state into new state if prevState param is undefined.
        /* istanbul ignore next */
        state = JSON.parse(JSON.stringify(stateDefault));
      }

      // Update length of state.$members array to match length of $org.$members.
      if (state.$members) {
        if ($org.length < state.$members.length) {
          try {
            let i = state.$members.length;

            while (i--) {
              if (!$org[i]) {
                state.$members.pop();
              }
              else {
                break;
              }
            }
          }
          catch (err) {
            /* istanbul ignore next */
            console.error(err); // eslint-disable-line no-console
          }
        }

        else if ($org.length > state.$members.length) {
          try {
            // Populate $members array with clones of stateDefault if necessary.
            for (let i = 0; i < $org.length; i++) {
              if (!state.$members[i]) {
                state.$members[i] = JSON.parse(JSON.stringify(stateDefault));
              }
            }
          }
          catch (err) {
            /* istanbul ignore next */
            console.error(err); // eslint-disable-line no-console
          }
        }

        state.members = state.$members.length;
      }

      // Build new state for organism.
      stateBuild($org, state, action);

      // Build new state for selection in $members array.
      if (
        typeof memberIdx === 'number' &&
        $org.$members[memberIdx] &&
        state.$members[memberIdx]
      ) {
        stateBuild($org.$members[memberIdx], state.$members[memberIdx], action);
      }
      else if (Array.isArray(memberIdx)) {
        for (let i = 0; i < memberIdx.length; i++) {
          const idx = memberIdx[i];

          if ($org.$members[idx]) {
            stateBuild($org.$members[idx], state.$members[idx] || {}, action);
          }
        }
      }

      if (typeof customReducer === 'function') {
        const customState = customReducer(state, action, $org, prevState);

        // We need to validate customState because older versions of Requerio had the 4th constructor argument return an
        // object of action functions. We now want the 4th argument to be an optional custom reducer.
        if (
          typeof customState === 'object' && // Don't want to check constructor because this is user submitted.
          customState instanceof Object
        ) {
          for (const i of Object.keys(customState)) {
            if (typeof customState[i] === 'function') {
              // The older Requerio versions would have functions as properties of this object.
              // If this is the case, ignore the output of customReducer and return the state as built earlier.
              return state;
            }
          }

          return customState;
        }
      }

      return state;
    }

    // If this is not the reducer for the selected organism, return the unmutated state if submitted as a defined param.
    // Else return the default state.
    else {
      if (prevState) {
        return prevState;
      }
      else {
        return getStateDefault(orgSelector);
      }
    }
  };
}

/**
 * Combine organism-specific reducers for consumption by whole app.
 *
 * @param {object} $orgs - Organisms keyed by selector.
 * @param {object} Redux - Redux object.
 * @param {function} [customReducer] - A custom reducer most likely purposed for custom methods.
 * @returns {object} Combined reducers
 */
var reducerGet = ($orgs, Redux, customReducer) => {
  const reducers = {};

  for (const i of Object.keys($orgs)) {
    reducers[i] = reducerClosure(i, customReducer);
  }

  return Redux.combineReducers(reducers);
};

class Requerio {

  /**
   * @param {object} $ - jQuery or Cheerio.
   * @param {object} Redux - Redux.
   * @param {object} $organisms - Key:value pairs of selector names and null values.
   * @param {function} [customReducer] - Custom Redux reducer for extending the built-in reducer.
   * @param {function} [storeEnhancer] - A function to extend the Redux store with additional capabilities.
   */
  constructor($, Redux, $organisms, customReducer, storeEnhancer) {
    this.$ = $;
    this.Redux = Redux;
    this.$orgs = $organisms;
    this.customReducer = customReducer;
    this.storeEnhancer = storeEnhancer;
    this.store = null;
  }

  /**
   * A distinct initialization method allows end-users to extend this class and perform operations between instantiation
   * and initialization if desired.
   */
  init() {
    const reducer = reducerGet(this.$orgs, this.Redux, this.customReducer);
    this.store = this.Redux.createStore(reducer, this.storeEnhancer);

    prototypeOverride(this);
    organismsIncept(this.$orgs, this.$);
    postInception(this);
  }

  /**
   * @param {...string} selectors - jQuery/Cheerio selectors.
   */
  incept(...selectors) {
    const $organisms = {};

    for (let i = 0; i < selectors.length; i++) {
      const selector = selectors[i];

      if (typeof this.$orgs[selector] === 'undefined') {
        $organisms[selector] = null;
      }
    }

    organismsIncept($organisms, this.$);

    for (const i in $organisms) {
      this.$orgs[i] = $organisms[i];
    }

    postInception(this);

    const reducer = reducerGet(this.$orgs, this.Redux, this.customReducer);
    this.store.replaceReducer(reducer);
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

module.exports = Requerio;
