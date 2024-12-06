const Users = require('../db/model/users');
const Products = require('../db/model/products')
const UserType = require('../db/model/userType');
const { success_function, error_function } = require('../utils/responsehandler');
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");

// get count
exports.getCount = async function (req, res) {
  try {
    // Get the total count of users
    const userCount = await Users.countDocuments();
    console.log("userCount : ", userCount);

    // Get the seller userType ID
    const sellerType = await UserType.findOne({ userType: 'Seller' });
    console.log("sellerType : ", sellerType);

    // Get the count of sellers
    const sellerCount = await Users.countDocuments({ userType: sellerType._id });
    console.log("sellerCount : ", sellerCount);

    const productCount = await Products.countDocuments()
    console.log("productCount : ", productCount)

    // Get all users
    const users = await Users.find();

    // Calculate the total number of orders from all users
    let orderCount = 0;
    users.forEach(user => {
      if (user.orders && user.orders.length) {
        orderCount += user.orders.length;
      }
    });
    console.log("orderCount: ", orderCount);

    return res.status(200).json({
      success: true,
      message: "Counts  fetched successfully",
      userCount,
      sellerCount,
      orderCount,
      productCount
    });
  } catch (error) {
    return error_function(res, error);
  }
};

exports.getBuyerDetails = async function (req, res) {
  try {
    // Find the Buyer type in the UserType collection
    const buyerType = await UserType.findOne({ userType: "Buyer" });
    if (!buyerType) {
      return res.status(404).json({
        success: false,
        message: "Buyer usertype not found",
      });
    }
    console.log("BuyerType ID:", buyerType._id);

    // Find users of type Buyer
    const buyers = await Users.find({ userType: buyerType._id });

    if (!buyers || buyers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No buyers found",
      });
    }

    console.log("Buyers:", buyers);

    // Return the buyer details
    return res.status(200).json({
      success: true,
      message: "Buyers fetched successfully",
      data: buyers,
    });
  } catch (error) {
    console.error("Error fetching buyers:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching buyers",
    });
  }
};

exports.getBuyerdetails = async function (req, res) {
  try {
    const id = req.params.id;
    console.log("id:", id);

    // Validate the `id` parameter
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Find the user by their ID
    const user = await Users.findOne({ _id: id });
    console.log("user:", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Collect product IDs from the user's orders and cart
    let orderProductIds = [];
    let cartProductIds = [];

    // Collect product IDs from the orders
    if (Array.isArray(user.orders) && user.orders.length > 0) {
      orderProductIds = user.orders
        .filter(order => order && order.productId) // Ensure valid structure
        .map(order => order.productId); // Collect productId from orders
    }

    // Collect product IDs from the cart
    if (Array.isArray(user.addtocart) && user.addtocart.length > 0) {
      console.log("addtocart contents:", user.addtocart); // Debugging
      cartProductIds = user.addtocart; // Use directly as it already contains product IDs
    } else {
      console.warn("addtocart is empty or not an array.");
    }
    console.log("Filtered cartProductIds:", cartProductIds);

    // Fetch products for the collected product IDs
    const orderProducts = await Products.find({ _id: { $in: orderProductIds } });
    console.log("orderProducts:", orderProducts);

    const cartProducts = await Products.find({ _id: { $in: cartProductIds } });
    console.log("cartProducts:", cartProducts);

    // Respond with the user details and differentiated order/cart products
    return res.status(200).json({
      success: true,
      message: "Order and cart details fetched successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          userStatus: user.userStatus, // Include userStatus
          orders: user.orders,
          cart: user.addtocart, // Include cart details
          wishlist: user.wishlist, // Include wishlist
        },
        orderProducts, // Products that are in the orders
        cartProducts,  // Products that are in the cart
      },
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching order details",
    });
  }
};


exports.getSellerDetails = async function (req, res) {
  try {
    // Find the seller type in the UserType collection
    const sellerType = await UserType.findOne({ userType: "Seller" });
    if (!sellerType) {
      return res.status(404).json({
        success: false,
        message: "seller usertype not found",
      });
    }
    console.log("sellerType ID:", sellerType._id);

    // Find users of type seller
    const sellers = await Users.find({ userType: sellerType._id });

    if (!sellers || sellers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No buyers found",
      });
    }

    console.log("Buyers:", sellers);

    // Return the buyer details
    return res.status(200).json({
      success: true,
      message: "sellers fetched successfully",
      data: sellers,
    });
  } catch (error) {
    console.error("Error fetching buyers:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching buyers",
    });
  }
};


exports.getSellerdetails = async function (req, res) {
  try {
    const id = req.params.id;
    console.log("id:", id);

    // Validate the `id` parameter
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Find the seller by their ID
    const user = await Users.findOne({ _id: id });
    console.log("user:", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Collect product IDs from the user's orders and cart
    let orderProductIds = [];
    let cartProductIds = [];

    // Collect product IDs from the orders
    if (Array.isArray(user.orders) && user.orders.length > 0) {
      orderProductIds = user.orders
        .filter(order => order && order.productId) // Ensure valid structure
        .map(order => order.productId); // Collect productId from orders
    }

    // Collect product IDs from the cart
    if (Array.isArray(user.addtocart) && user.addtocart.length > 0) {
      console.log("user.addtocart contents:", user.addtocart); // Debugging
      cartProductIds = user.addtocart; // Use directly if it's an array of product IDs
    } else {
      console.warn("addtocart is empty or not an array.");
    }
    console.log("Filtered cartProductIds:", cartProductIds);

    // Fetch products for the collected product IDs
    const orderProducts = await Products.find({ _id: { $in: orderProductIds } });
    console.log("orderProducts:", orderProducts);

    const cartProducts = await Products.find({ _id: { $in: cartProductIds } });
    console.log("cartProducts:", cartProducts);

    // Now find the seller's own listed products
    const sellerProducts = await Products.find({ sellerId: user._id });
    console.log("sellerProducts:", sellerProducts);

    // Respond with the seller's details, their products, and differentiated order/cart products
    return res.status(200).json({
      success: true,
      message: "Seller details fetched successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          orders: user.orders,
          cart: user.addtocart, // Include cart details in the response
        },
        sellerProducts, // Products added by the seller
        orderProducts, // Products that are in the orders
        cartProducts, // Products that are in the cart
      },
    });
  } catch (error) {
    console.error("Error fetching seller details:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching seller details",
    });
  }
};

exports.getProductOrderDetails = async function (req, res) {
  try {
    const id = req.params.id;

    // Validate the `id` parameter
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Find the product by its ID
    const product = await Products.findOne({ _id: id });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find the seller details using the sellerId from the product
    const seller = await Users.findOne({ _id: product.sellerId });
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    // Find users who have ordered the product
    const usersWithOrders = await Users.find({
      "orders.productId": id, // Check if product ID exists in orders array
    });

    // Map users to include only necessary details
    const userOrderDetails = usersWithOrders.map(user => {
      const relevantOrders = user.orders.filter(order => order.productId === id);
      return {
        userId: user._id,
        name: user.name,
        email: user.email,
        orders: relevantOrders.map(order => ({
          orderId: order._id,
          quantity: order.quantity,
          totalPrice: order.totalPrice,
        })),
      };
    });

    // Add seller details to product details
    const productWithSeller = {
      ...product.toObject(),
      sellerDetails: {
        sellerId: seller._id,
        sellerName: seller.name,
        sellerEmail: seller.email,
      },
    };

    // Respond with product, order, and seller details
    return res.status(200).json({
      success: true,
      message: "Product order details fetched successfully",
      data: {
        product: productWithSeller,
        userOrderDetails,
      },
    });
  } catch (error) {
    console.error("Error fetching product order details:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching product order details",
    });
  }
};


exports.getAllOrders = async function (req, res) {
  try {
    // Fetch all users
    const users = await Users.find();

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    // Aggregate all orders from users
    const allOrders = [];
    users.forEach(user => {
      if (Array.isArray(user.orders) && user.orders.length > 0) {
        user.orders.forEach(order => {
          allOrders.push({
            orderId: order._id,
            productId: order.productId,
            quantity: order.quantity,
            totalPrice: order.totalPrice,
            userId: user._id,
            userName: user.name,
            userEmail: user.email,
          });
        });
      }
    });

    // Extract unique product IDs
    const productIds = [...new Set(allOrders.map(order => order.productId))];

    // Fetch relevant product details
    const products = await Products.find({ _id: { $in: productIds } });

    // Create a product map for quick lookup
    const productMap = {};
    products.forEach(product => {
      productMap[product._id] = product;
    });

    // Combine orders with product details
    const enrichedOrders = allOrders.map(order => ({
      ...order,
      productDetails: productMap[order.productId] || null, // Attach product details if available
    }));

    // Respond with the aggregated order details
    return res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      data: enrichedOrders,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching all orders",
    });
  }
};







