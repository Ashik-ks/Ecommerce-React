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
router.get('/buyers',setAccessControl("1"),adminController.getBuyerDetails);
router.get('/buyerdetails/:id',setAccessControl("1"),adminController.getBuyerdetails);
router.get('/sellers',setAccessControl("1"),adminController.getSellerDetails);
router.get('/sellerdetails/:id',setAccessControl("1"),adminController.getSellerdetails);
router.get('/productorders/:id',setAccessControl("1"),adminController.getProductOrderDetails);
router.get('/allorders',setAccessControl("1"),adminController.getAllOrders);


module.exports = router; // Make sure to export the router