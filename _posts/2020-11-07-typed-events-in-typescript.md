---
layout: post
title: Using strongly typed events in TypeScript
description: A quick few tips on how to use strongly typed events in TypeScript.
---

Recently I have been working on improving a whole bunch of web components
in one of our code bases. Part of this has been to improve the types and their
strength (which also means better editor support :D).

These are just a few tips from what I found.

## The aim

It is common that we might want to emit custom events from our components. For
example:

```ts
class MyElement extends HTMLElement {
  // ..
  protected _doSomething(): void {
    this.dispatchEvent(new CustomEvent('my-event'));
  }
}
```

In these situations, a consumer of the component would listen like so:

```ts
node.addEventListener('my-event', (ev) => {
  // ...
});
```

However, there would be no helpful type information to suggest that
`my-event` is a valid ("known") event and the type of the event it is.

So our aim to strengthen this would be to strongly type those events and
give editors better completion/information.

## Event maps

Thankfully, TypeScript already helped solve this problem with "event maps".
These are basically interfaces to hold the names of events and their type.

You can see that `addEventListener` is roughly typed like so:

```ts
// example map
interface EventMap {
  'my-event': MyCustomEventType;
}

// method
addEventListener<T extends keyof EventMap>(
  type: T,
  listener: (event: EventMap[T]) => any
);
```

Where `EventMap` is one of a few available maps depending on the type of node
you're dealing with.

The fall back, for when it isn't in the event map, is basically `Event`. This
means we're not _too_ strict.

Anyhow this results in useful hints and types like so:

```ts
document.addEventListener('load', fn); // knows that 'load' is an event
node.addEventListener('blur', (ev) => { ... }); // knows `ev` is `FocusEvent`
node.addEventListener('doesntexist', (ev) => { ... }); // `ev` is `Event`
```

## Built in event maps

There are several, a couple are:

* `DocumentEventMap` - defines all events available to `Document`
* `WindowEventMap` - defines all events available to `Window`
* `HTMLElementEventMap` - defines all events available to any HTML element

## Extending a built in map

You can extend a built in event map by augmenting the global interface:

```ts
declare global {
  interface WindowEventMap {
    'my-event': CustomEvent<{foo: number}>;
  }
}

// ...

window.addEventListener(
  'my-event', // will be a known event name, suggested in your editor
  (ev) => { // will be typed as `CustomEvent<{foo: number}>`
    ev.detail.foo; // number
  }
);
```

## Defining your own event maps

You may want to tie events to your component and only your component, rather
than the globally available list of events.

To do this, you can re-define `addEventListener`:

```ts
interface MyEventMap {
  'my-event': CustomEvent<{foo: number}>;
}

class MyElement extends HTMLElement {
  public addEventListener<T extends keyof MyEventMap>(
    type: T,
    listener: (this: MyElement, ev: MyEventMap[T]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  public addEventListener(
    type: string,
    listener: (this: MyElement, ev: Event) => any,
    options?: boolean | AddEventListenerOptions
  ): void {
    super.addEventListener(type, listener, options);
  }
}

// ...

const node = document.createElement('my-element');
node.addEventListener(
  'my-event', // strongly typed, suggested by editor
  (ev) => { ... } // ev is a `CustomEvent<{foo: number}>`
);
```

## Wrap up

Again, this was just a quick one to show the findings. These things can
make the dev experience super nice, though.

Now in our editors we can get strongly typed event names along with their
strongly typed events, rather than relying on casts and what not.
