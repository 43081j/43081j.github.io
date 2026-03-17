---
layout: post
title: The Three Pillars of JavaScript Bloat
description: A brief look at the three main causes of bloat in our JavaScript dependency trees, and how we can start to address them.
---

Over the last couple of years, we've seen great growth of the [e18e](https://e18e.dev) community and initiative to improve performance throughout the JavaScript ecosystem. One of the most common topics that comes up is "dependency bloat" - the idea that npm dependency trees are getting larger over time, often with long since redundant code which the platform now provides natively.

In this post, I want to briefly look at what I think are the three main types of bloat in our dependency trees, why they exist, and how we can start to address them.

# 1. Older runtime support (with safety and realms)

![is-string dependency graph](/assets/images/is-string-graph.png){: .img-small}

The graph above is a common sight in many npm dependency trees - a small utility function for something which seems like it should be natively available, followed by many similarly small deep dependencies.

So why is this a thing? Why do we need `is-string` instead of `typeof` checks? Why do we need `hasown` instead of `Object.hasOwn` (or `Object.prototype.hasOwnProperty`)? Three things:

1. Support for very old versions of Node.js
2. Protection against global namespace mutation
3. Cross-realm values

## Support for old versions of Node.js

Somewhere in the world, some people apparently exist who need to support **Node 0.8** (left long term support in 2017).

For these people, much of what we take for granted today does not exist. For example, they don't have any of the following:

- `Array.prototype.slice` (0.10)
- `Object.defineProperty` (0.10)
- `Symbol` (0.12)

Basically, much of modern JavasScript (both syntax and APIs) became available in `>=0.10` of Node it seems.

For these unfortunate souls who are still running `0.8` and don't have any this functionality, they need to reimplement everything themselves, or be provided with polyfills.

Alternatively, what'd be really nice is if they upgraded their version of Node.

## Protection against global namespace mutation

The second reason for some of these packages is "safety".

Basically, inside Node itself, there is a concept of "primordials". These are essentially just global objects wrapped at startup and imported by Node from then on, to avoid Node itself being broken by someone mutating the global namespace.

For example, if Node itself uses `Map` and we re-define what `Map` is - we can break Node. To avoid this, Node keeps a reference to the original `Map` which it imports rather than accessing the global.

You can read more about this [here in the Node repo](https://github.com/nodejs/node/blob/main/doc/contributing/primordials.md).

This makes a lot of sense _for an engine_, since it really shouldn't fall over if a script messes up the global namespace.

Some maintainers also believe this is the correct way to build _packages_, too. This is why we have dependencies like `math-intrinsics` in the graph above, which basically re-exports the various `Math.*` functions to avoid mutation.

## Cross-realm values

Lastly, we have cross-realm values. These are basically values you have passed from one realm to another - for example, from a web page to a child `<iframe>` or vice versa.

In this situation, a `new RegExp(pattern)` in an iframe, is _not_ the same `RegExp` class as the one in the parent page. This means `window.RegExp !== iframeWindow.RegExp`, which of course means `val instanceof RegExp` would be `false` if it came from the iframe (another realm).

We have this exact issue in chai, and use `toString` for that reason: `Object.prototype.toString.call(val) === '[object RegExp]'`.

In the graph above, `is-string` is basically doing this same job in case we passed a `new String(val)` from one realm to another.

## Why this is a problem

For a small amount of people in the real world, all of this makes sense. If you need the following:

- Node 0.8 support (or lower)
- Cross-realm support
- Safe from someone mutating the environment

Then this is all good and exactly what you need!

However, this obviously isn't what the majority of us need.

Most of us are running a version of Node from the last 10 years, or an evergreen browser. We don't need to support 0.8, we don't pass values across frames, and we uninstall packages which trash the global namespace.

These layers of compatibility and support somehow made their way into the "hot path" of consumers. The tiny amount of people who need this stuff should be the ones installing special packages for that purpose, while the average user should not. Currently, this is reversed and **we all pay the cost**.

# 2. Atomic architecture

[Some folks believe](https://sindresorhus.com/blog/small-focused-modules) that packages should be broken up to an almost atomic level, creating a collection of small building blocks which can later be re-used to build other higher level things.

This kind of architecture means we end up with graphs like this:

![execa dependency graph](/assets/images/execa-graph.png){: .img-smaller}

As you can see, the most granular snippets of code have their own packages. For example, `shebang-regex` is the following at the time of writing this post:

```ts
const shebangRegex = /^#!(.*)/;
export default shebangRegex;
```

By splitting code up to this atomic level, the theory is that we can then create higher level packages simply by joining the dots.

Some examples of these atomic packages to give you an idea of the granularity:

- `arrify` - Converts a value to an array
- `slash` - Replace backslashes in a file-system path with `/`
- `cli-boxes` - A JSON file containing the edges of a box
- `path-key` - Get the `PATH` environment variable key for the current platform (`PATH` on Unix, `Path` on Windows)
- `onetime` - Ensure a function is only called once
- `is-wsl` - Detect if we're running in the Windows Subsystem for Linux
- `is-windows` - Detect if we're running on Windows
- `is-docker` - Detect if we're running in a Docker container

If we wanted to build a new CLI for example, we could pull a few of these in and not worry about implementation. We don't need to do `env['PATH'] || env['Path']` ourselves, we can just pull a package for that.

## Why this is a problem

It does sound kind of nice to have a library of reusable building blocks every maintainer shares... but that isn't reality. In reality, we end up with a bunch of single-use packages or a bunch of duplicated packages across various versions.

For example, let's take a look at some of the most granular packages:

- `shebang-regex` is used almost solely by `shebang-command` by the same maintainer
- `cli-boxes` is used almost solely by `boxen` and `ink` by the same maintainer
- `arrify` is used almost solely by `minimist`

In the end these packages are not the reusable building blocks they aimed to be. They are single-use, deep dependencies nobody else uses.

This means they're equivalent of inline code but cost us more to acquire (npm requests, tar extraction, bandwidth, etc.).

Similar to the first pillar, this philosophy made its way into the "hot path" and shouldn't have. Again, we all pay the cost to no benefit.

# 3. "Ponyfills" that overstayed their welcome

If you're building an app, you might want to use some "future" features your chosen engine doens't support yet. In this situation, a **polyfill** can come in handy - it provides a fallback implementation where the feature should be, so you can use it as if it were natively supported.

There are considerations to make there such as ensuring the spec is finalised, the polyfill is well written, etc. Though those are outside the scope of this post.

Now, if you're building a library instead, what should you do?

No library should load a polyfill as that is a consumer's concern and a library shouldn't be mutating the global environment. As an alternative, some maintainers choose to use what's called a **ponyfill** (sticking to the unicorns, sparkles and rainbows theme).

A ponyfill is basically a polyfill you import rather than one which mutates the environment.

This kinda works since it means a library can use future tech by importing an implementation of it which passes through to the native one if it exists, and uses the fallback otherwise.

## Why this is a problem

# Thoughts

Foo
