
## addClass(classes)
For each submitted class, add that class to all matched elements which do not already have that class.

| Param | Type | Description |
| --- | --- | --- |
| classes | `string` \| `function` | A space-separated string, or a function that returns a space-separated string. |

## removeClass(classes)
For each submitted class, remove that class from all matched elements which have that class.

| Param | Type | Description |
| --- | --- | --- |
| classes | `string` \| `function` | A space-separated string, or a function that returns a space-separated string. |

## toggleClass(classes, [switch])
For each submitted class, add or remove that class from all matched elements, depending on whether or not the element has that class, or depending on the value of the switch parameter.

| Param | Type | Description |
| --- | --- | --- |
| classes | `string` \| `function` | A space-separated string, or a function that returns a space-separated string. |
| switch | `boolean` | `true` means add, `false` means remove. |

## attr(attributeName, value)
Set an attribute for all matched elements.

| Param | Type | Description |
| --- | --- | --- |
| attributeName | `string` | The name of the attribute to set. |
| value | `string` \| `function` \| `null` | The value to set the attribute to. If `null`, the specified attribute will be removed. |

## attr(attributes)
Set one or more attributes for all matched elements.

| Param | Type | Description |
| --- | --- | --- |
| attributes | `object` | An object of attribute-value pairs to set. |

## css(propertyName, value)
Set a CSS property for all matched elements.

| Param | Type | Description |
| --- | --- | --- |
| propertyName | `string` | The name of the property to set. |
| value | `string` \| `function` | The value to set the property to. |

## css(properties)
Set one or more CSS properties for all matched elements.

| Param | Type | Description |
| --- | --- | --- |
| properties | `object` | An object of property-value pairs to set. |

## setBoundingClientRect(boundingClientRect)
Copy properties of the `boundingClientRect` parameter over corresponding properties on `state.boundingClientRect`.

| Param | Type | Description |
| --- | --- | --- |
| boundingClientRect | `object` | An object of key-values. The object may contain one or more properties, but they must correspond to properties defined by the [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) class, with the exception of `.x` and `.y` (as per compatibility with Microsoft browsers). |

## height(value)
Set the height (not including padding, border, or margin) of all matched elements.

| Param | Type | Description |
| --- | --- | --- |
| value | `number` \| `string` \| `function` | The number of CSS pixels, a string representing the measurement, or a function returning the measurement. |

## html(htmlString)
Set the innerHTML of all matched elements.

| Param | Type | Description |
| --- | --- | --- |
| htmlString | `string` \| `function` | A string of HTML or a function returning HTML. |

## innerWidth(value)
Set the innerWidth (including padding, but not border or margin) of all matched elements.

| Param | Type | Description |
| --- | --- | --- |
| value | `number` \| `string` \| `function` | The number of CSS pixels, a string representing the measurement, or a function returning the measurement. |

## innerHeight(value)
Set the innerHeight (including padding, but not border or margin) of all matched elements.

| Param | Type | Description |
| --- | --- | --- |
| value | `number` \| `string` \| `function` | The number of CSS pixels, a string representing the measurement, or a function returning the measurement. |

## scrollTop(value)
Set the vertical scroll position (the number of CSS pixels that are hidden from view above the scrollable area) of all matched elements.

| Param | Type | Description |
| --- | --- | --- |
| value | `number` | The number to set the scroll position to. |

## width(value)
Set the width (not including padding, border, or margin) of all matched elements.

| Param | Type | Description |
| --- | --- | --- |
| value | `number` \| `string` \| `function` | The number of CSS pixels, a string representing the measurement, or a function returning the measurement. |
