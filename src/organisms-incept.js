'use strict';

/**
 * Populate $orgs values with jQuery or Cheerio objects.
 *
 * @param {object} $orgs
 */
export default $orgs => {

  for (let i in $orgs) {
    if (!$orgs.hasOwnProperty(i)) {
      continue;
    }

    const $org = $(`${i}`);

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
     * @property {function} $itemsReset - Empty and fill $org.$items array with organisms selected by jQuery/Cheerio.
     * @param {object} $orgReset - A copy, not reference, of the updated organism.
     * To be run on organism inception and dispatch of action.
     * Must only fill $items property of $orgs at top level of the $orgs object.
     */
    $org.$itemsReset = function ($orgRest) {
      $org.$items = [];

      $orgReset.each(function () {
        const $this = $(this);

        $this.$parentSelector = i;
        $org.$items.push($this);
      });
    };

    const $orgReset = $(`${i}`);

    $org.$itemsReset($orgReset);

    /**
     * Set functions that enable server-side tests to run by returning empty values as defaults.
     */
    if (typeof global === 'object') {
      $org.scrollTop = () => {
        return 0;
      };
      $org.width = () => {
        return 0;
      };
      $org.height = () => {
        return 0;
      };
    }

    $orgs[i] = $org;
  }
};
