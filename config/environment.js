'use strict';

module.exports = function(/* environment, appConfig */) {
  return { 
    'paypal-express': {
      paymentMethodId: 1,
      cancelUrl: 'cart',
      confirmUrl: 'checkout'  
    }
  };
};
