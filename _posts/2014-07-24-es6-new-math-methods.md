---
title: Using the new Math methods in ES6
layout: post
description: ES6 introduces several new Math methods which come in extremely handy, now available in Chrome Canary.
---

Canary releases are getting better and better each time. This time, we see the introduction of several useful `Math` functions implemented according to the [ES6 specification](https://people.mozilla.org/~jorendorff/es6-draft.html).

I spend quite a large chunk of time working on mathematical applications so these are a very nice addition for those of you in similar shoes.

## clz32

`clz32` (Count Leading Zeroes 32) does what it says on the tin, it counts all leading zeroes in the 32-bit representation of the provided int.

The easiest way to show this is using the binary notation of a 32-bit integer like follows:

{% highlight javascript %}
// 64
0b1000000;

// 25 (32 minus 7 digits)
Math.clz32(x);
{% endhighlight %}

## hypot

As the name says, `hypot` calculates the hypotenuse (yay pythagoras!), the usual `sqrt(a^2 + b^2)` but with the ability to provide any number of arguments like so:

{% highlight javascript %}
// sqrt(a^2 + b^2 + c^2)
Math.hypot(a, b, c);
{% endhighlight %}

## trunc

Native truncation functionality. This would be calculated by using `ceil` when the value is less than zero and `floor` greater than or equal to zero. However, now it is as simple as:

{% highlight javascript %}
// 3
Math.trunc(3.1415927);
{% endhighlight %}

## sign

A very handy function to get the sign of a value, useful in a bunch of places:

{% highlight javascript %}
// 1
Math.sign(10);
// -1
Math.sign(-10);
// 0
Math.sign(0);
// -0
Math.sign(-0);
// NaN
Math.sign(NaN);
// 0
Math.sign(Infinity);
{% endhighlight %}

As you can see:

- `1` is positive
- `-1` is negative
- `0` is positive zero
- `-0` is negative zero
- `NaN` is NaN

## A few more

This release also sees the introduction of these handy functions:

- `log10` to calculate the base 10 logarithm
- `log2` to calculate the base 2 logarithm
- `log1p` to calculate the natural logarithm
- `expm1` to calculate `exp(x) - 1`
- `imul` for 32-bit multiplication
- `fround` to round a number to single precision
- `cbrt` to perform a cube root
