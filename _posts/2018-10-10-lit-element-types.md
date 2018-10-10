---
layout: post
title: A Quick Note on Lit Types & Properties
description: A thought or two on using properties in Lit and types
---

This is going to be a brief one, just to keep a note _somewhere_ of how to
do these things and what they mean.

Lately, I've seen some confusion from the
[Polymer](https://www.polymer-project.org/) community and consumers of
the new [LitElement](https://github.com/Polymer/lit-element)...

The confusion? What are property types? How do we use properties? How
do things serialize and deserialize? How does this compare to Polymer?

Well here we are...

## Polymer

I'm going to assume if you're reading this, you're aware of how Polymer
works and how to use the basics of it.

We define a property like so:

```js
class MyElement extends PolymerElement {
  static get properties() {
    return {
      prop1: String,
      prop2: Boolean,
      prop3: Object,
      prop4: Array,
      prop5: { type: Array, notify: true }
    };
  }
}
```

Polymer does some wizardry around this so pretty much all primitives and
built in types are parsed correctly.

```html
<my-element prop4="[1,2,3]"></my-element>
```

The above will result in `prop4` being the array, `[1, 2, 3]` after
Polymer deserializes it.

Even `Date` is parsed correctly and `Object` is parsed as JSON.

## LitElement

Pretty much everyone who came from Polymer makes the mistake of trying the
same property types in Lit as they used in Polymer.

In Lit though, I suppose the idea is to remain lightweight, trimmed down and
lacking of any fancy logic like what Polymer had. This means **most of these
types are not supported out of the box**.

We define a property the same (which is why this assumption is an easy one to
make):

```js
class MyElement extends LitElement {
  static get properties() {
    return {
      prop1: { type: String },
      prop2: { type: Boolean },
      prop3: { type: Object },
      prop4: { type: Array }
    };
  }
}
```

**This won't work!**

Let's take a look:

* `<my-element prop1="foo">` gives us `node.prop1 === "foo"`
* `<my-element prop2="true">` gives us `node.prop2 === true`
* `<my-element prop2="false">` gives us **`node.prop2 === true`**
* `<my-element prop3='{ "foo": 5 }'>` gives us
**`node.prop3 === '{ "foo" : 5 }'`**
* `<my-element prop4="[1,2,3]">` gives us **`node.prop4 === "[1,2,3]"`**

You can see the last 3 are confusingly wrong. This is likely not what you
expected at all.

## How it works

**A property type in Lit is a serializer object or function.**

When we `node.setAttribute('prop1', 'foo')` or `<my-el prop1="foo">`, we
actually end up invoking `node.prop1 = String('foo')`.

Whatever we set our `type` to is used to deserialize the attribute value.

With `type: Foo`, we would result in `node.prop1 = Foo('foo')`.

It can be one of two possible types...

### A Function

```js
const deserializer = (str) => JSON.parse(str);
```

In this case, given the element above but with:

```js
{
  prop3: { type: deserializer, reflect: true },
  prop4: { type: deserializer, reflect: true }
}
```

We would end up with:

```html
<my-element prop3='{ "foo": 5 }'></my-element>
<!--
  node.prop3 would be the object { "foo" : 5 }
-->

<my-element prop4="[1,2,3]"></my-element>
<!--
  node.prop4 would be the array [1, 2, 3]
-->

<!--
  Setting node.prop4 = [4, 5, 6] will reflect:
-->
<my-element prop4="4,5,6"></my-element>
```

A function works when we only want special parsing but are happy with
`toString` when reflecting to the attribute.

You can see from the last example, we end up _serializing_ into `4,5,6` because
that is what `[4,5,6].toString()` results in.

### An Object

For cases where we want to handle serialization for reflecting values to
attributes, such as in the case of arrays, we need to provide an object:

```js
const deserializer = {
  toAttribute(val) {
    return JSON.stringify(val);
  }
  fromAttribute(str) {
    return JSON.parse(str);
  }
};
```

Now we see:

```html
<my-element prop4="[1,2,3]"></my-element>
<!--
  node.prop4 would be the array [1, 2, 3]
-->

<!--
  Setting node.prop4 = [4, 5, 6] will reflect:
-->
<my-element prop4="[4,5,6]"></my-element>
```

The value is serialized correctly!

### Built-ins

`Boolean`, `Number` and `String` do work out of the box, kind of.

Now that you know how it works:

```js
Boolean('true') === true
Boolean('false') === true
Number('5') === 5
String('foo') === 'foo'
```

You see, these constructors happen to behave the same way we want a
deserializer function to behave (though `Boolean` is _slightly_ different).

Boolean is different because Lit handles `null` as `false`, for you.

## Conclusion

It is a bit confusing, yes.

It definitely means your **Polymer properties are not compatible
with Lit**, as you likely use `Object` and such a lot.

Lit may end up implementing these common serializers, though, seeing as pretty
much everyone would expect to use them. We shall see, as it would also
introduce more weight into Lit and that is what the team wants to avoid.

Until then, keep an eye on a
[little repo](https://github.com/43081j/lit-element-serializers) I'm
playing around with as it aims to provide these common serializers
until there's a better solution (or forever if there never is one).

Enjoy!
