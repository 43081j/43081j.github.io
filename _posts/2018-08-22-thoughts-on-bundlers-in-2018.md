---
layout: post
title: Thoughts on JS bundlers in 2018
description: My thoughts on JavaScript bundlers in 2018
---

This week, I thought it would be a pretty cool idea to have a go at moving
from [WebPack](https://webpack.js.org/) to [Rollup](https://rollupjs.org/guide/en).

I wanted to give this a go because Rollup gets talked about a lot, and
it is possible that it could produce a more optimal bundle than WebPack.

I also wanted to give myself chance to dig around the source and see how
it works.

We should also keep in mind that one doesn't make the other obsolete. The way
I see it is that WebPack is a highly configurable solution whereas Rollup aims
to be much simpler and better for the common use case.

There's no use asking which is better because both do an excellent job, it
all depends on which you prefer.

Also, by the time you read this post, I'm sure there'll be another bundler
thrown into the ecosystem that claims to be _even cooler_.

# Using WebPack

The project I was working on had this WebPack build process:

* Clean the output directory
(using [a plugin](https://www.npmjs.com/package/clean-webpack-plugin))
* Run [ESLint](https://eslint.org/) against the TypeScript sources
(using [a loader](https://github.com/webpack-contrib/eslint-loader))
* Compile TypeScript sources to equivalent JavaScript
(using [another loader](https://github.com/TypeStrong/ts-loader))
* Output both a vendor bundle (third-party dependencies) and an app bundle
(using [an included plugin](https://webpack.js.org/plugins/split-chunks-plugin/))

For tests, it used [Karma](https://karma-runner.github.io/2.0/index.html) like so:

* Use the [WebPack plugin](https://github.com/webpack-contrib/karma-webpack) to
compile the sources into a bundle the browser can execute
* Use the [sourcemaps plugin](https://github.com/demerzel3/karma-sourcemap-loader)
to allow Karma to understand how to map all the way back to the original
TypeScript source
* Run the tests!

As almost everything was contained in WebPack and Karma, our NPM scripts
(which we make heavy use of usually) were pretty much:

```json
{
  "build": "webpack",
  "test": "karma start",
  "watch": "webpack --watch"
}
```

We needed no extra tools installed, just a few loaders and plugins we
added to our configuration.

# Using Rollup

The same project with Rollup had this build process (through NPM scripts):

* Run [rimraf](https://github.com/isaacs/rimraf) to clean the output directory
* Run [ESLint](https://eslint.org/) against the TypeScript sources
* Run the TypeScript compiler against the TypeScript sources
* Run rollup against the JavaScript sources

The test process became this:

* Run _the build_ (above) but with a different entry-point (for tests)
* Run karma with only the sourcemaps plugin loaded, against the test bundle

Our NPM scripts became (can probably be simplified):

```json
{
  "lint": "eslint \"src/**/*.ts\"",
  "clean": "rimraf lib",
  "build:ts": "tsc",
  "build": "npm run clean && npm run lint && npm run build:ts",
  "build:bundle": "npm run build && rollup -c",
  "build:production": "npm run build && rollup -c --env BUILD:production",
  "test": "karma start",
  "watch:ts": "tsc -w",
  "watch:bundle": "rollup -cw",
  "watch": "concurrently -k \"npm:watch*\""
}
```

# Differences

So, what's different?

You can't really tell from my tiny list of build steps as they are pretty
much the same from a quick glance, however there were plenty of differences...

* **Tooling instead of plugins**: where you had a plugin or loader before,
you now have a third-party tool and probably another NPM script to do the job
* **Tree-shaking**: both are good at tree-shaking, but Rollup may be better
at it due to it being built around ES modules (though it has problems with
TypeScript in particular and the tree-shaking fails miserably...)
* **CommonJS**: a lot of CommonJS modules do not get their exports detected by
the [plugin](https://github.com/rollup/rollup-plugin-commonjs) and need
to be declared manually in the Rollup config
* **Code splitting**: Rollup doesn't seem to have a built-in way of splitting
a bundle by a particular strategy (though it does have experimental
code splitting using dynamic imports)
* **Watching**: rollup has a `watch` command but it is fairly useless if
you have multiple build steps. Extra tooling is needed to run your other
steps on file change, outside rollup

# Thoughts

I could go on for a while about little differences and changes I had
to make, but it really depends heavily on your own project and how it
is structured.

Personally, I like WebPack in my case because it is well contained
and can be configured in almost any way I want (I have some unusual configurations
at times). That is important to me, and the fact that I can split the bundle
in a very customisable way.

I would definitely use Rollup from now on for libraries, but maybe not
for full applications.

Having to install a boat load of tooling and (in my case) quadruple the
number of NPM scripts you have, seems to be a bit worse of an experience
than just having a single build tool which does it for you.

I wouldn't expect rollup to introduce all of these configurable things
and all of these built-in tools...

Isn't a highly configurable Rollup just WebPack?
