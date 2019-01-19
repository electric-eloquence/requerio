# Requerio API

## Organism Methods

These methods are made available on organisms after inception. The organisms are 
members of Requerio's `$orgs` property and are keyed by their selector. For 
example:

```javascript
requerio.$orgs['#main'].dispatchAction('css', ['color', 'green']);
```

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN `npm run doc` TO UPDATE -->
<!-- START GENERATED API DOC -->


### .dispatchAction(method, [args], [memberIdx])
Dispatches actions for reduction. Side-effects occur here (not in the reducer).
1. Apply the jQuery or Cheerio method.
2. Apply any additional changes.
3. Call the Redux store.dispatch() method.

__Returns__: `object` - The dispatched action object.

| Param | Type | Description |
| --- | --- | --- |
| method | `string` | The name of the method on the organism's object prototype. |
| [args] | `*` | This param contains the values to be passed as arguments to `method`. `null` or an empty `array` may be submitted if not passing arguments, but targeting a `memberIdx`. |
| [memberIdx] | `number` | The index of the organism member (if targeting a member). |

### .getState([memberIdx])
A reference to Redux `store.getState()`.

__Returns__: `object` - The organism's state.

| Param | Type | Description |
| --- | --- | --- |
| [memberIdx] | `number` | The index of the organism member (if targeting a member). |

### .getStore()
A reference to Redux `store`.

__Returns__: `object` - This app's state store.

### .populateMembers()
(Re)populate an organism's `.$members` property with its (recalculated) members. `.$members` are jQuery/Cheerio objects,
not fully incepted organisms.

__Returns__: `undefined`

### .setBoundingClientRect(rectObj, [memberIdx])
Give the ability to set `boundingClientRect` properties. Only for server-side testing.

__Returns__: `undefined`

| Param | Type | Description |
| --- | --- | --- |
| rectObj | `object` | Object of `boundingClientRect` measurements. Does not need to include all of them. |
| [memberIdx] | `number` | The index of the organism member (if targeting a member). |
<!-- STOP GENERATED API DOC -->

## Additional Documentation

* [Action Methods](methods.md)
* [State Object Defaults](state-object-defaults.md)
* [Extensibility](extensibility.md)
