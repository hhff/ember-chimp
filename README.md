# ember-chimp
[![Build Status](https://travis-ci.org/hhff/ember-chimp.svg)](https://travis-ci.org/hhff/ember-chimp)
[![npm version](https://badge.fury.io/js/ember-chimp.svg)](http://badge.fury.io/js/ember-chimp)
[![Ember Observer Score](http://emberobserver.com/badges/ember-chimp.svg)](http://emberobserver.com/addons/ember-chimp)

A simple Ember component for nicer, ajax style Mailchimp list signup forms.

## Installation

`ember install ember-chimp`

## Basic Usage

Create a list in your Mailchimp account, grab its unique form action URL 
from the embeddable forms section, and then drop in the `ember-chimp` component 
like so:

```html
{{ember-chimp formAction="//your.mailchimp.form.action"}}
```

**Note:** Like all attributes in Ember, this can be dynamic.  Use a controller
variable to switch list URL dynamically, such as a i18n `locale` based list.

**Important:** This lib uses Babel to transpile ES2015.  Some mobile browsers
will throw an error unless the Babel Browser Polyfill is included in your
`Brocfile`.  There isn't currently a standard way to do this.

## Advanced Usage

The `ember-chimp` component is built to serve a wide variety of use cases:

* **label & placeholder**

```html
{{ember-chimp formAction="//your.mailchimp.form.action"
              label="Join our Mailing List:" 
              placeholder="Email Address"}}
```

Optionally pass a `label` and `placeholder` attribute.  They work as you'd
expect.  The label is always `for` the email input.

* **buttonText & loadingText**

```html
{{ember-chimp formAction="//your.mailchimp.form.action"
              buttonText="Submit" 
              loadingText="Loading..."}}
```

The `buttonText` attr is the text on the submit button.  This changes to
`loadingText` on submit.

**Note:** `loadingText` also populates the `.chimp-says` div when loading.  To
hide that text, you can use the `.loading` chimpState className, like below.

* **Custom & Dynamic Responses**

In your `controller`:

```js
emberChimpResponses: {
  success: 'Please click the link in the email we just sent you.',
  error: 'Oops, something went wrong.  Please try again.',
  invalidError: 'Please enter a valid email address.',
  attemptsError: 'Please try again in about 5 minutes.'
}
```
Then in that controller's template:

```html
{{ember-chimp formAction="//your.mailchimp.form.action"
              responses=emberChimpResponses}}"
```

**Note:** This can be used alongside your Internationalization plugin to show
responses for your `locale`.

* **chimpState Class Name**

```scss
.ember-chimp {
  &.idle, &.loading {
    .chimp-says {
      display: none;
    }
  }

  &.success {
    .chimp-says {
      background-color: palegreen;
    }
  }
  
  &.error {
    .chimp-says {
      background-color: antiquewhite;
    }
  }
}
```

The `ember-chimp` component can have the `success`, `error`, `idle` and
`loading` classNames, depending on it's state.

You can use these classes for smooth CSS transitions between states.

* **ember-chimp-template Generator**

`ember generate ember-chimp-template`

Will install the default `ember-chimp` template into your host app, at
`app/templates/components/ember-chimp`, for easy customization.

* **novalidate**

```html
{{ember-chimp formAction="//your.mailchimp.form.action"
              novalidate=false}}
```

We add the `novalidate` attribute to the `form` element by default.  If you'd
like to use native browser validation, pass `false`.

* **Bubbling Action**

Pass an `action` name to the `ember-chimp` component to allow other parts of
your application to be aware of the component's status.

```html
{{ember-chimp formAction="//your.mailchimp.form.action"
              action="emberChimpDidSubmit"}}
```

Then in your `controller` or `route`:

```js
actions: {
  emberChimpDidSubmit(promise) {
    promise.then(
      (response) => {
        if (response.result === 'success') {  
          console.log("Ember Chimp submitted Successfully!");
        } else {
          console.log("Ember Chimp error message:" + response.msg);
        }
      }, () => {
        console.log("Ember Chimp had an Ajax Error.");
      }     
    );
  }
}
```

* **Additional Fields (experimental)**

The `ember-chimp` component theoretically also posts other fields within the
`form` element.  To add fields in the post payload to Mailchimp, run the
`ember-chimp-template` generator, and add your custom fields, like so:

```html
<!-- app/templates/components/ember-chimp -->

<label {{bindAttr for="emailInput.elementId"}}>{{label}}</label>
{{input placeholder=placeholder viewName="emailInput" value=value type="email" name="EMAIL"}}

{{input value=firstname name="FIRSTNAME"}}
{{input value=lastname name="LASTNAME"}}

<button type="submit">{{if isLoading loadingText buttonText}}</button>
<div class="chimp-says">{{chimpSays}}</div>
```

The data payload with be serialized like so:

```js
{
  EMAIL: "me@hughfrancis.me",
  FIRSTNAME: "Hugh",
  LASTNAME: "Francis"
}
```

If anyone is using `ember-chimp` for this - please let me know whether it works.  
I haven't needed to do this as of yet.
