---
layout: post
title: Polymer Tips & Tricks 1
---

This is the first in a series of posts about the various problems I have tackled while using [Polymer](https://polymer-project.org/).

Over the last several months, I have been working hard on a Polymer-based iOS app, using [Cordova](https://cordova.apache.org/). I have met many, many bumps in the road along the way and this will be essentially a log of my solutions to the problems I encountered.

## Sorting/Filtering an `iron-list`

Have you ever tried to sort or filter an iron-list? Not such a simple thing to do, and most solutions are rather inefficient.

In my app, I have a large list of cards which are filtered based on the category they should appear for and sorted based on date. This means I can hold one single array of all cards in memory (from [Firebase](https://firebase.google.com/)) and simply filter it when the user changes category.

Easy in `dom-repeat`:

```html
    <template is="dom-repeat" items="{% raw %}{{cards}}{% endraw %}" sort="_sortFn" filter="_filterFn">
        <my-card item="{% raw %}{{item}}{% endraw %}"></my-card>
    </template>
```

However, this is horribly inefficient and resulted in my app using ~300MB of memory on an iPad. Why? Because all cards exist in view at once (even if below the fold) and must have their layout re-calculated on several occasions when actions elsewhere occur.

Anyhow, the clear solution is to use an iron-list:

```html
    <iron-list items="{% raw %}{{cards}}{% endraw %}">
        <my-card item="{% raw %}{{item}}{% endraw %}"></my-card>
    </iron-list>
```

But, we have no way to filter or sort the cards like in a dom-repeat (there is an [issue](https://github.com/PolymerElements/iron-list/issues/123) open for this).

The solution most people, including myself, seem to come up with is a computed binding:

```html
    <iron-list items="{% raw %}{{_sortAndFilter(cards)}}{% endraw %}">
```

Where `_sortAndFilter` returns the sorted and filtered array. Here is a list of each binding I tried and why it was a bad idea:

* `_sortAndFilter(cards)`:  It is computed only when the entire array changes. Splices and sub-property changes don't propagate.
* `_sortAndFilter(cards.splices)`: Sub-property changes don't propagate. Array is fully recomputed each time a child is moved/removed/added.
* `_sortAndFilter(cards.*)`: Array is fully recomputed each time any change occurs.

In all these cases, the array is fully recomputed on any change, so iron-list is forced to do a full refresh. This means you'll likely lose your scroll position, too, a horrible experience for users.

### Solution

My solution to this, which you can find [here](https://github.com/43081j/array-filter), is an element which essentially holds a copy of the initial array with any sorts and filters applied.

```html
    <array-filter items="{% raw %}{{cards}}{% endraw %}" filtered="{% raw %}{{_cards}}{% endraw %}" filter="_filterFn" sort="_sortFn"></array-filter>
    <iron-list items="{% raw %}{{_cards}}{% endraw %}"
```

The way this works internally is:

* Observe `items.*`
* Use [`linkPaths`](https://www.polymer-project.org/1.0/docs/api/Polymer.Base#method-linkPaths) to link each item's change paths in source and filtered array, so sub-property changes propagate
* Sort/filter splices and splice them into the filtered array in order, rather than recomputing the whole array

## dom-if inside an iron-list

Before I explain this, I **do not recommend** using a dom-if to filter out iron-list items. Please use the solution in the previous section.

```html
    <iron-list items="{% raw %}{{items}}{% endraw %}">
        <template is="dom-if" if="[[item.enabled]]">
            <div>[[item.id]]</div>
        </template>
    </iron-list>
```

Many of you have tried the above before and, soon enough, found that it doesn't work and causes iron-list to flip.

The reason for this is because iron-list will assume the template elements are children, it will try position them like any other child. To solve this, wrap it like so:

```html
    <iron-list items="{% raw %}{{items}}{% endraw %}">
        <div>
            <template is="dom-if" if="[[item.enabled]]">
                <div>[[item.id]]</div>
            </template>
        </div>
    </iron-list>
```

This also has its issues though. If `item.enabled` changes at some point or simply isn't immediately available, the size of your item will change and confuse iron-list. So you must have something like:

```html
    <template is="dom-if" if="[[item.enabled]]" on-dom-change="_onDomIfChange">
```

Inside `_onDomIfChange`, simply do something like:

```javascript
    _onDomIfChange: function(e) {
        var item = this.$.list.modelForElement(e.currentTarget.parentElement).item;
        this.$.list.updateSizeForItem(item);
    }
```

## Preventing duplicate `iron-a11y-keys` events

When using `iron-a11y-keys` with multiple key combinations, it is possible that one combination may contain the other:

```html
    <iron-a11y-keys keys="shift+enter enter" ...></iron-a11y-keys>
```

If you listen for the `keys-pressed` event, you'll soon find that when you press `shift+enter`, you get 2 events: one for `shift+enter`, one for `enter`.

To stop any further events firing, it turns out you must `preventDefault()` on the **keyboardEvent**, not on the event you are given:

```javascript
    _onKeysPressed: function(e) {
        e.detail.keyboardEvent.preventDefault(); // works
        e.preventDefault(); // does not work
    }
```

You can see this in a demo [here](http://jsbin.com/funebehoxa/edit?html,console,output).

Thanks to [ergo](https://github.com/ergo) for finding this.
