---
layout: post
title: Over-engineering inputs
description: Thoughts on how the ecosystem has suffered from over-engineering of input validation and edge case
---

This is just some of what I've been pondering recently - particularly in terms of how we ended up with such overly-granular dependency trees.

# The problem

I believe a lot of the questionably small libraries hiding in our deep dependency trees are a result of over-engineering for inputs and edge cases we've probably never seen.

For example, let's say we want to build a `clamp` library:

```ts
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
```

Pretty simple!

Though, what if someone passes nonsensical ranges? Let's add some validation:

```ts
export function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    throw new Error('min must be less than or equal to max');
  }
  return Math.min(Math.max(value, min), max);
}
```

**This is probably as far as I'd go.** But let's over-engineer - what if someone passes a number-like string?

```ts
export function clamp(value: number | string, min: number | string, max: number | string): number {
  if (min > max) {
    throw new Error('min must be less than or equal to max');
  }
  if (typeof value === 'string' && Number.isNaN(Number(value))) {
    throw new Error('value must be a number or a number-like string');
  }
  if (typeof min === 'string' && Number.isNaN(Number(min))) {
    throw new Error('min must be a number or a number-like string');
  }
  if (typeof max === 'string' && Number.isNaN(Number(max))) {
    throw new Error('max must be a number or a number-like string');
  }
  return Math.min(Math.max(value, min), max);
}
```

At this point, it seems clear to me we've just poorly designed our function. It solely exists to clamp numbers, so why would we accept strings?

But hey, let's go further! What if other libraries also want to accept such loose inputs? Let's extract this into a separate library:

```ts
import isNumber from 'is-number';

export function clamp(value: number | string, min: number | string, max: number | string): number {
  if (min > max) {
    throw new Error('min must be less than or equal to max');
  }
  if (!isNumber(value)) {
    throw new Error('value must be a number or a number-like string');
  }
  if (!isNumber(min)) {
    throw new Error('min must be a number or a number-like string');
  }
  if (!isNumber(max)) {
    throw new Error('max must be a number or a number-like string');
  }
  return Math.min(Math.max(value, min), max);
}
```

**Whoops!** We've just created the infamous [`is-number`](https://www.npmjs.com/package/is-number) library!

# How it should be

This, in my opinion, is poor technical design we've all ended up dealing with over the years. Carrying the baggage of these overly-granular libraries that exist to handle edge cases we've probably never encountered.

**We should be able to define our functions to accept the inputs they are designed for, and not try to handle every possible edge case.**

There are two things at play here:

- Data types
- Values

A well designed library would assume the right **data types** have been passed in, but may validate that the **values** make sense (e.g. `min` is less than `max`).

These over-engineered libraries have decided to implement _both_ at runtime - essentially run-time type checking and value validation. One could argue that this is just a result of building in the pre-TypeScript era, but that still doesn't justify the overly specific _value validation_ (e.g. the real `is-number` also checks that it is finite).

# Examples

Let's take a look at some examples.

Keep in mind, I don't have the entire context of why these libraries introduced the code they have. I am sure the maintainers had their reasons and beliefs at the time, and many didn't have nice things like TypeScript back when they built this stuff.

## `is-arrayish` (76M downloads/week)

**What's it do?**

Checks if a value is an `Array` or behaves like one.

**Who uses it?**

Almost solely used by `error-ex` - a library for subclassing `Error` (this used to be a PITA before ES6 classes).

**What's the `git blame` say?**

ref: [bf3ba64](https://github.com/Qix-/node-error-ex/commit/bf3ba642168ae7b20bb63863c1065d97f22e51d2)

It is used so you can mutate the `Error#message` via a function, and return strings or arrays:

```ts
const originalErr = new Error('foo');

const TestError = errorEx('TestError', {
  foo: {
    message: (message: string) => {
      return 'foobar'; // Internally checks that this is an array, and adds it to one if it is not
    }
  }
});
```

## `is-number` (90M downloads/week)

**What's it do?**

Checks if a value is a positive, finite number or number-like string.

**Who uses it?**

Almost solely used by `to-regex-range` - a library for generating numeric regex ranges.

**What's the `git blame` say?**

Introduced in the initial implementation, it is used to validate that the inputs:

```ts
// toRegexRange(min, max)

toRegexRange(-10, 10); // throws
toRegexRange('not-a-number', 10); // throws
toRegexRange(0, Infinity); // throws
```

# A note on cross-realm `is-*` libraries

Some libraries such as `is-regex` exist to do what the platform can already do itself _but cross realm_.

In the case of `is-regex`, this means you can do something like:

```ts
const iframe = document.createElement('iframe');
iframe.contentWindow.RegExp === RegExp; // false

const iframeRegex = iframe.contentWindow.someRegexp;

iframeRegex instanceof RegExp; // false
isRegex(iframeRegex); // true
```

A whole raft of libraries exist for this. Some examples:

- is-string
- is-set
- is-map
- is-date-object
- is-regex
- is-regexp
- etc...

These are all solving a real problem, but a specific one most of us don't need to care about.

For example, we have similar code inside `chai` to make it possible to assert across realms (e.g. if you got a value from an iframe or a node VM).

**I would argue that these libraries have made it into the hot path and shouldn't have.**

## Example: `is-regexp` (10M downloads/week)

The `is-regexp` library gains almost all of its downloads via [`stringify-object`](https://www.npmjs.com/package/stringify-object) (8.7M downloads/week).

As per the description:

> Stringify an object/array like JSON.stringify just without all the double-quotes

Let's say this is actually useful to someone, how many of its consumers are stringifying cross-realm values, do you think?

# A note on overly-granular libraries

This post isn't about overly-granular libraries in general, but I'd like to briefly mention them for visibility.

An overly-granular library is one where someone took a useful library and split it up into an almost atomic-level of granularity.

Some examples:

- `shebag-regex` - 2LOC, does the same as `startsWith('#!')`, **86M downloads/week**
- `is-whitespace` - 7LOC, checks if a string is only whitespace, **1M downloads/week**
- `is-npm` - 8LOC, checks `npm_config_user_agent` or `npm_package_json` are set, **7M downloads/week**

This is a personal preference some maintainers clearly prefer. The thought seems to be that by having atomic libraries, you can easily build your next library mostly from the existing building blocks you have.

I don't really agree with this and think downloading a package for `#!` 86 million times a week is a bit much.

# Conclusion

Most of these libraries exist to handle edge cases that do certainly exist. However, **we are all paying the cost of that rather than only those who need to support those edge cases**.

This is the wrong way around. Libraries should implement the main use case, and alternatives (or plugins) can exist to provide the edge cases the minority needs.

We should all be more aware of what is in our dependency tree, and should push for more concise, lighter libraries.
