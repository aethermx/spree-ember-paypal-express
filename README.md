# Spree-ember-paypal-express
[![Build Status](https://travis-ci.org/givanse/spree-ember-paypal-express.svg?branch=master)](https://travis-ci.org/givanse/spree-ember-paypal-express)
[![Code Climate](https://codeclimate.com/github/givanse/spree-ember-paypal-express/badges/gpa.svg)](https://codeclimate.com/github/givanse/spree-ember-paypal-express)

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

Gemfile

    gem 'spree_paypal_express', github: 'givanse/better_spree_paypal_express', branch: 'ams_0.8.2'

### Frontend

package.js

    "spree-ember-storefront": "0.0.1-beta.1"

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
the route `confirmUrl`.

```bash
// ENV['paypal-express'].confirmUrl
// defaults to spree.checkout

  beforeModel: function(transition) {                                            
    let qp = transition.queryParams;                                             
                                                                                 
    if (qp.token  && qp.PayerID) {                                               
      this.spree.paypalExpress.confirm(qp.token, qp.PayerID)                     
      .then(currentOrder => {                                                    
        /* (?)
        this.spree.get('checkouts').transition('complete').finally(() => {          
          this.redirect();                                                       
        });                                                                      
        */
      });                                                                        
    }                                                                            
  } 
```

## Configuration

In `config/environment.js` you can override the following default values:

```
ENV['paypal-express'] = {
  paymentMethodId: 1,
  cancelUrl: 'cart',
  confirmUrl: 'checkout'  
}
```

`paymentMethodId` is the `id` of the `better_spree_paypal_express` payment method
that you want to use for every order. You must have configured this through the Spree admin.

`cancelUrl` is the spree-ember route where the user is directed after clicking the "cancel" link in the PayPal pay screen.

`confirmUrl` is the spree-ember route where the user is directed after completing the payment process with PayPal.

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
