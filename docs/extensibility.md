# Extensibility

#### The `$` prototype can be extended before it is submitted to the Requerio constructor.

```javascript
$.prototype.killExtensibility = function () {
  delete $.prototype;
};
```

#### A custom reducer function can be submitted to Requerio as well.

`customReducer` is run as part of Requerio's built-in reducer. In state management, it is crucial that new states are 
copied from, and dereferenced from, old states in the process of reduction. But this is not necessary in the 
`customReducer` function. The state, as submitted to `customReducer`, is a work in progress. It has already been 
dereferenced from the old state earlier, and will be submitted to Redux as the new state after this function returns.

```javascript
function customReducer(state, action) {
  // In Requerio, reduction is keyed off of action.method (not action.type).
  switch (action.method) {
    case 'killExtensibility':
      state.extensible = false;
      break;
  }

  return state;
}
```

#### Requerio also accepts custom Redux middleware.

`customMiddleware` is plugged into the Redux store upon creation of the store. It runs before the reducer. A common (and 
well-documented) use-case for Redux middleware is asynchronous operation.

```javascript
const customMiddleware = store => next => action => {
  switch (action.method) {
    case 'timebombExtensibility':
      action.promise = new Promise(resolve => {
        setTimeout(() => {
          action.$org.dispatchAction('killExtensibility');
          resolve('MECHANIC: SOMEBODY SET UP US THE BOMB.');
        }, 10000);
      });

      return next(action);

    default:
      return next(action);
  }
};
```

This middleware declares a `timebombExtensibility` method, which in turn dispatches the `killExtensibility` method 10 
seconds later. Dispatching an action returns the action object. In this example, the promise is returned as the 
`.promise` property.

```javascript
requerio.$orgs['#main'].dispatchAction('timebombExtensibility').promise.then(
  res => {console.log(res);},
  err => {console.error(err);}
);

```

#### The action object.

The action object passed into Requerio reducers and middleware comes with these properties by default:

| Property | Type | Description |
| --- | --- | --- |
| type | `string` | Required by Redux. Always empty string in Requero. |
| selector | `string` | The organism's identifying selector. |
| $org | `object` | The organism instance. |
| memberIdx | `number` \| `undefined` | The index of the targeted organism member (if any). |
| method | `string` | The method being applied. |
| args | `array` | The arguments being submitted to the method. |

The action object can be extended as demonstrated in the middleware example, wherein a `.promise` property was added.

#### Instantiate, initialize, and dispatch.

```javascript
const requerio = new Requerio($, Redux, $organisms, customReducer, customMiddleware);
requerio.init();
requerio.$orgs['#main'].dispatchAction('killExtensibility');
// Do it again 10 seconds later.
requerio.$orgs['#main'].dispatchAction('timebombExtensibility').promise.then(
  res => {console.log(res);},
  err => {console.error(err);}
);
```
