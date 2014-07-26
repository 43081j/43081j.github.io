---
title: Handling files in the browser
layout: post
description: Handling files in the browser using the HTML5/JavaScript File API constructors
---

With the introduction of the new `File` API in most modern browsers, it is now incredibly easy to deal with data in the browser compared to in the past. This combined with the typed arrays, such as `Uint8Array`, allows us to quite easily read and manipulate raw data.

## Reading files

The most common use case for wanting to read a file is that of *file uploads*. With the `File` API we can now read a user selected file in any way we want and even output a modified version of it.

When this API first became available, I created such things as [rar.js](http://github.com/43081j/rar.js) and [id3](http://github.com/43081j/id3). Both projects make heavy use of this API and the new, incredibly handy, typed arrays.

Here's an example:

{% highlight javascript %}
document.querySelector('#fileinput').addEventListener('change', function(e) {
	var files = this.files;
	var reader = new FileReader();

	reader.onloadend = function(e) {
		console.log(e.target.result);
	};
	reader.readAsArrayBuffer(files[0]);
}, false);
{% endhighlight %}

This is fairly simple, we get the `FileList` via `this.files` and use a `FileReader` to read it into an `ArrayBuffer`. Finally, we log the buffer to console, though we will need to use something like an `Int8Array` to actually output the data.

Of course, some extra code will be needed when handling large files this way to avoid loading too much into memory at any one time.

## Creating files

Canary has recently been updated with the addition of a `File` constructor, so you can now *create files* inside the browser.

{% highlight javascript %}
var file = new File(['foo', 'bar'], 'test.txt', { type: 'text/plain' });
{% endhighlight %}

Here, the first parameter is an array of parts just as with the `Blob` constructor. The second and third define the name and any additional options respectively (such as content type).

This will result in a `File` instance which can then be read and manipulated like any other. You may pass it to a `FileReader` or post it to be uploaded to a remote server, so the possibilities are endless.

## Go experiment

I definitely suggest you go check out the entire File API. You could quite easily write a parser of some sort or even something to manipulate files which the user can then download.
