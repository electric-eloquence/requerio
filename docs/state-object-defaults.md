# State Object Defaults
Do not to let states bloat for no reason (as it could with large html, textContent, etc.)

| Property | Type | Initial Value | Description |
| --- | --- | --- | --- |
| activeOrganism | `null`\|`string` | `null` | The element having focus. Only on states for `document`. |
| attribs | `object` | {} | Equivalent to the `.attribs` property of a Cheerio object. This consists of simple key-value pairs, and as such, is preferable to use for storing state than a replica of the much more complex DOM `Element.attributes` collection. |
| boundingClientRect | `object` | {<br>&nbsp;&nbsp;width:&nbsp;`null`,<br>&nbsp;&nbsp;height:&nbsp;`null`,<br>&nbsp;&nbsp;top:&nbsp;`null`,<br>&nbsp;&nbsp;right:&nbsp;`null`,<br>&nbsp;&nbsp;bottom:&nbsp;`null`,<br>&nbsp;&nbsp;left:&nbsp;`null`,<br>&nbsp;&nbsp;x:&nbsp;`null`,<br>&nbsp;&nbsp;y:&nbsp;`null`<br>} | A key-value copy of the object returned by `.getBoundingClientRect()` This object's properties are all of type `null` or `number`. Width and height for this object include padding and border, but not margin. |
| classArray | `array` | [] | An array of classes declared in the HTML `class` attribute. |
| css | `object` | {} | An object of CSS properties set by jQuery `.css()`. |
| data | `object` | {} | An object of data to be saved to the DOM. Must be a stringifiable instance of Object. |
| html | `null`\|`string` | `null` | To DOM `Element.innerHTML` spec. `null` means the html hasn't been touched by Requerio. `null` has a completely different meaning than empty string. |
| innerWidth | `null`\|`number` | `null` | In number of CSS pixels. Includes padding, but not border or margin. |
| innerHeight | `null`\|`number` | `null` | In number of CSS pixels. Includes padding, but not border or margin. |
| outerWidth | `null`\|`number` | `null` | In number of CSS pixels. Includes padding, border, and margin. |
| outerHeight | `null`\|`number` | `null` | In number of CSS pixels. Includes padding, border, and margin. |
| prop | `object` | {} | An object of `Element` properties set by jQuery `.prop()`. |
| scrollLeft | `null`\|`number` | `null` | The number of CSS pixels scrolled to the left of viewable area. |
| scrollTop | `null`\|`number` | `null` | The number of CSS pixels scrolled above the viewable area. |
| textContent | `null`\|`string` | `null` | To DOM `Node.textContent` spec. `null` means the textContent hasn't been touched by Requerio. `null` has a completely different meaning than empty string. Named `textContent` and not `text` because Requerio does not concatenate texts from multiple selections, like jQuery `.text()` does. It therefore more closely resembles `Node.textContent`. |
| val | `string` | `undefined` | A form input's value. Only on input element states. |
| width | `null`\|`number` | `null` | In number of CSS pixels. Does not include padding, border, or margin. |
| height | `null`\|`number` | `null` | In number of CSS pixels. Does not include padding, border, or margin. |
| $members | `object` | `[]` | The states of the members of the selection. On organism states only, not on member states. |
| members | `number` | `undefined` | The number of members belonging to the selection. On organism states only, not on member states. |
