# Redux + jQuery + Cheerio = predictable client-side state + server-side testability

### Documentation to come!

If you want to experiment in the meantime, in Node:

```
const fs = require('fs');
const path = require('path');
const Redux = global.Redux = require('redux');
const html = fs.readFileSync(path.resolve(__dirname, 'markup-you-want-to-test.html'), 'utf8');
const $ = global.$ = cheerio.load(html);
const Requerio = require('requerio/dist/requerio-node');

const $organisms = {
  '#main': null,
  '#main__section--0': null,
  '#main__section--1': null
};

function actionsClosure {
  return requerio => {
    const $orgs = requerio.$orgs;

    return {
      mainHide: () => {
        $orgs['#main'].dispatchAction('css', ['display', 'none']);
      }

      mainShow: () => {
        $orgs['#main'].dispatchAction('css', ['display', 'block']);
      },
    };
  };
}

const requerio = new Requerio($, Redux, $organisms, actionsClosure);
requerio.init();
```

On the client, in HTML:

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/redux/3.7.2/redux.min.js"></script>
<script src="http://code.jquery.com/jquery-3.2.1.slim.min.js"></script>
```

On the client, in a JavaScript ES6 module:

```
import RequerioClass from  './node_modules/requerio/src/requerio.js'; // MS Edge bug prevents same varname as classname.

const $organisms = {
  '#main': null,
  '#main__section--0': null,
  '#main__section--1': null
};

function actionsClosure {
  return requerio => {
    const $orgs = requerio.$orgs;

    return {
      mainHide: () => {
        $orgs['#main'].dispatchAction('css', ['display', 'none']);
      }

      mainShow: () => {
        $orgs['#main'].dispatchAction('css', ['display', 'block']);
      },
    };
  };
}

const requerio = new RequerioClass($, Redux, $organisms, actionsClosure);
requerio.init();
```

Please report any bugs and submit contributions at 
https://github.com/electric-eloquence/requerio
