# Redux + jQuery + Cheerio = predictable client-side state + server-side testability

### Documentation to come!

#### If you want to experiment in the meantime, in Node.js:

```javascript
const fs = require('fs');
const path = require('path');

const cheerio = require('cheerio');
const Redux = global.Redux = require('redux');
const Requerio = require('requerio/dist/requerio.module');

const html = fs.readFileSync(path.resolve(__dirname, 'markup-you-want-to-test.html'), 'utf8');
const $ = global.$ = cheerio.load(html);

const $organisms = {
  'window': null,
  'html': null,
  'body': null,
  '#main': null,
  '.main__section--0': null,
  '.main__section--1': null
};

function actionsGet(requerio) {
  const $orgs = requerio.$orgs;

  return {
    mainHide: () => {
      $orgs['#main'].dispatchAction('css', ['display', 'none']);
    },

    mainShow: () => {
      $orgs['#main'].dispatchAction('css', ['display', 'block']);
    }
  };
}

const requerio = new Requerio($, Redux, $organisms, actionsGet);

requerio.init();

const actions = actionsGet(requerio);

/* Test here */
```

#### On the client, in HTML:

```html
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>
<script src="node_modules/redux/dist/redux.min.js"></script>
<script src="node_modules/requerio/dist/requerio.min.js"></script>
```

#### On the client, in JavaScript:

```javascript
var $organisms = {
  'window': null,
  'html': null,
  'body': null,
  '#main': null,
  '.main__section--0': null,
  '.main__section--1': null
};

function actionsGet(requerio) {
  var $orgs = requerio.$orgs;

  return {
    mainHide: function () {
      $orgs['#main'].dispatchAction('css', ['display', 'none']);
    },

    mainShow: function () {
      $orgs['#main'].dispatchAction('css', ['display', 'block']);
    }
  };
}

var requerio = new window.Requerio($, Redux, $organisms, actionsGet);

requerio.init();

var actions = actionsGet(requerio);

actions.mainHide();

setTimeout(function () {
  actions.mainShow();
}, 1000);
```

Please report any bugs and submit contributions at 
https://github.com/electric-eloquence/requerio
