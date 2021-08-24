const express = require ('express');

const router = express.Router ();

const adminRoute = require ('../controller/adminController');

router.get ('/add-product', adminRoute.getAddProduct);

router.post ('/add-product', adminRoute.postAddProduct);

router.get ('/admin-product', adminRoute.getAdminProduct);

router.get ('/edit-product/:productId', adminRoute.getEditProduct);

router.post ('/edit-product', adminRoute.postEditProduct);

router.post ('/delete', adminRoute.postDeleteProduct);

module.exports = router;
