---
layout: post
title: Putting JavaScript Beacons to Use
description: Putting the new Beacon API to use for guaranteed onunload transmissions
---

Chrome 37 (Beta) and Firefox 31 see the introduction of the new `navigator.sendBeacon` method, this is one all those ad companies will love to get into their tracking scripts.

## What is a Beacon?

Currently, if we want to send some data when a user leaves the page, we must send a synchronous AJAX request because most browsers will disallow asynchronous requests in the `unload` event. 

As you can imagine, sending a synchronous request on unloading of the page will result in a slight delay for the user. If they navigate to another website, the other website will appear to load slower than it should, due to the browser needing to send the synchronous request off first.

Beacons solve this problem by the browser keeping a queue of small requests to be sent *eventually*.

## An example

{% highlight javascript %}
var data = new FormData();
data.append('foo', 'bar');

var beacon = navigator.sendBeacon('/api/analytics', data);
// beacon will be true if queued successfully
{% endhighlight %}

This will simply construct some form data and have the browser send it as a "beacon" when possible.

The `data` parameter here can be of other types too, such as a `Blob` or a string. So we can quite easily send any kind of data.

## Use cases

Clearly, this will see most use in sending analytical data back to the server after a user has finished their visit to the page. Values such as the time spent on the page, the links they clicked, performance metrics and so on.

It could be very useful in sending performance and error information back after each visit, especially in an under-development environment. You would be able to send such data back without interfering with speed of user navigation.

## A few notes

Beacons were made with the purpose of transmitting **small** amounts of data. From the current webkit source, it would appear that the limit is defaulted to **16 KiB**. If you attempt to send data larger than this, `sendBeacon` will return false.

It would also appear from the source that, if you give your `Blob` a type (e.g. `application/json`), it will be set as the `Content-Type` in the request to your server.
