---
layout: post
title: Polymer Data Binding
---

Today I'm going to talk about [Polymer](https://www.polymer-project.org/) again, this time on the topic of data binding.

I am going to assume you have already used Polymer and have a basic understanding of it.

## The basics

There are two types of binding, *one way* and *two way*.

A one way binding uses double square brackets (e.g. `[[foo]]`). If `foo` changes, it will be passed _downwards_ to children but they can never pass it back up (change it).

A two way binding uses double curly brackets (e.g. `{% raw %}{{foo}}{% endraw %}`). If `foo` changes, it will be pased _downwards_ to children. If children then change the value, that change will propagate back up to your element.

An example:

```html
<paper-input value="{% raw %}{{foo}}{% endraw %}"></paper-input>
<paper-input value="[[foo]]"></paper-input>
```

Assume our element has a `foo` property. If we type into the first input, our `foo` property will change. If we type into our second input, our `foo` property will _not_ change.

If we change `foo` directly, both inputs will display the new value.

## How does this work?

When Polymer parses these bindings, it creates what we call "property effects" and a getter/setter.

### Getters/Setters

If we bind to `{% raw %}{{foo}}{% endraw %}`, Polymer will automatically create a property on your element called `foo`. It essentially does this through normal getters and setters in JS:

```javascript
Polymer({
	is: 'my-element',
	set foo(val) {
		// ...
	}
	get foo() {
		// ...
	}
});
```

Basically, your element has an internal state object. Each property's getter will retrieve the associated value from this object. Each setter will write to it and do some dirty checking (`oldValue !== newValue`) to detect a change (we will talk about this later).

### Property effects

Upon parsing the `foo` binding from before, a property effect will also be created.

A property effect is essentially an instruction created from a binding to tell Polymer what to do when the bound values change.

So, in our `foo` example, our effect will pretty much define that we want to change the bound node when `foo` changes, in a two-way fashion.

If you want to dig around, you can actually access these effects on your element via `el._propertyEffects`.

### JavaScript vs binding syntax

It is important to note that bindings only support simple expressions and negations (`[[!foo.bar]]` and `[[foo.bar]]`), as explained [here](https://www.polymer-project.org/1.0/docs/devguide/data-binding.html#expressions-in-binding-annotations).

Often, I see people trying to do things like `{% raw %}{{arr.filter(filterFn)}}{% endraw %}` or `{% raw %}{{foo > bar }}{% endraw %}`. This will _not_ work, because of the above limitation.

Personally, I hope they never implement this ability because the lack of it forces a good practice of keeping all your logic in your class.

## Properties object

So far, we have only looked at implicit properties (properties created by having bindings to them).

If you have read the docs, you also know we can define a `properties` object on our element.

This object should really be seen as a definition (some meta data) of each property for more precise handling of it.

```javascript
{
	properties: {
		foo: {
			type: String,
			readOnly: true
		}
	}
}
```

As you can see, our foo may already exist because we bound to it somewhere, but we are now able to control it more.

To see what you can specify, see the documentation [here](https://www.polymer-project.org/1.0/api/#Polymer.Base:property-properties).

One note to make is, if you specify `readOnly: true`, this actually prevents our previously mentioned setter from ever being created. It does, however, create a private `_setFoo` method so we can set the value internally still.

### To gain two-way binding

To support two-way binding, our element must pass our property down to the child in _curly brackets_.

Additionally, the child must set `notify: true` on their receiving property and must not set `readOnly: true`.

The combination of these conditions means that the child can fire change events _upwards_ and the parent can send changes _downwards_.

Of course, if the child specifies `readOnly: true`, the parent is unable to pass changes _downwards_ to it. Similarly, if the child specifies `notify: false`, it won't pass changes _upwards_ to the parent.

### Types

If you specify a type, it is essentially used for attribute (de)serialisation.

What I mean by this is, if you have a property set to a literal value, Polymer will try to deserialise it into your specified type. Similarly, if your property uses `reflectToAttribute: true`, it will use your type to serialise before setting the attribute.

```html
<my-element foo="5"></my-element>
```

So in this example, with a type `Number`, Polymer will deserialise `getAttribute('foo')` into a number and set the property `foo` to the result.

## Property changes

Now, the very interesting stuff, how we actually propagate changes.

Using this example:

```html
<div>{% raw %}{{foo}}{% endraw %}</div>
```

Let's say we set `el.foo = 10`. If you remember from earlier, a setter exists for `foo`. Therefore, setting the value to `10` here will have called it and done the usual dirty checking to see if the value changed.

If the value did change, Polymer will then iterate over the property effects (our instructions from before) and find any which are associated to `foo`. When it finds any such effects, it will execute the instructions they define.

In our case, it will update the DOM such that the contents of our child `<div>` become `10`.

## Change notification

To get a little more into the internals of this, lets see how this works behind the scenes.

Each element holds a `_nodes` array, pretty much a collection of any children which have property bindings in them. Each property effect defines an index for the `_nodes` array, so we know which child node our effect is associated with.

When we change `foo`, Polymer iterates through our effects and checks if the associated node (`_nodes[effect.index]`) has a `_notifyPath` method. 

If the associated child does have a `_notifyPath`, it is a Polymer element. Polymer calls this method to repeat this same process in the child element until we eventually reach the bottom of the tree where there are no more bound children.

Additionally, if our `foo` defines `notify: true` in the properties object, Polymer will fire a `foo-changed` event.

Any parent nodes listening for this event will then set their associated property with the new value.

### One-way bindings and references

One important note is that one-way bindings are one-way in terms of *notification*, not necessarily in terms of *value*.

A one-way binding simply does not fire (or listen for) the `foo-changed` event. Of course, by reference the value can still have changed.

For example:

```html
<element-a>
	<element-b bar="{% raw %}[[foo]]{% endraw %}"></element-b>
</element-a>
```

Where `element-a` defines `foo` as `{% raw %}{ "a": 5 }{% endraw %}`.

If `element-b` changes `foo.a = 6`, `element-a` will _not_ be notified. *However*, `element-a` has the _same_ `foo` object as `element-b` (by reference), so both have the new value (if you access `el.foo.a` on each, it will be `6`).

## Finish off

This has been a pretty long post, hopefully it helps explain some of the internals of Polymer's data binding in a simple way.

After having spent my time in Angular, React and other frameworks so much, I have definitely started to prefer the Polymer library. The thought of observing objects, polling for changes and so on, feels dirty when presented with this simple notification system.
