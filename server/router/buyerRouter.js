// In authRouter.js
const express = require('express');
const router = express.Router();
const buyerController = require('../controller/buyerController');
const accessControl = require('../utils/access-control').accessControl;

function setAccessControl(access_types) {
    return (req, res, next) => {
        accessControl(access_types, req, res, next);
    };
}

router.get('/user/:id', buyerController.getSingleuser);
router.get('/category', buyerController.getCategory);
router.get('/productsections/:id',buyerController.ProductSections);
router.post('/addaddress/:id', buyerController.addAddress);
router.get('/addtocartcount/:id', buyerController.getAddToCartCount);
router.put('/updateaddress/:id/:index', buyerController.updateaddress);
router.delete('/deleteaddress/:id/:index', buyerController.deleteaddress);
router.delete('/deleteuser/:id', buyerController.deleteuser);
router.get('/fetchitem/:id/:userid', buyerController.getitem);
router.get('/fetchcategory/:id/:userid', buyerController.getcategory);
router.get('/getallproducts/:id', buyerController.getallproduct);
router.get('/searchproducts/:id/:userid', buyerController.getSearch);
router.get('/getSingleproduct/:id/:pid',buyerController.getSingleproduct);
router.put('/addtoCart/:id/:productid',setAccessControl("2,3"),buyerController.addToCart);
router.put('/updateaddtoCart/:id/:productid',setAccessControl("2,3"),buyerController.updateAddToCart);
router.get('/getalladdtoCart/:id',setAccessControl("2,3"),buyerController.getAllAddToCart);
router.put('/addtoWishlist/:id/:productid',setAccessControl("2,3"),buyerController.addToWishlist);
router.get('/getallWishlist/:id',setAccessControl("2,3"),buyerController.getAllWishlist);
router.post('/order/:id',setAccessControl("2,3"),buyerController.placeOrder);
router.post('/cancelorder/:id',setAccessControl("2,3"),buyerController.CancelOrder);
router.get('/gatAllorders/:id',setAccessControl("2,3"),buyerController.getOrderedProducts);
router.get('/getallproducttoorder/:id/:items',setAccessControl("1,2,3"),buyerController.getallproducttoorder);



module.exports = router; // Make sure to export the router