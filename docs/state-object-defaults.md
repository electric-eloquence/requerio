# State Object Defaults
Do not to let states bloat for no reason (as it could with large innerHTML, textContent, etc.)

| Property | Type | Initial Value | Description |
| --- | --- | --- | --- |
| attribs | `object` | {} | Equivalent to the `.attribs` property of a Cheerio object. This consists of simple key-value pairs, and as such, is preferable to use for storing state than a replica of the much more complex `Element.attributes` collection, as utilized by jQuery. The `.attribs` property is not documented in the Cheerio documentation, and may change without notice. However, this is unlikely, since it is derived from its htmlparser2 dependency. The htmlparser2 package has had this property since its initial release and its public position is that this won't change. https://github.com/fb55/htmlparser2/issues/35 https://github.com/cheeriojs/cheerio/issues/547 |
| boundingClientRect | `object` | {<br>&nbsp;&nbsp;width:&nbsp;`null`,<br>&nbsp;&nbsp;height:&nbsp;`null`,<br>&nbsp;&nbsp;top:&nbsp;`null`,<br>&nbsp;&nbsp;right:&nbsp;`null`,<br>&nbsp;&nbsp;bottom:&nbsp;`null`,<br>&nbsp;&nbsp;left:&nbsp;`null`<br>} | A key-value copy of the object returned by `.getBoundingClientRect()` (minus `.x` and `.y` for cross-browser compatibility). This object's properties are all of type `null` or `number`. Width and height for this object include padding and border, but not margin. |
| classArray | `array` | [] | An array of CSS classes. |
| css | `object` | {} | An object of CSS properties set by jQuery or Cheerio `.css()`. |
| data | `object` | {} | An object of data saved by jQuery or Cheerio `.data()`. Does not correspond to HTML data attributes. |
| html | `null`\|`string` | `null` | To DOM `Element.innerHTML` spec. `null` means the initial innerHTML state wasn't modified. `null` has a completely different meaning than empty string. |
| innerWidth | `null`\|`number` | `null` | In number of CSS pixels. Includes padding, but not border or margin. |
| innerHeight | `null`\|`number` | `null` | In number of CSS pixels. Includes padding, but not border or margin. |
| outerWidth | `null`\|`number` | `null` | In number of CSS pixels. Includes padding, border, and margin. |
| outerHeight | `null`\|`number` | `null` | In number of CSS pixels. Includes padding, border, and margin. |
| prop | `object` | {} | An object of HTML properties set by jQuery or Cheerio `.prop()`. |
| scrollLeft | `null`\|`number` | `null` | The number of CSS pixels scrolled to the left of viewable area. |
| scrollTop | `null`\|`number` | `null` | The number of CSS pixels scrolled above the viewable area. |
| text | `null`\|`string` | `null` | To DOM `Element.textContent` spec. `null` means the initial textContent state wasn't modified. `null` has a completely different meaning than empty string. |
| val | `string` | `undefined` | Only defined on input element states. |
| width | `null`\|`number` | `null` | In number of CSS pixels. Does not include padding, border, or margin. |
| height | `null`\|`number` | `null` | In number of CSS pixels. Does not include padding, border, or margin. |
| $members | `array` | [] | The state of the members belonging to the selection. (A tag or class can select multiple members.) |
