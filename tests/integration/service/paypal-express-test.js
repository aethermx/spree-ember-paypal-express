import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';

let application, service;

module('Integration: Service Paypal Express', {
  beforeEach: function() {
    application = startApp();

    let container = application.__container__;
    service = container.lookup('service:paypal-express');
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('it exists', function(assert) {
  assert.ok(service);
});

test('spree service', function(assert) {
  assert.ok(service.spree);
  assert.ok(service.spree.get('localStorageKey'), 'spree-ember');
});

test('spree adapter', function(assert) {
  assert.ok(service.spreeAdapter);
  assert.ok(service.spreeAdapter.get('namespace'), 'api/ams');
});

test('config values', function(assert) {
  assert.equal(service.get('config.paymentMethodName'), 'PayPal');
  assert.equal(service.get('config.confirmRouteName'), 'home.thankyou');
  assert.equal(service.get('config.cancelRouteName'), 'spree.cart');
});

test('_buildUrl', function(assert) {
  assert.expect(0);
  // TODO
  /*
  let expected = 'http://localhost:4200/spree/checkout?payment_method_id=999'; 
  assert.ok(service._buildUrl('spree.checkout', 999), expected);

  expected = 'http://localhost:4200/spree/cart?payment_method_id=999'; 
  assert.ok(service._buildUrl('spree.cart', 999), expected);
  */
});

test('getRedirectUrl', function(assert) {
  assert.expect(0);
  // TODO: add pretender or ember-mirage and test this
});

test('confirm', function(assert) {
  assert.expect(0);
  // TODO: add pretender or ember-mirage and test this
});

test('confirmOrder', function(assert) {
  assert.expect(0);
  // TODO: add pretender or ember-mirage and test this
});
