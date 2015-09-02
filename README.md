# Spree-ember-paypal-express
[![Build Status](https://travis-ci.org/aethermx/spree-ember-paypal-express.svg?branch=master)](https://travis-ci.org/aethermx/spree-ember-paypal-express)
[![Code Climate](https://codeclimate.com/github/aethermx/spree-ember-paypal-express/badges/gpa.svg)](https://codeclimate.com/github/aethermx/spree-ember-paypal-express)

[spree-ember](https://github.com/hhff/spree-ember)
addon for the gem
[better_spree_paypal_express](https://github.com/spree-contrib/better_spree_paypal_express)

Currently this addon is meant to be used with Spree `2-4-stable`.

## Install

    # not available yet, coming soon
    ember install spree-ember-paypal-express

## Dependencies

### Backend

The following fork of `better_spree_paypal_express` is needed because it has two things:

 * The changes of [PR #168](https://github.com/spree-contrib/better_spree_paypal_express/pull/168)
 * `active_model_serializers` version `0.8.2`

Add to your Gemfile:

    gem 'spree_paypal_express', github: 'givanse/better_spree_paypal_express', branch: 'ams_0.8.2'

### Frontend

  * [spree-ember-storefront](http://www.spree-ember.com/storefront/index.html) - 0.0.1-beta.1

## Usage

This addon adds an ember service, `paypal-express`, and it is injected into
the `spree` service so you can access it from anywhere in your code. Ex:

```bash
  actions: {
    initPaypalExpress: function() {
      this.spree.paypalExpress.getRedirectURL().then(response => {
        // redirect to PayPal express
        window.open(response.redirect_url, '_self');
      });
    }
  }
```

When a payment is completed through PayPal, the page will redirect to
the route `confirmRouteName`.
In that route you'll be able to complete the order. Ex: 

```js
// ENV['paypal-express'].confirmRouteName
// defaults to spree.checkout

  beforeModel: function(transition) {                                            
    let qp = transition.queryParams;

    let paymentMethodId = qp.payment_method_id;
    let token = qp.token;
    let PayerID = qp.PayerID;

    if (!paymentMethodId || !token || !PayerID) {
      return true;
    }

    this.spree.paypalExpress.confirmOrder(paymentMethodId, token, PayerID)
    .then(() => {
      // the confirmation is done and the order has been advanced to complete

      // redirect is a method already provided by spree-ember
      this.redirect();
    });
  } 
```

To have more control during the confirmation phase you can use just the method
`this.spree.paypalExpress.confirm`. You can use the `confirmOrder` implementation
as a guide.

## Configuration

In `config/environment.js` you can override the following default values:

```js
ENV['paypal-express'] = {
  paymentMethodName: 'PayPal',
  cancelRouteName: 'spree.cart',
  confirmRouteName: 'spree.checkout'  
}
```

`paymentMethodName` is the name of the `better_spree_paypal_express` payment method
that you want to use for every order. You configured that name through the Spree admin.

`cancelRouteName` is the route where the user is directed to after clicking the "cancel" link in the PayPal pay screen.

`confirmRouteName` is the route where the user is directed to after completing the payment process with PayPal.

# Development

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

---

Thanks to @hhff and @williscool for all the help given in the
[spree-ember](https://gitter.im/hhff/spree-ember) gitter room.
