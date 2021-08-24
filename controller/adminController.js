const {ObjectID} = require ('mongodb');
const Product = require ('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render ('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/add-product',
    editingMode: '',
    prod: '',
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product (null, title, imageUrl, price, description);
  product
    .save ()
    .then (result => {
      res.redirect ('/admin/admin-product');
    })
    .catch (err => {
      console.log (err);
    });
};

exports.getAdminProduct = (req, res, next) => {
  Product.fetchAll ()
    .then (products => {
      res.render ('admin/admin-products', {
        pageTitle: 'Admin Product',
        path: '/admin-product',
        prods: products,
      });
    })
    .catch (err => {
      console.log (err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById (prodId)
    .then (result => {
      res.redirect ('/admin/admin-product');
    })
    .catch (err => {
      console.log (err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const params = req.params.productId;
  const query = req.query.edit;
  Product.findById (params)
    .then (product => {
      res.render ('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        prod: product,
        editingMode: query,
      });
    })
    .catch (err => {
      console.log (err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const product = new Product (
    ObjectID (prodId),
    updatedTitle,
    updatedImageUrl,
    updatedPrice,
    updatedDescription
  );
  product
    .save ()
    .then (result => {
      res.redirect ('/admin/admin-product');
    })
    .catch (err => {
      console.log (err);
    });
};
