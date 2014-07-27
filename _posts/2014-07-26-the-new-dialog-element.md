---
title: The new HTML5 dialog element
description: Using the new HTML5 dialog element to provide cross-browser dialogs without libraries.
layout: post
---

The HTML5 `dialog` element provides native dialog box functionality, such that no more libraries are needed to create such dialogs.

This will improve accessibility as the browser will know a dialog is a dialog, currently it does not. It will also allow cross-browser native dialog handling rather than relying on a third-party library.

## Simple Example

{% highlight html %}
<dialog>I am a dialog</dialog>
{% endhighlight %}

This will create a hidden dialog which has yet to be opened.

## Dialog API

We have three available methods, `dialog.show()`, `dialog.close()` and `dialog.showModal()`:

{% highlight javascript %}
var dialog = document.querySelector('#myDialog');

dialog.show();
// Dialog is now visible

dialog.close();
// Dialog is now hidden

dialog.showModal();
// Dialog is now visible as a modal
{% endhighlight %}

When using `dialog.showModal()`, the dialog is displayed in a modal-like fashion such that anything behind it cannot be interacted with.

You may also automatically open the dialog like so:

{% highlight html %}
<dialog open>I am a visible dialog</dialog>
{% endhighlight %}

If you choose to pass a value through `dialog.close()`, it will be assigned to `dialog.returnValue`.

## Styling a Dialog

The standard dialog styling isn't anything great, but that's no problem as this element can be styled like any other.

{% highlight css %}
dialog {
    border-radius: 6px;
    border: 1px solid rgba(0,0,0,.4);
    box-shadow: 0 0 5px rgba(0,0,0,.4);
}
{% endhighlight %}

You can also style the backdrop when using `showModal`:

{% highlight css %}
dialog::backdrop {
    position:fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.4);
}
{% endhighlight %}

After customising the CSS, you can quite easily have a dialog setup just like that of Bootstrap without the need for any third-party library.

## Use within forms

This new element also comes with the ability to set the `method` attribute of a form to `dialog`.

If you place a form inside a dialog and give it this method, the dialog will be closed on submission of the form. In addition to this, `dialog.returnValue` will be set to that of the submit button used.

{% highlight html %}
<dialog>
    <form method="dialog">
        <button type="submit" value="foo">Foo</button>
    </form>
</dialog>
{% endhighlight %}

Upon submission of the above form, `dialog.returnValue` will be `foo`.

## Give it a try

Chrome (37, beta) currently supports the `dialog` element, so go ahead and have a play around with it.

A demo can be found [here](http://jsfiddle.net/3xr9P/). If the dialog appears open on load, your browser does not yet support it.
