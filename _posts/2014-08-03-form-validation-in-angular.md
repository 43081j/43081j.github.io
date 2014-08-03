---
layout: post
title: Form Validation in Angular.JS
description: Handling form validation in Angular.js using the newly introduced states and messages package
---

Form validation in Angular is already made incredibly easy by the two-way binding and so on, but the latest betas see the introduction of several new features too.

## Validation messages

In the past, you'd see something like this:

{% highlight html %}
<input type="url" name="foo" required>
<div class="validation" ng-show="form.foo.$error">
    <span class="help-block" ng-show="form.foo.$error.url">URL is invalid</span>
    <span class="help-block" ng-show="!form.foo.$error.url && form.foo.$error.required">URL is required</span>
</div>
{% endhighlight %}

As you can see, this will get fairly complex quickly, especially since we would like to only show one error at a time per input.

`ngMessages` solves this problem by providing a sort of wrapper around the usual validation concepts, such that your view may now look like this:

{% highlight html %}
<input type="url" name="foo" required>
<div class="validation" ng-messages="form.foo.$error">
    <span class="help-block" ng-message="url">URL is invalid</span>
    <span class="help-block" ng-message="required">URL is required</span>
</div>
{% endhighlight %}

By default, `ngMessages` will display the first error to have occurred during validation. You can, however, display multiple by setting `ng-messages-multiple` on the attributes.

This simplifies things a huge amount, as I myself found when developing a large scale Angular app recently.

Do remember, **the `ngMessages` module is not included by default**, you must include `angular-messages.js` in your code.

## Custom validation

Introduced in the `1.3` branch recently, the new `$validators` pipeline makes custom validation very easy. 

There has been misuse of the `$parsers` and `$formatters` properties of `ngModelController` for a while now, to implement custom validation. The former transforms user input before it reaches the model, while the latter transforms it before reaching the user. However, they were never made to be used for validation.

Now a custom validation rule as simple as:

{% highlight javascript %}
app.directive('myValidator', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, elem, attr, ctrl) {
            ctrl.$validators.myValidator = function(val) {
                // Return true/false for valid/invalid
                // Val is the model value, the user input
                return val.match(/^\d+$/);
            };
        }
    };
});
{% endhighlight %}

Use as a directive:

{% highlight html %}
<input type="text" my-validator name="foo">
{% endhighlight %}

Obviously, this could be implemented with `ngPattern`, but you can see how easy it would be to make more advanced rules.

The name you choose in `ctrl.$validators.myValidator` will become a key in the input's `$error` property, such as `$error.myValidator`. If your validator returns false, this will be set to true and no further validation will occur.

## Touches

We also see the introduction of the `$touched` and `$untouched` states. The best use for these is probably to display validation errors only after the user has moved away from the input.

It has been shown many times that immediate validation is a bother, it increases time taken to fill in a form and should be avoided. It is a lot better to display the errors *after* input has been entered.

{% highlight html %}
<input type="url" name="foo" required>
<div class="validation" ng-show="form.foo.$touched" ng-messages="form.foo.$error">
    ...
</div>
{% endhighlight %}

## Detecting submission

The problem of detecting form submission has been an issue for quite some time. 

For example, say we want to display server errors after submission or perform some animation to alert the user to their mistakes. Usually, we would need to set some property on our scope and handle such a state manually, possibly by setting `$scope.submitted` to true in `ngSubmit`.

However, we can now do the following:

{% highlight html %}
<div ng-show="form.$submitted">
    Some submission message
</div>
{% endhighlight %}

If you'd like to reset this state, do the usual `form.$setPristine()`.

## Wrapping up

So, these new states and the validators pipeline allow us to quite easily implement our own validation. 

For me, the validators pipeline simplifies everything greatly as we can just assign a handler and be done with it. No more fiddling with states manually and setting errors.

Additionally, the fact that we can now show errors after leaving the input is a huge benefit. Users have been shown to fill out forms much faster when they only receive an error after completing their input.
