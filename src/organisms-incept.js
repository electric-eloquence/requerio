/**
 * Populate $orgs values with jQuery or Cheerio objects.
 *
 * @param {object} $orgs - Organisms keyed by selector.
 * @param {object} $ - jQuery object.
 */
export default ($orgs, $) => {
  for (let i in $orgs) {
    if (!$orgs.hasOwnProperty(i)) {
      continue;
    }

    let $org;

    if (i === 'document') {
      if (typeof document === 'object') {
        $org = $(document);
      }
      else {
        $org = {};
      }
    }
    else if (i === 'window') {
      if (typeof window === 'object') {
        $org = $(window);
      }
      else {
        $org = {};
      }
    }
    else {
      $org = $(`${i}`);
    }

    // Cheerio doesn't have .selector property.
    // .selector property removed in jQuery 3.
    if (typeof $org.selector === 'undefined') {
      $org.selector = i;
    }

    /**
     * @property {array} $items
     * A true Array of the selection's numerically-keyed properties.
     * This is necessary for selection by class and tag, where results number more than one.
     * Members of this array will be fully-incepted organisms.
     */
    $org.$items = [];

    /**
     * @prop {function} $itemsReset - Empty and fill $org.$items array with organisms selected by jQuery/Cheerio.
     * @param {object} $orgReset - A copy, not reference, of the updated organism.
     * To be run on organism inception and dispatch of action.
     * Must only fill $items property of $orgs at top level of the $orgs object.
     */
    $org.$itemsReset = function ($orgReset) {
      $org.$items = [];

      $orgReset.each(function () {
        const $this = $(this);
        $this.parentSelector = i;

        $org.$items.push($this);
      });
    };

    if (i !== 'window') {
      const $orgReset = $(`${i}`);

      $org.$itemsReset($orgReset);
    }

    /**
     * Set methods that server-side tests are likely to depend on.
     * These methods come with client-side jQuery, but not with server-side Cheerio.
     * Just return empty values as defaults.
     */
    if ($org[0] && typeof $org[0].getBoundingClientRect === 'undefined') {

      /**
       * @return {object} Object of measurements.
       */
      $org[0].getBoundingClientRect = () => {
        const rectState = $org.getStore().getState()[$org.selector].boundingClientRect;

        for (let i in rectState) {
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
     * Give the ability to set boundingClientRect properties. Mostly useful for testing.
     *
     * @param {object} rectObj - Object of boundingClientRect measurements. Does not need to include all of them.
     * @param {number} [itemIdx] - Index of item if child item.
     */
    $org.setBoundingClientRect = (rectObj, itemIdx) => {
      $org.dispatchAction('setBoundingClientRect', rectObj, itemIdx);
    };

    if (typeof $org.scrollTop === 'undefined') {

      /**
       * @param {number} [num] - Distance.
       * @return {number} Measurement.
       */
      $org.scrollTop = num => {
        if (typeof num !== 'undefined') {
          $org._scrollTop = num;
        }

        return $org._scrollTop;
      };
    }

    if (typeof $org.width === 'undefined') {

      /**
       * @return {number} Measurement.
       */
      $org.width = () => {
        return 0;
      };
    }

    if (typeof $org.height === 'undefined') {

      /**
       * @return {number} Measurement.
       */
      $org.height = () => {
        return 0;
      };
    }

    $orgs[i] = $org;
  }
};
