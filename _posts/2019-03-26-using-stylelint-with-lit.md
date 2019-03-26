---
layout: post
title: Using stylelint in a lit-element project
description: A quick guide to using stylelint with a lit-element project
---

<div align="center">
  <img
    src="https://i.imgur.com/aAwxLFD.png"
    alt="Lint all the things"
    width="200"
    height="200" />
</div>

## stylelint + lit-element = good times

As some of you know, lately I've been very much involved in a few
[linting](https://github.com/43081j/eslint-plugin-wc)
[projects](https://github.com/43081j/eslint-plugin-lit)
as well as spending plenty of time contributing to the linters themselves.

One thing I've been missing so far in my own projects is the ability
to lint my CSS so I can easily enforce best practices and, more importantly,
detect potential problems in my rules/syntax.

This has been possible in projects which use CSS as-is for some time, using
the excellent open source [stylelint](https://github.com/stylelint/stylelint).

However, it has been a bit of a struggle when using a project like
[lit-element](https://github.com/Polymer/lit-element) due to the fact that
most or all stylesheets are contained within template literals (for several
reasons I won't go into here).

A PR or two recently got merged, though, so it is no longer such a struggle!

## A lit element

Here's an example element which uses lit, so you get an idea of how
a stylesheet might look in this case:

```ts
class FooElement extends LitElement {
  static get styles() {
    return css`
      :host { display: block; }
    `;
  }

  render() {
    return html`<h1>I'm some content!</h1>`;
  }
}
```

## The problem & solution

As mentioned before, the problem here is that the styles exist inside
a template literal rather than an actual stylesheet (i.e. a css file).

Due to this, stylelint can't lint it out of the box as it has no idea
how to extract the CSS.

Here is where the very useful
[stylelint-processor-styled-components](https://github.com/styled-components/stylelint-processor-styled-components)
processor comes in handy and can be _gently pushed_ to into supporting our
needs.

This handy little processor allows stylelint to extract CSS from
[styled-components](https://github.com/styled-components/styled-components)
which look a bit like this:

```tsx
const MyTitle = styled.h1`
  color: hotpink;
`;

// This is rendered with hotpink color
<MyTitle>Some Title</MyTitle>
```

Looks familiar, right? If only we could tell the processor to look for
`css` templates rather than `styled` templates, right??

We're in luck! This processor allows you to define which module
and which import name to extract CSS from with a bit of config:

```js
{
  "importName": "css",
  "moduleName": "lit-element",
  "strict": true
}
```

Each of these has the following meaning:

* `importName` specifies which function to parse template strings for
* `moduleName` specifies which module the function we specified must be
imported from (to avoid parsing non-lit `css` functions)
* `strict` specifies that we only want to parse this specific import
from the module we specified

The `strict` flag is a recent addition from me. I added it because
the processor's default behaviour is to extract CSS from _all_ lit-element
imports, which means it will try (and fail...) to lint `html` contents too.
This flag pretty much enables a little stricter parsing so only the named
import is parsed.

## Setup

So this'll be fairly straight forward!

### Install

```
$ npm i -D stylelint
  stylelint-processor-styled-components
  stylelint-config-recommended
  stylelint-config-styled-components
```

### Configure

Create a `.stylelinrc.json`:

```json
{
  "processors": [
    [
      "stylelint-processor-styled-components",
      {
        "moduleName": "lit-element",
        "importName": "css",
        "strict": true
      }
    ]
  ],
  "extends": [
    "stylelint-config-recommended",
    "stylelint-config-styled-components"
  ]
}
```

Simple. We enable the processor, then we tell it to only parse CSS
from lit-element's `css` template function and we extend the provided
configs to do some bits of leg work for us.

### Run it!

```
$ npx stylelint "src/**/*.js"
```

Add it to your `package.json` as a script, too, to make things a little
easier:

```json
{
  "scripts": {
    "lint:css": "stylelint \"src/**/*.js\""
  }
}
```

## Wrap up

I was stuck for quite some time having literally no clue how on earth
I lint some "pseudo-CSS" from inside some template expression. A few people
seemed to be in the same situation, so I hope this helped you out and
gave a good idea of the direction to head in.

Don't forget to try out a code formatter too, such as
[prettier](https://github.com/prettier/prettier)! You should totally make
use of something like this instead of relying on stylistic lint rules.

I had such crazily customised lint rules until I came to the revelation that
I just need to format code automatically instead of relying on _mere humans_.
Now our development process is much smoother, highly recommended.

Anyhow, enjoy becoming as much of a pain as I am with my error-level max
line length and JSDoc rules :x
