---
layout: post
title: Thoughts on JavaScript's spread operators
---

Just a quick thought...

The spread operator is a cool little thing, it looks like this:

```javascript
const foo = {
    "a": 1,
    "b": 2
};

const bar = { ...foo, "c": 3 };
```

Where supported, it comes in useful for many things, such as the ability to concatenate and copy arrays/objects with ease.

## Pass all the things!

I recently converted a React project to use TypeScript, it was all going great until this snippet:

```javascript
render() {
    return <Foo {...this.props} />;
}
```

This simple line threw a bunch of compilation errors. Why? Well, `Foo` doesn't have the same properties as `this`. The two components are hugely different, with `Foo` sharing only one or two properties in fact.

So, we were originally relying on the fact that _some_ of the properties did match up and it was enough for the application to work correctly.

I would much rather have the more verbose code:

```javascript
render() {
    return (<Foo
        x={this.props.x}
        y={this.props.y}
        z={this.props.z}
    />);
}
```

You can quickly see exactly what is being passed to `Foo` and where from. Whereas with the old code, it was far from clear what it contains without looking through the props.

## Thoughts?

Be careful with your props, guys!

You should totally give TypeScript a go if you haven't already, too. I would highly recommend you check it out. I would have never noticed this lazy piece of code if not for the great type checking and inference.

What do you think? [Tweet me](https://twitter.com/43081j)
