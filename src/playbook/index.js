const config = require('../config');

exports.getPlaybook = user => {
  return [
    {
      type: 'sessionStart',
      view: 'Home'
    },
    {
      type: 'httpRequest',
      timeOffset: [90, 130],
      url: `${config.services.shop}/api/catalogue/products`
    },


    {
      type: 'viewChange',
      timeOffset: [1000, 3000],
      view: 'Offers'
    },
    {
      type: 'httpRequest',
      timeOffset: [2, 15],
      url: `${config.services.shop}/api/offers`,
      // No API exists that we could call
      fake: {
        duration: [200, 300],
        statusCode: 200
      }
    },


    {
      type: 'viewChange',
      timeOffset: [3000, 4000],
      view: 'Products',
      abortChance: 0.1
    },
    {
      type: 'httpRequest',
      timeOffset: 15,
      url: `${config.services.shop}/api/catalogue/products`
    },
    {
      type: 'customEvent',
      timeOffset: [1000, 1500],
      eventName: 'error',
      chance: 0.1,
      meta: {
        message: 'Received invalid rating: Number of stars must be a value between 1 and 5 (inclusive).'
      }
    },


    {
      type: 'viewChange',
      timeOffset: [3000, 4000],
      view: 'Product Details',
      abortChance: 0.1
    },
    {
      type: 'httpRequest',
      timeOffset: [1, 15],
      url: `${config.services.shop}/api/catalogue/products/PB-1`
    },
    {
      type: 'customEvent',
      timeOffset: [1500, 3000],
      eventName: 'tracking.showImageCarousel',
      chance: 0.9,
      meta: {
        numberOfImages: 5,
        premiumImagePackage: true
      }
    },
    {
      type: 'httpRequest',
      timeOffset: [1200, 3000],
      abortChance: 0.25,
      method: 'PUT',
      url: `${config.services.shop}/api/cart`,
      // No API exists that we could call
      fake: {
        duration: [500, 1500],
        statusCode: 204
      }
    },


    {
      type: 'viewChange',
      timeOffset: [10, 300],
      view: 'Cart'
    },
    {
      type: 'httpRequest',
      timeOffset: [5, 100],
      url: `${config.services.shop}/api/cart`,
      fake: {
        duration: [500, 1500],
        statusCode: 200
      }
    },


    {
      type: 'viewChange',
      timeOffset: [2000, 4000],
      view: 'Check Out',
      abortChance: 0.5
    },
    {
      type: 'httpRequest',
      timeOffset: [5, 100],
      url: `${config.services.shop}/api/cart`,
      fake: {
        duration: [500, 1500],
        statusCode: 200
      }
    },


    {
      type: 'viewChange',
      timeOffset: [4000, 10000],
      view: 'Delivery',
      abortChance: 0.75
    },
    {
      type: 'httpRequest',
      timeOffset: 5,
      url: `${config.services.shop}/api/delivery/options`,
      fake: {
        duration: [500, 1000],
        statusCode: 200
      }
    },


    {
      type: 'viewChange',
      timeOffset: [4000, 10000],
      view: 'Payment',
      abortChance: user.abortChances.payment || 0.9
    },
    {
      type: 'httpRequest',
      timeOffset: 5,
      method: 'PUT',
      url: `https://www.paypal.com/pay`,
      fake: {
        duration: [1800, 2500],
        statusCode: 200
      }
    },

    {
      type: 'viewChange',
      timeOffset: [100, 500],
      view: 'Confirmation'
    }
  ];
};
