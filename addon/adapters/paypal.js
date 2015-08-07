import SpreeAdapter from 'spree-ember-core/adapters/spree';

export default SpreeAdapter.extend({

  /*
    This is the namespace used by Spree::Api::PaypalController
    in better_spree_paypal_express.
  */
  namespace: 'api'

});
