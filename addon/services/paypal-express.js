import Ember from 'ember';

export default Ember.Service.extend({

  spreeAdapter: null,

  _loadSpreeAdapter: Ember.on('init', function() {
    this.spreeAdapter = this.container.lookup('adapter:spree');
  }),

  /*
    A copy of the "paypal-express" entry in the Host Application environment config.
    @property config
    @type Object
    @default {}
  */
  config: {},

  /*
    Holds a reference to the spree service defined by spree-ember-core.
    This value will be updated in the initializer provided by this addon.
  */
  spree: Ember.K,

  /*
    @return {String} url 
  */
  _buildUrl: function(routeName, paymentMethodId) {
    // http://stackoverflow.com/a/21519355/7852
    //let router = this.container.lookup('router:main').router;
    let router = this.container.lookup('router:main').router;

    let origin = window.location.origin;

    let url = origin +
              router.generate(routeName) +
              '?payment_method_id=' + paymentMethodId;
    return url;
  },

  /*
    @return {PaymentMethod} paypal payment method 
  */
  _findPaypalPaymentMethod: function() {
    let availablePaymentMethods = this.spree.get(
      'currentOrder.availablePaymentMethods');
    Ember.assert('availablePaymentMethods has at least 1 element',
                 availablePaymentMethods.length);

    let methodName = this.spree.paypalExpress.get('config.paymentMethodName');
    let paypalMethods = availablePaymentMethods.filter(paymentMethod => {
      return paymentMethod.get('name').indexOf(methodName) > -1; 
    });
    Ember.assert('paypalMethods has at least 1 element',
                 paypalMethods.length);

    return paypalMethods.get('firstObject');
  },

  /*
    Spree::Api::Ams::PaypalController#express

    @method getRedirectUrl
    @return {Promise} promise
  */
  getRedirectUrl: function() {
    let paymentMethod = this._findPaypalPaymentMethod();
    let paymentMethodId = paymentMethod.get('id');

    let routeName = this.get('config.cancelRouteName');
    let cancelUrl = this._buildUrl(routeName, paymentMethodId);

    routeName = this.get('config.confirmRouteName');
    let confirmUrl = this._buildUrl(routeName, paymentMethodId);

    let params = {
      data: {
        payment_method_id: paymentMethodId,
        cancel_url: cancelUrl,
        confirm_url: confirmUrl 
      }
    };

    let url = this.spreeAdapter.buildURL('paypal'); 

    return this.spreeAdapter.ajax(url, 'POST', params);
  },

  /*
    Spree::Api::Ams::PaypalController#confirm

    After the payment is completed, this function is used to confirm an order
    with the Spree backend.

    @method confirm 
    @param  {Number}  paymentMethodId 
    @param  {String}  token 
    @param  {String}  PayerID 
    @return {Promise} 
  */
  confirm: function(paymentMethodId, token, PayerID) {
    let url = [this.spreeAdapter.buildURL('paypal'), 'confirm'].join('/'); 

    Ember.assert('paymentMethodId has a valid value', !isNaN(paymentMethodId));
    Ember.assert('token has a valid value', typeof token === 'string');
    Ember.assert('PayerID has a valid value', typeof PayerID === 'string');

    let params = {
      data: {
        payment_method_id: paymentMethodId,
        token: token,
        PayerID: PayerID
      }
    };

    return this.spreeAdapter.ajax(url, 'POST', params);
  },

  /*
    Confirms an order with the backend and advances the state of the order in
    the frontend.

    Confirms a PayPal payment and transitions the checkout state machine to the
    state 'complete'.
 
    @method confirm 
    @param  {Number}  paymentMethodId 
    @param  {String}  token 
    @param  {String}  PayerID 
    @return {Promise} checkout transition that resolves to the 'complete' state 
  */
  confirmOrder: function(paymentMethodId, token, PayerID) {
    let confirmPromise = this.confirm(paymentMethodId, token, PayerID);

    let reloadOrderPromise = confirmPromise.then((/*jsonOrder*/) => {                                     
      let currentOrder = this.spree.get('currentOrder');                         
      // now we reload the order so that we have the latest payment state                       
      return currentOrder.reload();
    });

    let transitionPromise = reloadOrderPromise.then((/*jsonOrder*/) => {
      let reloadedOrder = this.spree.get('currentOrder');

      // workaround for spree ember's finite state machine here
      // https://github.com/hhff/spree-ember/blob/master/packages/checkouts/app/services/checkouts.js#L223
      // has a callback that adds an empty payment record that if you try to save breaks saving the paypal payment.
      //
      // dont know what it is for but I imagine just to make serializing the order work regardless 
      // of whether or not you have entered your credit card info or not yet with the other payment types
      //
      // a cleaner way of doing things would involve adding the changes discussed in
      // https://gitter.im/hhff/spree-ember/archives/2015/08/10
      reloadedOrder.get('payments')
      .filterBy('id', null).invoke('deleteRecord');

      return this.spree.get('checkouts').transition('complete');
    }); // reloadPromise

    return transitionPromise;
  }

});
