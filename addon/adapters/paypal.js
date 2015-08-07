// 1.13.0
//import SpreeAdapter from 'spree-ember-core/addon/adapters/spree';
// 1.12.0
import SpreeAdapter from 'spree-ember-core/adapters/spree';

export default SpreeAdapter.extend({

  /*
    This is the namespace used by Spree::Api::PaypalController
    in better_spree_paypal_express.
  */
  namespace: 'api'

});
