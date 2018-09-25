---
layout: post
title: LitElement with Rollup, Babel & Karma
description: A brief example of how to set up LitElement with Rollup, Babel & Karma
---

[LitElement](https://github.com/Polymer/lit-element) is a cool new project
from the [Polymer](https://www.polymer-project.org/) team. It serves as a great
base to start from when building
[web components](https://developer.mozilla.org/en-US/docs/Web/Web_Components),
providing common necessities such as data binding, performant template
rendering and life-cycle methods.

As a regular contributor to many Polymer projects, I find myself playing
around with Lit quite a lot. Things appear to be fine, everything nicely
structured and everything works just as the team has defined...

However, in reality, a _lot_ of people who discover Polymer and Lit will be
coming from backgrounds where they have used something completely different or
at least something with a very different development workflow.

One of those common workflows is the combination of
[Rollup](https://rollupjs.org/guide/en), [Babel](https://babeljs.io/) and
[Karma](https://karma-runner.github.io/2.0/index.html).

So let's take a look at how we can apply those while using LitElement...

## Project Structure

To begin with, I threw up a pretty basic project structure:

```
- src/
  - my-element.js
  - index.js
- package.json
- package-lock.json
- .editorconfig
```

The idea is that we will use Babel to transpile our sources into a `lib/`
directory and use Rollup to bundle those into a `bundle.js`.

## Our Element

Our obvious dependencies are needed as a start:

```
$ npm i -S @polymer/lit-element
```

The element being used for this setup is as follows:

```js
// src/my-element.js
import {LitElement, html, property} from '@polymer/lit-element';

export class MyElement extends LitElement {
  @property({type: String})
  foo = 'test';

  render() {
    return html`<h1>${this.foo}</h1>`;
  }
}

customElements.define('my-element', MyElement);

// src/index.js
export {MyElement} from './my-element';
```

As you can see, it is fairly straight forward. More information on the
lifecycle methods and property setup can be found
[here](https://github.com/Polymer/lit-element) and
[here](https://43081j.com/2018/08/future-of-polymer).

We're just defining a very simple element which renders its only property,
`foo`.

## Babel

First of all, we need to install Babel along with any plugins and presets:

```
$ npm i -D @babel/core @babel/cli @babel/preset-env
$ npm i -D @babel/plugin-proposal-class-properties @babel/plugin-proposal-decorators
```

The first three are pretty much to allow us to transpile from ES2015 and beyond
to a given level (in our case, to ES modules).

The two plugins are needed to allow us the use of Lit's decorators as you
saw above:

```js
export class MyElement extends LitElement {
  @property({type: String})
  foo = 'test';
  /* ... */
}
```

After installing these, a very simple
[babelrc](https://babeljs.io/docs/en/next/config-files) will do:

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false,
        "targets": {
          "esmodules": true
        }
      }
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-proposal-decorators",
      { "legacy": true }
    ],
    [
      "@babel/plugin-proposal-class-properties",
      { "loose": true }
    ]
  ]
}
```

To try explain this a little, we:

* Enable [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env)
to turn on common Babel features
* Disable module generation (`"modules": false`) to prevent Babel
outputting CommonJS modules but rather have it output ES Modules
* Enable the ES modules target so only browsers which support it
are targeted
* Enable _legacy_ decorators (until LitElement supports the newer
decorator proposal)
* Enable _loose_ class properties (until we can stop using legacy decorators)

This combination of things will result in us being able to use the
provided decorators and have our element properties defined as class
properties.

If we didn't have any of this, our class would instead use the static
properties getter:

```js
export class MyElement extends LitElement {
  static get properties() {
    return {
      foo: { type: String }
    };
  }
}
```

Now if we:

```
$ node_modules/.bin/babel src -d lib
Successfully compiled 2 files with Babel.
```

We will have a populated `lib/` directory containing our transpiled
sources.

We should add this as a script in `package.json` to make things easier:

```json
"scripts": {
  "build": "babel src -d lib",
}
```

So we can:

```
$ npm run build
Successfully compiled 2 files with Babel.
```

## ESLint (optional)

It is fairly easy from this point to add ESLint to the workflow, though
not required at all:

```
$ npm i -D eslint babel-eslint eslint-plugin-lit
```

`babel-eslint` is an ESLint parser so we can have ESLint directly understand
our pre-transpiled sources.
[`eslint-plugin-lit`](https://github.com/43081j/eslint-plugin-lit)
introduces some handy lint rules specific to Lit.

I used a config like so:

```json
{
  "extends": "eslint:recommended",
  "parser": "babel-eslint",
  "rules": {
    "lit/no-legacy-template-syntax": "warn"
  },
  "plugins": ["lit"]
}
```

You can add whichever rules you want from the Lit plugin, or none at all
if you wish.

Then you can simply introduce a new NPM script:

```json
"scripts": {
  "build": "babel src -d lib",

  "lint": "eslint \"src/**/*.js\""
}
```

To run:

```
$ npm run lint
```

Simple!

## Rollup

So far, we do have some sources a browser can understand. However, we do
not have support for Node (CommonJS) modules or the Node resolution algorithm.

This is where Rollup comes in:

```js
// without Rollup or a loader/polyfill
import {LitElement} from './node_modules/@polymer/lit-element/lit-element.js';

// with Rollup
import {LitElement} from '@polymer/lit-element';
import someModule from 'a-node-module';
```

If we use Rollup, we can use all our Node modules as normal and simply
have them bundled at build time.

Installing is pretty simple:

```
$ npm i -D rollup rollup-plugin-commonjs rollup-plugin-node-resolve
```

The two plugins here give Rollup a helping hand with resolving Node
dependencies and understanding CommonJS modules (as opposed to the more
modern ES modules).

We can then throw up a config file as simple as:

```js
import resolve from 'rollup-plugin-node-resolve';
import common from 'rollup-plugin-commonjs';

export default {
  input: 'lib/index.js',
  output: {
    file: 'bundle.js',
    format: 'esm'
  },
  plugins: [
    common(),
    resolve()
  ]
};
```

This is as simple as it looks, it will use the two plugins mentioned earlier
and bundle our `lib/index.js` along with its dependencies into a `bundle.js`.

We can now introduce yet another NPM script:

```json
"scripts": {
  "build": "babel src -d lib",
  "lint": "eslint \"src/**/*.js\"",

  "bundle": "npm run build && rollup -c"
}
```

You can see how we chained the Babel build so when we call:

```
$ npm run bundle
```

We will actually transpile the sources, then bundle the output.

Now if we were to load our bundle in a browser:

```html
<script type="module" src="bundle.js"></script>
```

We would make `<my-element>` available just as expected.

## Karma

The last piece of the puzzle, which nobody should ever forget about, is testing!

You may be wondering why we don't use something like Jest here. The answer to
that is very simple: Jest does not (yet?) support browser testing; instead it
uses JSDOM which does not yet support the web components APIs.

So, for now (or if you prefer Karma), we can use Karma instead:

```
$ npm i -D karma karma-chrome-launcher karma-mocha chai
```

This is a pretty common bunch of dependencies: Karma with
[Mocha](https://mochajs.org/) support and [Chai](https://www.chaijs.com/)
assertions.

We can also install [Puppeteer](https://github.com/GoogleChrome/puppeteer)
to automatically download an appropriate Chrome binary for us:

```
$ npm i -D puppeteer
```

Our `karma.conf.js` is simple too:

```js
// Trick to use the auto-downloaded puppeteer chrome binary
process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      'bundle.test.js'
    ],
    reporters: ['progress'],
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: false
  });
}
```

We are going to create a second bundle specifically for tests
(`bundle.test.js`) and want to use headless Chrome.

To create this second bundle, firstly we need another rollup plugin:

```
$ npm i -D rollup-plugin-multi-entry
```

The reason for this is that Rollup doesn't provide multiple
entry point support by default, rather it expects a single entry point and
a single output (`src/index.js -> lib/index.js`).

With this plugin, we can now create a `rollup.test.config.js`:

```js
import resolve from 'rollup-plugin-node-resolve';
import common from 'rollup-plugin-commonjs';
import multiEntry from 'rollup-plugin-multi-entry';

export default {
  input: 'lib/test/**/*.js',
  output: {
    file: 'bundle.test.js',
    format: 'esm'
  },
  plugins: [
    common({
      namedExports: {
        'chai': ['expect']
      }
    }),
    resolve(),
    multiEntry()
  ]
};
```

This is all fairly simple... we now use a glob input (`lib/test/**/*.js`)
and have added `multiEntry()` as a plugin.

We have also specified `namedExports` because the Rollup plugin has trouble
automatically detecting what `chai` exports, unfortunately.

Another two NPM scripts are then added:

```json
"scripts": {
  "build": "babel src -d lib",
  "lint": "eslint \"src/**/*.js\"",
  "bundle": "npm run build && rollup -c",

  "bundle:test": "npm run build && rollup -c rollup.test.config.js",
  "test": "npm run bundle:test && karma start --singleRun"
}
```

The first (`bundle:test`) simply runs our existing Babel build
and calls Rollup with our `rollup.test.config.js`.

The second (`test`) will run `bundle:test` and start the karma launcher
to execute our test suite.

### Example Test

An example test would be `src/test/my-element.js`:

```js
import {expect} from 'chai';
// Very important to ensure any elements we test are loaded
import '../my-element';

describe('my-element', () => {
  let node;

  beforeEach(async () => {
    // Use createElement to test it is registered correctly
    node = document.createElement('my-element');

    // Connect to DOM in case there's any `connectedCallback` logic
    document.body.appendChild(node);

    // Wait for initial render
    await node.updateComplete;
  });

  afterEach(() => {
    // Remove from DOM, cleanup
    node.remove();
  });

  it('should render', () => {
    const span = node.shadowRoot.querySelector('h1');
    expect(span.innerText).to.equal('test');
  });
});
```

As you can see, this too is pretty straight forward. We didn't need
any helpers, any fancy testing frameworks or custom loaders. We simply
bundle our sources as normal and execute the full test suite in Chrome.

## Conclusion

This is a very brief overview of how to set up this common work flow, so
I expect there's plenty missing. I do hope it has helped somewhat, though.

While most of the Polymer team and its community are happy to push the idea
of everything being native and working as-is in the browser, it is not always
reality.

Maybe you're required to use this workflow to remain consistent
with your other projects, or maybe you just like being able to use Node
modules. Either way, this should at least give you an idea of how to stick
to that process while also adopting something as new as Lit.

Now whether you use bundlers or not, you can try Lit out. Have
a [play around](https://codepen.io/sorvell/pen/RYQyoe?editors=1000)!
