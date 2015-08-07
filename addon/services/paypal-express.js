import Ember from 'ember';

export default Ember.Service.extend({

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
    @method getRedirectUrl
    @return {Promise} promise
  */
  getRedirectUrl: function() {
    let adapter = this.container.lookup('adapter:paypal');

    let url = adapter.buildURL('paypal'); 

    let params = {
      data: {
        order_id: this.get('spree.orderId'),
        payment_method_id: this.get('config.paymentMethodId'),
        cancel_url: this._buildCancelUrl(),
        confirm_url: this._buildConfirmUrl() 
      }
    };

    return adapter.ajax(url, 'POST', params);
  }

});
