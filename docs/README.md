# Requerio API

## Organism Methods

These methods are made available on organisms after inception. The organisms are members of Requerio's `$orgs` property 
and are keyed by their selector. For example:

```javascript
requerio.$orgs['#main'].dispatchAction('css', ['color', 'green']);
```

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN `npm run doc` TO UPDATE -->
<!-- START GENERATED API DOC -->


### .dispatchAction(method, args, [memberIdx])
A shorthand for dispatching state actions.
1. Apply the jQuery or Cheerio method.
2. Apply any additional changes.
3. Call the Redux store.dispatch() method.

__Returns__: `object` - The new application state.

| Param | Type | Description |
| --- | --- | --- |
| method | `string` | The name of the method native to the component's object prototype. |
| args | `*` | This param contains the values to be passed as arguments to `method`. `args` may be of type `array`, `string`, `number`, `object`, or `function`.  |
| [memberIdx] | `number` | Index of member if targeting a member. |

### .getState([memberIdx])
A reference to Redux store.getState().

__Returns__: `object` - The organism's state.

| Param | Type | Description |
| --- | --- | --- |
| [memberIdx] | `number` | Index of member if targeting a member. |

### .getStore()
A reference to Redux store.

__Returns__: `object` - This app's state store.

### .$membersPopulate()
(Re)populate an organism's `.$members` property with its (recalculated) members.

__Returns__: `undefined`

### .setBoundingClientRect(rectObj, [memberIdx])
Give the ability to set boundingClientRect properties. Only for server-side testing.

__Returns__: `undefined`

| Param | Type | Description |
| --- | --- | --- |
| rectObj | `object` | Object of boundingClientRect measurements. Does not need to include all of them. |
| [memberIdx] | `number` | Index of member if child member. |
<!-- STOP GENERATED API DOC -->

## Additional Documentation

* [Action Methods](methods.md)
* [State Object Defaults](state-object-defaults.md)
* [Extensibility](extensibility.md)
