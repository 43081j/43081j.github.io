---
layout: post
title: Intersection Observers
---

Just landed in Chrome Canary, **Intersection Observers**!

These essentially allow you to observe the intersection of some element within another, as defined by [this spec](https://wicg.github.io/IntersectionObserver/).

## How it works

An intersection observer will notify us when any of our observed elements have a change of intersection with some root element.

We can create one like so:

```javascript
var observer = new IntersectionObserver(function(changes) {
	changes.forEach(function(change) {
		// ...
	});
}, {
	threshold: [0.5]
});
```

And attach it like so:

```javascript
observer.observe(document.querySelector('#myDiv'));
```

In this example, we are simply stating that we wish to observe when more than `0.5` of `#myDiv` intersects the root element (default is the viewport). It appears that we get notified of change any time the ratio of intersection has changed, rather than simply if it does or doesn't intersect.

According to the spec, we can also specify another root like so:

```javascript
new IntersectionObserver(fn, {
	root: myElement
});
```
Which would allow us to observe when elements intersect with `myElement` rather than the viewport as a whole.

## Margins and thresholds

When setting up and observer, we can specify two properties other than the root; the `rootMargin` and `threshold`.

### `rootMargin`

Specifying a root margin is simply like a normal margin.

If you imagine our `root` is some scrollable element, we would like to know when an element comes into view.

However, what if we want to know when an element is about to come into view? Let's say we want to load the contents of it dynamically just before it becomes visible.

We can do this by specifying some margin such that we account for a boundary around the visible space and get intersection notifications on that too.

### `threshold`

This is simply a ratio, so if we specify `0.5`, we are saying we want to be notified when at least 50% of our observed element intersects the root.

## Visualising this

![Intersections](http://i.imgur.com/b9CHUCM.png)

As you can see in this picture, assuming some change in scroll position just happened on the outer container, `A` and `B` will have triggered intersection changes.

If we had setup our observer with a ratio of `0.5`, both would be in the change array passed to our function. If we instead setup a `rootMargin` which measured to below `C`, that would've also been included.

## An example

The best way to explain this is an [example](http://plnkr.co/edit/dApDrJWn3WTCH4RhxuOG?p=preview).

As you can see, scrolling up and down results in each child knowing when it has been seen and how many times.

## Wrap up

Still have yet to fully get my head around this API, but it is quite interesting. It definitely has many uses, such as in lazy loading content below the fold, reusing elements in a scrollable list, infinite scrolling and so on.
