import ENV from '../config/environment';

export function initialize(registry, application) {
  // Do not pluralize requests for Spree::Api::PaypalController
  let inflector = Ember.Inflector.inflector;                                     
  inflector.uncountable('paypal');

  //TODO: remove this line and convert this file into an instance initializer
  let container = application.__container__;

  let PaypalExpressService = container.lookup('service:paypal-express');
  PaypalExpressService.set('config', ENV['paypal-express'] || {});

  // Add a reference of each service to each service 
  let SpreeService = container.lookup('service:spree');
  PaypalExpressService.set('spree', SpreeService);
  SpreeService.set('paypalExpress', PaypalExpressService);
}

export default {
  name: 'spree-ember-paypal-express',
  after: 'spree-ember-core',
  initialize: initialize
};
