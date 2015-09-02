'use strict';

module.exports = function(/* environment, appConfig */) {
  return { 
    'paypal-express': {
      paymentMethodName: 'PayPal',
      cancelRouteName: 'spree.cart',
      confirmRouteName: 'spree.checkout'  
    }
  };
};
