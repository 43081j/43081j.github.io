---
layout: post
title: Avoiding the TypeScript `any` type
description: Reasons to avoid the `any` type and what to do instead
---

Lately, I've been spending a bit of time moving a few different projects
to use `strict: true` in the TypeScript compiler, as well as enabling
a _large_ amount of lint rules.

One of these rules was **no-any**.

While this does mean everyone now hates me, it has also lead to people on
these projects learning and understanding the type system of TypeScript much
more than they previously did.

So here's a few things we learnt by avoiding the `any` type...

## It isn't bad

The `any` type isn't necessarily a bad thing and, in actual fact, does still
come in useful sometimes. However, in most cases, there is a better alternative
that leads to having better defined types overall.

Anyhow, with that out of the way...

## `unknown` can usually be used instead

The [`unknown`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type)
type is relatively new, introduced in TypeScript 3.0.

It is similar to `any` in that it can be "anything", but has one huge
difference: it can only be interacted with once we know the type (through
something like a type guard or inference).

A quick example:

```ts
const foo: any = "foo";
const bar: unknown = "bar";

foo.length; // Works, type checking is effectively turned off for this
bar.length; // Errors, bar is unknown

if (typeof bar === 'string') {
  bar.length; // Works, we now know that bar is a string
}
```

In most cases, you can do the ol' switcheroo and `unknown` will work fine
where you once had `any`. Just be ready for a ~~painful~~ _fair_ amount of
changes needed to add type guards or casts throughout your code...

## `Record` can be used for basic objects

A common thing i've seen is the use of `any` in parsing API responses
(e.g. JSON) as the type of the objects may not always be known.

More than likely, such objects are... objects. So give `Record` a try
instead:

```ts
const foo: any = { a: 1, b: 2 };
const bar: Record<string, number> = { a: 1, b: 2};

foo.a; // Anything
bar.a; // Number

const obj = JSON.parse(response) as Record<string, unknown>[];
obj[0].id; // unknown but we can at least access it correctly
```

As you can see, it can work well to combine this with `unknown` too if you
have more complex objects and you'll at least have better than any.

## Explicit types are easier to understand and read

This is more about types in general than just `any`, but we often had
cases like this:

```ts
function doSomething(obj: Model) {
  if (obj.x) {
    return doAnotherThing(obj);
  }
  if (obj.y) {
    return obj.y;
  }
  return null;
}
```

This isn't a great example, but it is already difficult from a glance
at the function to know what it returns.

If we instead had:

```ts
function doSomething(obj: Model): XModel|YModel|null {
```

It is much clearer. This also applies to non-obvious variables and
anything else you leave for the compiler to infer, too.

It is true that editors will be able to show you this information either way,
but I think it is still nice to have explicit types so the code its self
is readable regardless of tooling.

## Well-defined types are lovely

You'll soon realise how nice well-defined types are to work with. It is
most definitely worth the initial pain of forcing yourself to define
_everything_.

I often see objects in JavaScript and wonder, "alright, but what is it?", when
I see it being dotted into. It is such a pleasant developer experience when
everything has a definition you can easily read through and understand.

This, combined with good editor support will leave a smile on your face:

![Tab-completion](https://i.imgur.com/grGGejR.png)

As you can see, without is _just terrible_.

## You can contribute third-party types

Most of us have reached a point where we try to import a third-party
dependency and it has no types, so we're either left with a nasty compile
error or we were naughty and turned the most lenient compile options on...

We're all in need of good, strong types for popular dependencies. So
if you do find yourself in such a situation, please do write them and
contribute them to [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)
or the project its self!

It will be of great help to all people who reach the same problems
you have in future.

## You will learn more advanced types

As you go deeper into the type system and start defining much more
complex objects, you'll learn a lot of fun things.

Things you once thought were too dynamic or difficult to strongly
type will end up being easy for you.

A few good examples of what we can do are:

* [Conditional types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#conditional-types)
* [Type guard functions](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards)
* [Mapped types](https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types)

## Wrap up

So to wrap up:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedParameters": true,
    "noUnusedLocals": true,
    "noImplicitReturns": true
  }
}
```

Then, if you're ready for it, enable ESLint with the
[no-explicit-any](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-explicit-any.md)
rule at error level.

Do this, take the hit and you will thank yourself later :)
