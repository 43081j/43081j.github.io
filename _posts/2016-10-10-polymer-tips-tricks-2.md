---
layout: post
title: Polymer Tips & Tricks 2
---

The second in my Tips & Tricks series! Just a couple this week as, fortunately, I haven't encountered many issues beyond those caused by currently opened issues.

## Getting `iron-resizable-behavior` right

The [`iron-resizable`](https://github.com/PolymerElements/iron-resizable-behavior) behavior is very useful for reacting to visibility and size changes, so you can trigger re-renders and such to maintain the correct size.

This one confused me a little because it tackles both problems at once: being notified and being a notifier.

### How to use it

If you want to know when you have been resized, changed visibility, etc; simply do the following:

```javascript
    behaviors: [Polymer.IronResizableBehavior],
    listeners: {
        'iron-resize': '_onResize'
    },
    _onResize: function() {
        // I have been resized!
    }
```

If you want to let elements know you have been resized, changed visibility, etc; do the following:

```javascript
    behaviors: [Polymer.IronResizableBehavior],
    _myCallback: function() {
        this.notifyResize();
    }
```

Where `_myCallback` is whatever method you have which should notify.

`notifyResize` will both fire the `iron-resize` event _and_ notify interested children.

### When to use it

Using this behaviour is very important when you, for example, use iron-pages a lot. Elements which change visibility often or change size often, should implement this.

As an example, assume you have `iron-pages` where one page has an iron-list in it. Your iron-list will appear blank when you change page and come back to it.

Why is this? Because `iron-list` is waiting for you to tell it that is has become visible!

Simply `notifyResize()` when your page becomes active (use the `attr-for-selected` property of `iron-pages`) and the `iron-list` will re-render.

## Array indices & keys

This one, for sure, made me feel stupid. I missed [this tiny section](https://www.polymer-project.org/1.0/docs/devguide/model-data#get-array-item) in the docs.

Essentially, when writing [array-filter](https://github.com/43081j/array-filter), I was getting lots of craziness with change notifications going missing and non-existent paths being linked (through `linkPaths`).

Array keys are _not_ the same as indices.

Doing this:

```javascript
this.set('arr.0.foo', 'bar');
```

Is far from the same as this:

```javascript
this.set('arr.#0.foo', 'bar');
```

Why? Internally, `#0` is a key, not an index. Your array (`arr` here) has a backing collection (`Polymer.Collection`). These collections track items by an incremental key, meaning it will not match up with the item's index in the actual array.

Change paths will always use keys, not indices. So if you are listening on `arr.*`, you should _not_ try to access the specified number as an index. You should instead get the index by `this.arr.indexOf(this.get(['arr', key]))`.

This caught me out a lot because `linkPaths(to, from)` does _not_ work with indices. `linkPaths('arr.0', 'another.1')` will not work. You must always use keys.

## PolymerFire & empty objects

This is by far one of the trickiest problems with [polymerfire](https://github.com/firebase/polymerfire) for me right now.

Many people, myself included, have noticed that when a `firebase-document` loads, the value goes like so:

* `undefined`
* `{}`
* `{ foo: 'bar' }`

The second value, the empty object, often causes chaos in projects where it isn't expected.

I had cards which took a document from firebase and simply rendered it, however they never expected to be given an empty object. So of course, chaos came.

This is a tough problem to solve and there is an issue open for it right now, though the solution won't be simple so it won't be fixed any time soon.

For now, I do the following check:

```javascript
if(Object.keys(this.doc).length === 0) {
```

It is as hacky as it looks, I know, but it does the job. No firebase document will ever be `{}`, so you know it doesn't exist or hasn't loaded yet.

I am not entirely sure how to determine if it hasn't loaded yet or if it isn't there, fortunately I can get away with the catch-all check in my code.
