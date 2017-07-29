# Redux + jQuery + Cheerio = predictable client-side state + server-side testability

### Documentation to come!

#### If you want to experiment in the meantime, in Node:

```javascript
const fs = require('fs');
const path = require('path');

const cheerio = require('cheerio');
const Redux = global.Redux = require('redux');
const Requerio = require('requerio/dist/requerio-node');

const html = fs.readFileSync(path.resolve(__dirname, 'markup-you-want-to-test.html'), 'utf8');
const $ = global.$ = cheerio.load(html);

const $organisms = {
  '#main': null,
  '#main__section--0': null,
  '#main__section--1': null
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
```

#### On the client, in HTML:

```html
<script src="node_modules/redux/dist/redux.min.js"></script>
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>
```

#### On the client, in a JavaScript ES6 module:

```javascript
import RequerioClass from  './node_modules/requerio/src/requerio.js'; // MS Edge bug prevents same varname as classname.

const $organisms = {
  '#main': null,
  '#main__section--0': null,
  '#main__section--1': null
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

const requerio = new RequerioClass($, Redux, $organisms, actionsGet);
requerio.init();
```

Please report any bugs and submit contributions at 
https://github.com/electric-eloquence/requerio
