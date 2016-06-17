---
layout: post
title: Animated dom-repeat in Polymer
---

Recently I was using the `dom-repeat` element in [Polymer](https://www.polymer-project.org/1.0/) when I came across a simple-sounding but difficult to solve question: how do you animate it?

Essentially, a `dom-repeat` looks like this:

```html
<template is="dom-repeat" items="[[arr]]">
	<div>[[item.name]]</div>
</template>
```

As you can see, this is a very simple iteration through some array (`arr`), displaying the name of each item in a div.

## The problem

How do we animate this? I would like to animate entry and exit of the items as they come and go.

This sounds very simple at first, can you not just use some part of [neon-animation](https://github.com/polymerelements/neon-animation)? Can you not just give the divs an `animationConfig` and make them animatable (with the provided behaviour)?

Well, it seems the answer to this is no. Logically, this is not quite as simple as it first seems.

If you push a new item to your array, the `dom-repeat` will observe this change and add an element for it. If you remove an item from your array, the `dom-repeat` will again observe this change and remove the element.

The problem here lies in the fact that, when you remove an item from your array, the `dom-repeat` will already have queued up removal of the node before you have any chance of triggering an animation. In fact, even if you observe the object and trigger the animation before the DOM update, the element will be removed mid-animation (or before it).

Similarly, when you add an item, you need to wait until the DOM had updated so the element exists for animations to be triggered. By this point, though, the element is already visible and you are again too late.

## Possible solutions

Several possible solutions come to mind:

* Keep track of DOM nodes and their association to objects, animate before DOM update
* Start items hidden, animate them in after a delay
* Hack around dom-repeat's `delay` to force renders to be delayed enough for exit animations

And of course, to explicitly animate items in/out throughout your code so you can deal with the data in the animation-end event.

However, all these solutions either require you to tie your code into the animation events too much or rely heavily on delays (meaningless numbers).

## The solution

My solution is [this](http://embed.plnkr.co/OgPvj3X2svOui9pItwiw/).

This was thrown together pretty quickly, so much of it likely can be improved.

Essentially, I hold a mirror of the "real" array which applies data changes after some specified delay. This means, when an item is added/removed, we have a well defined period of time before our rendered array is affected.

We simply keep track of any items which have been added, then animate them in when the repeater's DOM is updated. Similarly, we keep track of removed items and animate them out before the repeater's data is updated.

## The ideal solution

The ideal solution, I think, is for `dom-repeat` to introduce additional uses for the `delay` property it already has.

Currently, the `delay` property does pretty much what my solution does, _but_ only when a sort/filter is reapplied.

If dom-repeat's `delay` was applied to all rendering, it could likely be used to do this exact behaviour.
