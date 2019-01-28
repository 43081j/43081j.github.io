---
layout: post
title: First thoughts on Deno, the JavaScript/TypeScript run-time
description: First thoughts on using the new JavaScript/TypeScript run-time
built on top of V8: Deno.
---

<div style="text-align: center">
  <img src="https://deno.land/deno_logo.png" alt="Deno" width="150" height="134" />
</div>

## Deno? What's that?

I found myself a little unproductive recently, so took a quick look at
[GitHub's trending repos](https://github.com/trending) page to see if there's
anything cool and new to have a read of.

One of the top results was [Deno](https://github.com/denoland/deno). This
was interesting for a few reasons:

* Written in [Rust](https://www.rust-lang.org/) (this of course meant I had
to tell my good friend & "rustacean"
[@willspeak](https://twitter.com/willspeak) who loved the logo choice more
than anything)
* Natively supports both JavaScript and
[TypeScript](https://www.typescriptlang.org/)
* **Implements ES modules just like a browser**

All of these points are of course _excellent_...

<div style="text-align: center">
  <img src="https://i.imgur.com/JLOQVRZ.gif" alt="Excited GIF" />
</div>

## Why would I need it?

**It is easiest to think of deno as an alternative to NodeJS.** It aims to
solve the same problem ultimately.

Node currently struggles a lot with playing nicely with newer APIs and
especially ES modules, though. This is where deno comes in, as it
aims to implement things the same as browsers do.

You and I would likely choose to use it if we wanted a **single code base
that can be used in browsers and server-side as-is.**

## Trying it out

Deno is just another run-time for a language we already know, so your code
will pretty much be the same as it would in a browser (ignoring standard
library differences for now).

Here's one of the examples from their docs:

```ts
import { listen, copy } from "deno";

(async () => {
  const addr = "0.0.0.0:8080";
  const listener = listen("tcp", addr);
  console.log("listening on", addr);
  while (true) {
    const conn = await listener.accept();
    copy(conn, conn);
  }
})();
```

Then to run it:

```
$ deno foo.ts
deno requests network access to "listen". Grant? [yN] y
listening on 0.0.0.0:8080
```

You can also see here the security part of Deno (which I won't be going into),
in that it has plenty of control over permissions of a script.

## Thoughts

A word of warning, most of these are going to be fairly technical points
which most people wouldn't be so concerned about but do affect all of us.

I'll be explaining these points with the assumption that you've gone
ahead and
[tried deno out yourself](https://github.com/denoland/deno/blob/master/Docs.md).

### Basics

If we're not so concerned about the technical differences and differing
implementations of internals, both Node and deno behave _very_ similarly.

Though, once it has matured, I think deno will be a good contender for us
to all move to.

Imagine writing all your projects, both libraries and apps, in one way and
having it work in both browsers and on the server just as-is. It would be
an amazing developer experience, and that is where deno is already at.

### Modules

One of the big problems with Node right now is that they're in a difficult
position of trying to remain compatible with their own module system
(`require`) and the one defined in the spec (`import`).

Deno is great here, it doesn't care about Node's old off-spec module
system and only implements what is in the spec, ES Modules:

```ts
// Deno & Browsers
import {Foo, Bar} from './my-module.js';

// Node (CommonJS)
const {Foo, Bar} = require('./my-module.js');
```

Modules are the greatest part of deno, for me, as it means we can have
sources which work in **both browsers and deno** without the need
for changes or a build process.

### Package locks, manifests, etc.

A thing I think is _kinda_ missing from deno is the concept of a manifest
and possibly also a lock file.

**Deno recommends checking your dependencies into source control** so the
run-time can associate the imports with those files instead of trying
to retrieve them each time.

This does get around the need for a lock file, I suppose, but it feels a
little unconventional committing my dependencies to git...

Also, it seems like we're dependending entirely on the dependency
URLs not changing in order to keep the same dependency graph between builds.
But what if a someone changes a git tag, or a branch, or the URL simply
vanishes? An uncached build would have plenty of trouble or a dependency
could unknowingly be changed.

As for a manifest, deno recommends creating a `package.ts` or some such
file:

```ts
// package.ts
export {Foo, Bar} from 'https://foo.bar/branch/some-package.ts';

// mod.ts
import {Foo, Bar} from './package.ts';
```

### The standard library...

Here's where deno really becomes an obvious early-stages project which
needs a lot of TLC before it can be anything more than an experiment.

Just a few issues I have with it:

* No clear process around what is included (who decides what modules
are introduced, or what they provide?)
* Some modules seem rushed (the datetime module is a good example,
[parsing via a bunch of conditionals](https://github.com/denoland/deno_std/blob/4b054d69ad3e63e0a07d0df77a973b0ae5e0892d/datetime/mod.ts#L10))
* Tests are lacking in some modules
* Not all modules follow the same structure, conventions, etc.

I think this drills down to it being written by a very small group of
people without any well defined process in place. Hopefully, that will change
in future.

### Compared with browsers

Being that deno tries to simply implement the same specs that browsers do,
it should mean all code is portable (after TypeScript transpilation at
least).

This seems to be true, but there are still some minor issues around it.

For example, deno requires extensions on all imports but the TypeScript
language service (which editors like VSCode use) doesn't currently
like this and complains.

A few other issues exist around this area from what I remember, but all
will be cleaned up/solved in time I am sure.

## Wrap up

So to wrap up, I think deno is great and a major step forward. What Node
doesn't dare do (a major breaking change for them), deno can and has done.

This is leading us to a much cleaner, much simpler solution which is aligned
perfectly with browsers. This is the way things should be.

I do hope it gets plenty of care, cleanup and so on. Eventually, I'd like
to see it at a point where we can all use it without any issues
and start enjoying having a single code base for all platforms.

Oh and of course, the logo is excellent.
