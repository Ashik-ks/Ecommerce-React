// In authRouter.js
const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const accessControl = require('../utils/access-control').accessControl;

function setAccessControl(access_types) {
    return (req, res, next) => {
        accessControl(access_types, req, res, next);
    };
}

// router.get('/users',setAccessControl("1"),adminController.getUsers);
router.get('/count',setAccessControl("1"),adminController.getCount);
router.get('/productsall',adminController.getproductsall);
router.get('/buyers',setAccessControl("1"),adminController.getBuyer);
router.get('/buyerdetails/:id',setAccessControl("1"),adminController.getBuyerdetails);
router.get('/sellers',setAccessControl("1"),adminController.getSeller);
router.get('/sellerdetails/:id',setAccessControl("1"),adminController.getSellerdetails);
router.get('/productorders/:pid',setAccessControl("1"),adminController.getProductOrderDetails);
router.get('/allorders',setAccessControl("1"),adminController.getAllOrders);
router.put('/blockorunblock/:id/:description',setAccessControl("1"),adminController.BlockOrUnblock);



module.exports = router; // Make sure to export the router