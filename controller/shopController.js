const Product = require ('../models/product');

exports.getIndex = (req, res, next) => {
  Product.fetchAll ()
    .then (products => {
      res.render ('shop/index', {
        pageTitle: 'Shop',
        path: '/',
        prods: products,
      });
    })
    .catch (err => console.log (err));
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll ()
    .then (products => {
      res.render ('shop/products', {
        pageTitle: 'Products',
        path: '/products',
        prods: products,
      });
    })
    .catch (err => {
      console.log (err);
    });
};

exports.getProductDetails = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById (prodId)
    .then (product => {
      res.render ('shop/product-detail', {
        pageTitle: product.title,
        path: '/products',
        product: product,
      });
    })
    .catch (err => console.log (err));
};

exports.getCarts = (req, res, next) => {
  req.user
    .getCarts ()
    .then (carts => {
      res.render ('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        prods: carts,
      });
    })
    .catch (err => {
      console.log (err);
    });
};

exports.postCartItem = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById (prodId)
    .then (product => {
      return req.user.addToCart (product);
    })
    .then (result => {
      console.log (result);
      res.redirect ('/cart');
    })
    .catch (err => {
      console.log (err);
    });
};

exports.deleteCartItem = (req, res, next) => {
  const prodId = req.body.cartId;
  console.log (prodId);
  req.user
    .deleteItemFromCart (prodId)
    .then (result => {
      res.redirect ('/cart');
    })
    .catch (err => {
      console.log (err);
    });
};

// exports.getOrderItem = (req, res, next) => {
// 	res.render("shop/order", {
// 		pageTitle: 'Order',
// 		path: '/order',
// 	});
// }

exports.postOrderItem = (req, res, next) => {
  req.user
    .addOrder ()
    .then (result => {
      res.redirect ('/orders');
    })
    .catch (err => {
      console.log (err);
    });
};
