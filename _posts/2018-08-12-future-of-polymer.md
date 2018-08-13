---
layout: post
title: The future of Polymer & lit-html
description: A summary of the future of Polymer and a path to follow going ahead.
---

# Polymer & Lit Element

The future of [Polymer](https://www.polymer-project.org/) is something
many people have been wondering about since the introduction of version 3,
and the creation of [lit-html](https://github.com/polymer/lit-html).

On one of our largest projects, I started to (slowly) migrate from 1.x to 2.x
around the same time the Polymer team were working on building 3.x and lit-html.

Polymer 3.x and [lit-element](https://github.com/polymer/lit-element) seem
to achieve the same goal in different ways. In fact, the `LitElement` class
even inherits some of Polymer's core mixins for property logic.

**So where do we go after Polymer 2.x?**

For a while, this question had no clear answer. However, it seems we now have
a rough idea:

* **If coming from Polymer 2**, Polymer 3 is something you should upgrade to,
as it can be mostly automated through the [modulizer](https://www.polymer-project.org/3.0/docs/upgrade)
* **If starting from new**, you should use [lit-element](https://github.com/polymer/lit-element)
* If you want to go all in, do a full conversion and drink buckets of coffee (like
I may have done), go straight to [lit-element](https://github.com/polymer/lit-element)

It looks to me like Polymer 3 will be the last Polymer standalone library.
Going forward, it will likely be split into a "legacy" (`PolymerElement`)
and a "core", which is the core library without the opinionated element classes.

What I figured I'll do with this post is summarise the basic migration from
Polymer to Lit.

## For new-comers to Web Components

This post is mostly aimed at helping developers who already use Polymer gain
an understanding of the path it will take in future.

However, if you're new to it, I still recommend reading some of this and
the [lit-html](https://polymer.github.io/lit-html/) website to see how it all
works.

These days, web components have wide support in all major browsers and I would
recommend them often over using a full blown framework.

# Defining an element

## Polymer 2.x

```html
<dom-module id="my-polymer-element">
  <template>My element!</template>
  <script>
    class MyPolymerElement extends Polymer.Element {
      static get is() { return 'my-polymer-element'; }
    }
    customElements.define('my-polymer-element', MyPolymerElement);
  </script>
</dom-module>
```

## Polymer 3.x

```js
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

class MyPolymerElement extends PolymerElement {
  static get is() { return 'my-polymer-element'; }
  static get template() {
    return html`My element!`;
  }
}

customElements.define('my-polymer-element', MyPolymerElement);
```

## LitElement

```js
import {LitElement, html} from '@polymer/lit-element';

class MyLitElement extends LitElement {
  _render() {
    return html`My element!`;
  }
}

customElements.define('my-lit-element', MyLitElement);
```

As you can see, there's not much difference between Polymer 3 and Lit.

The huge difference between Polymer 2 and Lit is the loss of
`dom-module`. Templates are now defined in JavaScript... which is a kind of
love or hate situation.

There is a [proposal](https://github.com/w3c/webcomponents/issues/645) to allow
these templates to come from HTML files, for those who want it separate.

# Bindings

All bindings in Lit are native JavaScript expressions unlike Polymer's
custom HTML syntax.

Here's a quick summary of how bindings have changed:

| Polymer | Lit |
| --- | --- |
| `[[foo]]` | `${this.foo}` |
| `{% raw %}{{foo}}{% endraw %}` | `${this.foo}` with an event listener (e.g. `input` on inputs) |
| `<my-el prop="[[foo]]">` | `<my-el .prop=${this.foo}>` |
| `<my-el prop$="[[foo]]">` | `<my-el prop=${this.foo}>` |
| `<input checked="[[checked]]">` | `<input checked?=${this.checked}>` |
| `<button on-click="_onClick">` | `<button @click=${(e) => this._onClick(e)}>` |

There's a nice summary [here](https://polymer.github.io/lit-html/guide/writing-templates.html#binding-types)
about the different syntaxes used.

**Do note: This syntax is still new to lit-html so hasn't yet made it into LitElement (it is [in progress](https://github.com/Polymer/lit-element/issues/123)).**

## Two-way bindings

Bindings are one-way in Lit, seeing as they are simply passed down in JavaScript
expressions. There is no concept of two-way binding or pushing new values upwards
in the tree.

Instead of two-way bindings, you can now make use of events or a state store.

This can be very simple to implement if an event already exists, such as
with an input element:

```js
_render() {
  return html`<input type="text" @input=${(e) => this._onInput(e)}>`;
}

_onInput(e) {
  this._value = e.currentTarget.value;
}
```

As you can see, we simply use the native `input` event and update our property
to the value.

# Helper Elements

Polymer has a few helper elements to provide a solution to very common
concepts/functionality.

Instead of these DOM elements, you can simply implement the same logic by
taking advantage of JavaScript's features natively, using conditionals and
flow control like you would in any other part of your code.

## `dom-repeat`

`dom-repeat` becomes unnecessary as we can simply map an array when rendering
in Lit.

### Polymer

```html
Item List:
<dom-repeat items="[[foo]]">
  <template>
    <span>[[item.prop]]</span>
  </template>
</dom-repeat>
```

### Lit

```js
const items = this.foo.map(item => html`<span>${item.prop}</span>`);

return html`
  Item List:
  ${items}
`;
```

## `dom-if`

Similarly, a `dom-if` is as simple as a ternary or a separate condition in
the render method.

### Polymer

```html
<template is="dom-if" if="[[condition]]">
  <span>Condition was truthy</span>
</template>
<template is="dom-if" if="[[!condition]]">
  <span>Condition was falsy</span>
</template>
```

### Lit

```js
return html`<span>Condition was ${this.condition ? 'truthy' : 'falsy'}</span>`;
```

# Custom Styles

Custom styles existed to allow sharing of styles between elements:

```html
<dom-module id="my-custom-style">
  <template>
    <style>* { color: hotpink; }</style>
  </template>
</dom-module>

<!-- meanwhile, elsewhere... -->

<style include="my-custom-style">
/* ... */
</style>
```

With Lit, we no longer have such a concept as a style can simply be shared
through interpolation:

```js
_render() {
  const sharedStyles = getSharedStyles(); // Could come from a file, wherever.
  return html`
    <style>${sharedStyles}</style>
    <span>My element!</span>`;
}
```

As you can see, the CSS you template in could come from wherever you like. So
there is no longer a need for a module and what not.

# Properties

Now the fun part! Properties...

Properties in Lit are incredibly simple compared to the fairly configurable
ones we had in Polymer. The reason for this is probably to keep it very light
and leave implementation of those extra things to us.

## Polymer

```js
static get properties() {
  return {
    myProperty: Boolean,
    mySecondProperty: {
      type: String,
      reflectToAttribute: true
    }
  };
}
```

## Lit

```js
static get properties() {
  return {
    myProperty: Boolean,
    mySecondProperty: String
  };
}
```

As you can see, all of the configuration falls away and we're left with a very
basic list of our properties/types.

## Private and Protected Properties

A note worth making on private and protected properties is that they should
still be defined as Lit properties in our `properties` getter:

```js
static get properties() {
  return {
    myProp: String,
    _myProtectedProp: String,
    __myPrivateProp: String
  }
}
```

The reason for this is that, by default, **Lit will not reflect properties
to attributes**. This means our private/protected properties will remain
invisible in the DOM but can still be observed by Lit to trigger re-renders.

## Property Configuration

As mentioned above, most of the configuration of properties has gone away. So
here is a what we can do instead...

### `reflectToAttribute`

To reproduce Polymer's `reflectAttribute` option, we can simply do:

```js
class MyElement extends LitElement {
  static get properties() {
    return { myProp: String };
  }

  _didRender() {
    this.setAttribute('myProp', this.myProp);
  }
}
```

If this becomes a common thing you do, it may be worth implementing
some kind of base class or helper which provides the functionality generically.

Lit may consider providing an option to enable this in future, but that seems
to be under discussion as of the time this was written.

Do note, it may seem tempting to implement a setter for this reason:

```js
set myProp(val) {
  this.setAttribute('my-prop', val);
  this._myProp = val;
}
```

However, this will not work because Lit (the Polymer core internally, actually)
will replace the setter.

### `value`

Default values are as simple as setting them in the constructor:

```js
class MyElement extends LitElement {
  static get properties() {
    return { myProp: String };
  }

  constructor() {
    super();
    this.myProp = 'default value';
  }
}
```

### `readOnly`

There is no concept of a read-only property in Lit, but we can kind of
re-create it with regular JavaScript getters:

```js
class MyElement extends LitElement {
  static get properties() {
    return { _myProperty: String };
  }

  get readOnlyProperty() {
    return this._myProperty;
  }
}
```

Then any time we want to update it, we simply set `_myProperty` and Lit will
know to trigger a re-render. We can use the methods discussed earlier in this
post to also reflect the read-only property to the attribute in `_didRender`.

### `notify`

Seeing as there's no such thing as "two-way bindings" in Lit, the `notify`
option of properties disappears. There is no use for it anymore.

To implement something similar, you should really use some kind of state store
or create your own (if you only need a very simple one). Something like
[Redux](https://redux.js.org/) will do nicely.

If you're still using Polymer elements, you can even dispatch a
`my-property-changed` event yourself so parent Polymer elements will pick
it up:

```js
this.dispatchEvent(new CustomEvent('my-property-changed'));
```

### `computed`

Instead of Polymer's `computed` option, you can simply use a getter:

```js
class MyElement extends LitElement {
  static get properties() {
    return {
      prop1: String,
      prop2: String
    };
  }

  get computedProperty() {
    return `${this.prop1}${this.prop2}`;
  }

  _render() {
    return html`Value is: ${this.computedProperty}`;
  }
}
```

Seeing as our render method should be called any time the depended upon
properties change, everything should work fine here and our computed property
will be retrieved each time.

# Observers

I haven't yet thought of a great way to do observers, but I think most of
the need for them goes away with the ability to just call methods in our
render method.

However, if you do want to do something when a property changes, I suppose
the best place for it is in the `_didRender` method:

```js
_didRender(props, changedProps, prevProps) {
  if (changedProps.hasOwnProperty('myProp')) {
    this._onMyPropChanged(this.myProp, changedProps.myProp);
  }

  // or do your own dirty checking
  if (isDirty(this.myProp, prevProps.myProp)) {
    this._onMyPropChanged(this.myProp, prevProps.myProp);
  }
}
```

If you were using Polymer to observe deep changes like sub-properties of
objects and splices of arrays, you can consider one of the following solutions:

* Use a state store
* Use something like [immutable](https://facebook.github.io/immutable-js/)
so deep changes will create a new object and thus trigger a re-render
* Implement (or use a library) a deep-comparison method to behave as a dirty
check.

# Events

Event handlers can be added to elements in a similar way to Polymer:

```js
_render() {
  return html`<button @click=${(e) => this._onClick(e)}>`;
}
```

Though it is probably a good idea to create these handlers in your
constructor to avoid re-creating the function every time:

```js
constructor() {
  super();
  this._boundOnClick = this._onClick.bind(this);
}

_render() {
  return html`<button @click=${this._boundOnClick}>`;
}
```

For adding events to the current element, it makes sense to simply use
the native `connectedCallback`:

```js
constructor() {
  super();
  this._boundOnClick = this._onClick.bind(this);
}

connectedCallback() {
  super.connectedCallback();
  this.addEventListener('click', this._boundOnClick);
}

disconnectedCallback() {
  super.disconnectedCallback();
  this.removeEventListener('click', this._boundOnClick);
}
```

# Routing

The `app-route` element is a bit of an anti-pattern. It was always a little
unusual to define routing information in markup. It was pretty much a wrapper
around a useful library.

Anyhow, when using Lit we have no such element so you may be wondering what
we should use instead.

The answer to this is: whatever you want.

Here are a few libraries:

* [page.js](https://github.com/visionmedia/page.js)
* [director](https://github.com/flatiron/director)
* Create your own!

I opted with [page.js](https://github.com/visionmedia/page.js) as I have a fairly
simple routing strategy and only need to re-render when one parameter changes:

```js
class MyElement extends LitElement {
  static get properties() {
    return { _view: String };
  }

  constructor() {
    page('/view/:view', (ctx) => {
      this._view = ctx.params.view;
    });
    page();
  }
}
```

However, this is just a quick example and should be taken with a grain of
salt. There are several problems, like re-using this element will try to
re-define the routes and make bad things happen!

Also, I only ever have one instance of this element so don't have to worry
about doing this logic in the constructor.

# Wrap up

As you can see, [lit-element](https://github.com/polymer/lit-element) is
quite different from [Polymer](https://www.polymer-project.org/).

The migration between the two isn't something you can easily do in a large
project, it will definitely take some of time.

I asked a few questions when looking into Lit:

* Will it keep its name and location (in the polymer project)?
* Will it look anything like it does now when it reaches 1.0?
* Will the browser APIs it depends on change as drastically as they did with
Polymer? (even sometimes disappearing from underneath us, HTML imports...)

These and plenty more questions are really to be asked to the Polymer team,
but I personally would hold off on using it in production until they have
answers.

My opinion on this is that you let Lit settle a bit, see it reach 1.0 and
then make your decision.

If you want to move from Polymer 2.x, it is probably best to go to Polymer
3.x for now using the [modulizer](https://www.polymer-project.org/3.0/docs/upgrade)
and then gradually migrate to LitElement how you like.

For a long time, Web Components and Polymer were seen as unstable, ever-changing
and experimental. Maybe now we can see some wider adoption and grow our community
more than ever before.
