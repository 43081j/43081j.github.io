---
layout: post
title: Using ESLint with TypeScript in 2019
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

This'll change/improve **very soon** as rules are already beginning to make use
of the type system.

## Using ESLint on TypeScript today

Install:

```
$ npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

Configure `.eslintrc.json`:

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

## Recommendations

### Choose compilation options over lint rules

You should usually choose compilation checks which the TypeScript
compiler handles rather than relying on the looser lint rules.

In particular, disable the `@typescript-eslint/no-unused-vars` rule and use
the following options in your `tsconfig.json` instead:

```ts
{
  "compilerOptions": {
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "strict": true // This is useful too, to enable several strict checks
  }
}
```

### Naming conventions

Another useful one is member naming conventions:

```json
{
  "rules": {
    "@typescript-eslint/member-naming": ["error", {
      "private": "^__",
      "protected": "^_"
    }]
  }
}
```

This will enforce a convention many people already follow:

* Private members begin with `__`
* Protected members begin with `_`

With the introduction of private class fields coming soon, this may well
become redundant in future so use it as you feel best.

It is more of a personal preference.

### Use a code formatter

I've tried having very strict lint rules for formatting, checking things
like indentation, spacing and trailing commas.

It always results in a painful development process unless you just happen
to have a personal preference for the exact same style. This is of course very
unlikely as we all have our own opinion.

A much better solution is to **disable all formatting related lint rules**
and instead use a formatter.

Two I use are:

* [prettier](https://prettier.io/)
* [clang-format](https://clang.llvm.org/docs/ClangFormat.html)

I'm gradually moving towards prettier, _I think_, but both generally do
a good job (and offer different styles so it is far from "which is best?").

I use the following `.prettierrc`:

```
---
bracketSpacing: false
printWidth: 80
semi: true
singleQuote: true
tabWidth: 2
useTabs: false
arrowParens: always
```

I use the following `.clang-format`:

```
BasedOnStyle: Google
AlignAfterOpenBracket: AlwaysBreak
AllowAllParametersOfDeclarationOnNextLine: false
AllowShortBlocksOnASingleLine: false
AllowShortCaseLabelsOnASingleLine: false
AllowShortFunctionsOnASingleLine: None
AllowShortIfStatementsOnASingleLine: false
AllowShortLoopsOnASingleLine: false
BinPackArguments: false
```

Generally, ESLint will play nicely with both of these as long as you
remembered to turn off any
[stylistic rules](https://eslint.org/docs/rules/#stylistic-issues).

### Use a `.editorconfig` file

One last thing which isn't so much ESLint related is something I'd just
like to see people do more often.

Get into the habit of introducing a [`.editorconfig`](https://editorconfig.org)
file like so:

```
[*]
end_of_line = lf
indent_size = 2
indent_style = space
trim_trailing_whitespace = true
```

This makes your codebase _much_ easier to edit by other people while
maintaing the same whitespace and indentation rules.

Almost all editors support this out of the box.
