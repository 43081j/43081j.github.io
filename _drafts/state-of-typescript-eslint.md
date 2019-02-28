
---
layout: post
title: The State of TypeScript & ESLint in 2019
description: Linting TypeScript projects in 2019 and the way forward
---

For some time, the common solution to linting a TypeScript project has been
to use [TSLint](https://github.com/palantir/tslint) and the standard for
linting JavaScript has quickly become [ESLint](https://eslint.org/).

Recently, though, TSLint
[announced](https://medium.com/palantir/tslint-in-2019-1a144c2317a9) that
they were now going to work on the convergence of the two projects.

This is great news! However, some things should be cleared up and an example
of how we should now be linting our projects would be useful...

## ESLint already supported TypeScript for some time

ESLint has supported TypeScript for quite some time through its
[typescript-eslint](https://github.com/typescript-eslint/typescript-eslint)
plugin and parser.

Quite a few people have asked me what they should do until TSLint "converges"
with ESLint. The answer is pretty much that **they already converged**,
long ago. TSLint's blog post was a little unclear here, but do understand
you can already lint your TypeScript without TSLint.

## ESLint rules can still be used

TSLint wasn't the best approach to linting TypeScript, in my opinion. The
correct solution was the one we're now seeing: building support into the
linter everyone else already uses.

Due to TSLint's standalone approach, it meant you couldn't use any of your
usual ESLint rules and plugins but rather could only use their built in ones.

Now that you can use ESLint's own TypeScript support, it means
**you can use any other ESLint rules and plugins** in addition to your
TypeScript rules.

## ESLint is still a _little_ behind

Unfortunately, not all TypeScript-specific rules in ESLint make full use
of the TypeScript type system yet. Commonly, they operate on the JS
_after_ transpilation has happened so some information can be lost.

Part of TSLint's contributions (and plenty of other people already
contributing to this) will be to add type-system knowledge to the rules
so much stronger assertions can be built.

For now, this is still in progress for many rules.

## Using ESLint on TypeScript today

Install:

```
$ npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

Configure:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "env": {
    "browser": true
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2017,
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint/eslint-plugin"
  ],
  "rules": {
  }
}
```

Run:

```
$ eslint "src/**/*.ts"
```

Easy as that!

## Recommended tweaks/tips

I would personally recommend you disable the
`@typescript-eslint/no-unused-vars` rule. This can and should be replaced with
the following entries in your `tsconfig.json`:

* `"noUnusedLocals": true`
* `"noUnusedParameters": true`

More to do with ESLint as a whole than just `@typescript-eslint`, you should
probably disable stylistic rules such as `indent` and use a code formatter
instead.

I use [prettier](https://prettier.io/) in half of my repositories and
[clang-format](https://clang.llvm.org/docs/ClangFormat.html) in the other
half (gradually moving towards prettier, _I think_).
