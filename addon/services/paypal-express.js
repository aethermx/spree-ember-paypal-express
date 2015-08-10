import Ember from 'ember';

export default Ember.Service.extend({

  adapter: null,

  _loadAdapter: Ember.on('init', function() {
    this.adapter = this.container.lookup('adapter:paypal');
  }),

  /**
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

  _buildCancelUrl: function() {
    let origin = window.location.origin + this.get('spree.config.mount');
    return origin + '/' + this.get('config.cancelUrl');
  },

  _buildConfirmUrl: function() {
    let origin = window.location.origin + this.get('spree.config.mount');
    return origin + '/' + this.get('config.confirmUrl');
  },

  /*
    Ensures that the payment method configured in ENV['paypal-express'] is the
    one selected for the order checkout.
  */
  _setActivePayment: function() {

    let paymentMethodId = this.spree.paypalExpress.get('config.paymentMethodId');

    let currentOrder = this.spree.get('currentOrder');
    
    // By setting the state of each payment
    // a computed property in model:order will trigger and set
    // the value for spree.currentOrder.activePayment
    currentOrder.get('payments').forEach(payment => {
      let paymentMethod = payment.get('paymentMethod');
      if (paymentMethod.get('id') === '' + paymentMethodId) {
        // We are defining payment details, thats the state Spree would use
        payment.set('state', 'payment'); 
      } else {
        payment.set('state', 'invalid');
      }
    }); 

    Ember.assert('An active payment has been enabled.',
                 !isNaN(currentOrder.get('activePayment.paymentMethod.id')));
  },

  /*
    Spree::Api::PaypalController#express

    @method getRedirectUrl
    @return {Promise} promise
  */
  getRedirectUrl: function() {
    this._setActivePayment();

    let url = this.adapter.buildURL('paypal'); 

    let params = {
      data: {
        order_id: this.get('spree.orderId'),
        payment_method_id: this.get('config.paymentMethodId'),
        cancel_url: this._buildCancelUrl(),
        confirm_url: this._buildConfirmUrl() 
      }
    };

    return this.adapter.ajax(url, 'POST', params);
  },

  /*
    Spree::Api::PaypalController#confirm

    @method confirm 
    @param  {String}  token 
    @param  {String}  PayerID 
    @return {Promise} order 
  */
  confirm: function(token, PayerID) {
    let url = [this.adapter.buildURL('paypal'), 'confirm'].join('/'); 

    let params = {
      data: {
        order_id: this.get('spree.orderId'),
        payment_method_id: this.get('config.paymentMethodId'),
        token: token,
        PayerID: PayerID
      }
    };

    return this.adapter.ajax(url, 'POST', params);
  }

});
