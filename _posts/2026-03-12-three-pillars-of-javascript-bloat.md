---
layout: post
title: The Three Pillars of JavaScript Bloat
description: A brief look at the three main causes of bloat in our JavaScript dependency trees, and how we can start to address them.
---

Over the last couple of years, we've seen significant growth of the [e18e](https://e18e.dev) community and a rise in performance focused contributions because of it. A large part of this is the "cleanup" initiative, where the community has been pruning packages which are redundant, outdated, or unmaintained.

One of the most common topics that comes up as part of this is "dependency bloat" - the idea that npm dependency trees are getting larger over time, often with long since redundant code which the platform now provides natively.

In this post, I want to briefly look at what I think are the three main types of bloat in our dependency trees, why they exist, and how we can start to address them.

# 1. Older runtime support (with safety and realms)

![is-string dependency graph](/assets/images/is-string-graph.png){: .img-small}

The graph above is a common sight in many npm dependency trees - a small utility function for something which seems like it should be natively available, followed by many similarly small deep dependencies.

So why is this a thing? Why do we need `is-string` instead of `typeof` checks? Why do we need `hasown` instead of `Object.hasOwn` (or `Object.prototype.hasOwnProperty`)? Three things:

1. Support for very old engines
2. Protection against global namespace mutation
3. Cross-realm values

## Support for very old engines

Somewhere in the world, some people apparently exist who need to support **ES3** - think IE6/7, or extremely early versions of Node.js.

For these people, much of what we take for granted today does not exist. For example, they don't have any of the following:

- `Array.prototype.forEach`
- `Array.prototype.reduce`
- `Object.keys`
- `Object.defineProperty`

These are all ES5 features, meaning they simply don't exist in ES3 engines.

For these unfortunate souls who are still running old engines, they need to reimplement everything themselves, or be provided with polyfills.

Alternatively, what'd be really nice is if they upgraded.

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

For example, I am a maintainer of chai, and we have this exact issue. We need to support assertions happening across realms (since a test runner may run tests in a VM or iframe), so we can't rely on `instanceof` checks. For that reason, we use `Object.prototype.toString.call(val) === '[object RegExp]'` to check if something is a regex, which works across realms since it doesn't rely on the constructor.

In the graph above, `is-string` is basically doing this same job in case we passed a `new String(val)` from one realm to another.

## Why this is a problem

All of this makes sense for a very small group of people. If you're supporting very old engines, passing values across realms, or want protection from someone mutating the environment - these packages are exactly what you need.

The problem is that the vast majority of us don't need any of this. We're running a version of Node from the last 10 years, or using an evergreen browser. We don't need to support pre-ES5 environments, we don't pass values across frames, and we uninstall packages which break the environment.

These layers of niche compatibility somehow made their way into the "hot path" of everyday packages. The tiny group of people who actually need this stuff should be the ones seeking out special packages for it. Instead, it is reversed and **we all pay the cost**.

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

![eslint-plugin-react polyfills](/assets/images/eslint-plugin-react-polyfills.svg){: .img-small}

If you're building an app, you might want to use some "future" features your chosen engine doesn't support yet. In this situation, a **polyfill** can come in handy - it provides a fallback implementation where the feature should be, so you can use it as if it were natively supported.

For example, [temporal-polyfill](https://npmx.dev/package/temporal-polyfill) polyfills the new Temporal API so we can use `Temporal` regardless of if the engine supports it or not.

Now, if you're building a library instead, what should you do?

In general, no library should load a polyfill as that is a consumer's concern and a library shouldn't be mutating the environment around it. As an alternative, some maintainers choose to use what's called a **ponyfill** (sticking to the unicorns, sparkles and rainbows theme).

A ponyfill is basically a polyfill you import rather than one which mutates the environment.

This kinda works since it means a library can use future tech by importing an implementation of it which passes through to the native one if it exists, and uses the fallback otherwise. None of this mutates the environment, so it is safe for libraries to use.

For example, fastly provides [@fastly/performance-observer-polyfill](https://github.com/fastly/performance-observer-polyfill?tab=readme-ov-file#usage-as-a-ponyfill), which contains both a polyfill and ponyfill for `PerformanceObserver`.

## Why this is a problem

These ponyfills did their job at the time - they allowed the library author to use future tech without mutating the environment and without forcing the consumer to know which polyfills to install.

The problem comes when these ponyfills outstay their welcome. When the feature they fill in for is now supported by all engines we care about, the ponyfill should be removed. However, this often doesn't happen and the ponyfill remains in place long after it's needed.

We're now left with many, many packages which rely on ponyfills for features we've all had for a decade now.

For example:

- `globalthis` - ponyfill for `globalThis` (widely supported in 2019, 49M downloads a week)
- `indexof` - ponyfill for `Array.prototype.indexOf` (widely supported in 2010, 2.3M downloads a week)
- `object.entries` - ponyfill for `Object.entries` (widely supported in 2017, 35M downloads a week)

Unless these packages are being kept alive because of _Pillar 1_, they're usually still used just because nobody ever thought to remove them.

When all long-term support versions of engines have the feature, the ponyfill should be removed.

# What can we do about it?

TODO

# Closing Thoughts

We all pay the cost for an incredibly small group of people to have an unusual architecture they like, or a level of backwards compatibility they need.

This isn't necessarily a fault of the people who made these packages, as each person should be able to build however they want. Many of them are an older generation of influential JavaScript developers - building packages in a darker time where many of the nice APIs and cross-compatibility we have today didn't exist. They built the way they did because it was possibly the best way at the time.

The problem is that we never moved on from that. We still download all of this fluff today even though we've had these features for several years.

I think we can solve this by reversing things. This small group should pay the cost - they should have their own special stack pretty much only they use. Everyone else gets the modern, lightweight, and widely supported code.

Hopefully things like [e18e](https://e18e.dev) and [npmx](https://npmx.dev) can help with that through documentation, tooling, etc. You can also help by taking a closer look at your dependencies and asking "why?". Raise issues with your dependencies asking them if, and why they need these packages anymore.

We can fix it.

## Disclaimers / Notes

- Most mentioned years of support are from MDN, or if it pre-dates MDN, from the compat data
- Most of this bloat is from a time when it was probably necessary since the platform obviously wasn't as feature-rich back then. I think it was probably the right decision/architecture at the time.
- "Ponyfill" stuff in general is an unsettled topic, really. I think we should drop them once LTS is achieved, but others do disagree and want them "forever".
