# Redux + jQuery + Cheerio = predictable client-side state + server-side testability

[![Known Vulnerabilities][snyk-image]][snyk-url]
[![Mac/Linux Build Status][travis-image]][travis-url]
[![Windows Build Status][appveyor-image]][appveyor-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![License][license-image]][license-url]

### BREAKING CHANGE!

As of [v0.5.0](https://github.com/electric-eloquence/requerio/releases/tag/v0.5.0),
Requerio is far more strict about accepting arrays as the 2nd parameter for 
`.dispatchAction()`. Only a few action methods allow such arrays. They are 
restricted to 
[after](docs/methods.md#aftercontent), 
[append](docs/methods.md#appendcontent), 
[before](docs/methods.md#beforecontent), 
[prepend](docs/methods.md#prependcontent), and 
[toggleClass](docs/methods.md#toggleclassclasses).

While Requerio was named with Cheerio in mind, Cheerio is optional and can be 
replaced by jQuery on the server via JSDOM, or any other DOM emulator. Cheerio 
is significantly lighter than jQuery + JSDOM, but it is difficult to predict the 
quality of Cheerio's future maintenance.

#### Install:

```shell
npm install requerio redux cheerio
```

##### - or -

```shell
npm install requerio redux jquery jsdom
```

#### Declare `$`:

```javascript
const cheerio = require('cheerio');
const html = fs.readFileSync('./index.html', 'utf8');
const $ = global.$ = cheerio.load(html);
```

##### - or -

```javascript
const {JSDOM} = require('jsdom');
const html = fs.readFileSync('./index.html'), 'utf8');
const {window} = new JSDOM(html);
global.window = window;
global.document = window.document;
const $ = global.$ = global.jQuery = require('jquery');
```

##### - or -

```html
<script src="jquery.min.js"></script>
```

#### Declare `Redux`:

```javascript
const Redux = global.Redux = require('redux');
```

##### - or -

```html
<script src="redux.min.js"></script>
```

#### Declare `Requerio`:

```javascript
const Requerio = require('requerio');
```

##### - or -

```html
<script src="requerio.min.js"></script>
```

#### Declare `$organisms`:

At declaration, organisms are just empty namespaces.

```javascript
const $organisms = {
  '#yoda': null,
  '.midi-chlorian': null
};
```

#### Instantiate `requerio`:

```javascript
const requerio = new Requerio($, Redux, $organisms);
```

#### Initialize `requerio`:

```javascript
requerio.init();
```

#### Use:

```javascript
// During initialization, the null `$organisms['#yoda']` underwent
// inception into Requerio organism `requerio.$orgs['#yoda']`. This
// organism has properties, methods, and state. It is home to the
// `.midi-chlorian` organisms. (A productive biome would want them to
// be symbionts and not parasites!) To demonstrate that `#yoda` is
// alive and stateful, let's dispatch a `css` action to give it a
// `color:green` style property.
requerio.$orgs['#yoda'].dispatchAction('css', {color: 'green'});

// This action will turn the organism's text green in the browser.
// We can observe its state after dispatching the action.
const mainState = requerio.$orgs['#main'].getState();

// In Node, we can test to ensure the action updated the state correctly.
assert.equal(mainState.style.color, 'green');
```

[Why Requerio?](docs/why-requerio.md)

[API docs](docs/README.md)

### Methods supported:

* [addClass](docs/methods.md#addclassclasses)
* [after](docs/methods.md#aftercontent)
* [append](docs/methods.md#appendcontent)
* [attr](docs/methods.md#attrattributes)
* [before](docs/methods.md#beforecontent)
* [css](docs/methods.md#cssproperties)
* [data](docs/methods.md#datakeyvalues)
* [height](docs/methods.md#heightvalue)
* [html](docs/methods.md#htmlhtmlstring)
* [innerHeight](docs/methods.md#innerheightvalue)
* [innerWidth](docs/methods.md#innerwidthvalue)
* [prepend](docs/methods.md#prependcontent)
* [removeClass](docs/methods.md#removeclassclasses)
* [scrollTop](docs/methods.md#scrolltopvalue)
* [setActiveOrganism](docs/methods.md#setactiveorganismselector)
* [setBoundingClientRect](docs/methods.md#setboundingclientrectboundingclientrect)
* [toggleClass](docs/methods.md#toggleclassclasses)
* [val](docs/methods.md#valvalue)
* [width](docs/methods.md#widthvalue)
* [blur](docs/methods.md#blur)
* [focus](docs/methods.md#focus)

#### See also the <a href="https://github.com/electric-eloquence/requerio/tree/master/examples" target="_blank">code examples</a>.

[snyk-image]: https://snyk.io/test/github/electric-eloquence/requerio/master/badge.svg
[snyk-url]: https://snyk.io/test/github/electric-eloquence/requerio/master

[travis-image]: https://img.shields.io/travis/electric-eloquence/requerio/master.svg?label=mac%20%26%20linux
[travis-url]: https://travis-ci.org/electric-eloquence/requerio

[appveyor-image]: https://img.shields.io/appveyor/ci/e2tha-e/requerio/master.svg?label=windows
[appveyor-url]: https://ci.appveyor.com/project/e2tha-e/requerio

[coveralls-image]: https://img.shields.io/coveralls/electric-eloquence/requerio/master.svg
[coveralls-url]: https://coveralls.io/r/electric-eloquence/requerio

[license-image]: https://img.shields.io/github/license/electric-eloquence/requerio.svg
[license-url]: https://raw.githubusercontent.com/electric-eloquence/requerio/master/LICENSE
