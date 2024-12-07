const Users = require('../db/model/users');
const Products = require('../db/model/products')
const UserType = require('../db/model/userType');
const { success_function, error_function } = require('../utils/responsehandler');
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const set_block_template = require("../utils/email-templates/block").block
const sendEmail = require("../utils/send-email").sendEmail;

// get count
exports.getCount = async function (req, res) {
  try {
    // Get the total count of users
    const userCount = await Users.countDocuments();
    console.log("userCount:", userCount);

    // Get the seller userType ID
    const sellerType = await UserType.findOne({ userType: 'Seller' });
    console.log("sellerType:", sellerType);

    // Get the count of sellers
    const sellerCount = await Users.countDocuments({ userType: sellerType._id });
    console.log("sellerCount:", sellerCount);

    // Get the product count
    const productCount = await Products.countDocuments();
    console.log("productCount:", productCount);

    // Fetch users
    const users = await Users.find();
    console.log("Fetched Users:", users);

    // Prepare order details
    let orderCount = 0;
    let totalPrice = 0;  // Variable to store total price of all orders
    const orders = []; // To store each order's total price, ID, and product name

    // Loop through users to process their orders
    for (let user of users) {
      if (user.orders && user.orders.length) {
        orderCount += user.orders.length;

        // Loop through orders for each user
        for (let order of user.orders) {
          if (order.totalPrice) {
            totalPrice += order.totalPrice;  // Add each order's total price to the totalPrice variable

            // Fetch the product name using productId from the Products collection
            const product = await Products.findById(order.productId);
            
            // Check if product exists and push order details
            if (product) {
              orders.push({
                orderId: order._id,
                totalPrice: order.totalPrice,
                productId: order.productId,  // Include product ID
                productName: product.name,   // Fetch product name from the Products collection
              });
            }
          }
        }
      }
    }

    console.log("orderCount:", orderCount);
    console.log("orders:", orders);
    console.log("totalPrice of all orders:", totalPrice); // Log the total price

    // Return the response with all the counts and the total price of all orders
    return res.status(200).json({
      success: true,
      message: "Counts fetched successfully",
      userCount,
      sellerCount,
      orderCount,
      productCount,
      totalPrice,  // Send total price of all orders
      orders       // Send detailed orders in the response
    });
  } catch (error) {
    return error_function(res, error);
  }
};


exports.getBuyer = async function (req, res) {
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await Users.findOne({ _id: id });
    console.log("user:", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let orderProductIds = [];
    let cartProductIds = [];
    let wishlistProductIds = [];

    if (Array.isArray(user.orders) && user.orders.length > 0) {
      orderProductIds = user.orders
        .filter(order => order && order.productId) 
        .map(order => order.productId);
    }

    if (Array.isArray(user.addtocart) && user.addtocart.length > 0) {
      cartProductIds = user.addtocart; 
    }

    if (Array.isArray(user.wishlist) && user.wishlist.length > 0) {
      wishlistProductIds = user.wishlist; 
    }

    console.log("Filtered wishlistProductIds:", wishlistProductIds);

    const orderProducts = await Products.find({ _id: { $in: orderProductIds } });
    console.log("orderProducts:", orderProducts);

    const cartProducts = await Products.find({ _id: { $in: cartProductIds } });
    console.log("cartProducts:", cartProducts);

    const wishlistProducts = await Products.find({ _id: { $in: wishlistProductIds } });
    console.log("wishlistProducts:", wishlistProducts);

    return res.status(200).json({
      success: true,
      message: "Order, cart, and wishlist details fetched successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          userStatus: user.userStatus, 
          orders: user.orders,
          cart: user.addtocart, 
          wishlist: user.wishlist, 
        },
        orderProducts,    
        cartProducts,     
        wishlistProducts, 
      },
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching user details",
    });
  }
};



exports.getSeller = async function (req, res) {
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

    // Collect product IDs from the user's orders, cart, and wishlist
    let orderProductIds = [];
    let cartProductIds = [];
    let wishlistProductIds = [];

    // Collect product IDs from the orders
    if (Array.isArray(user.orders) && user.orders.length > 0) {
      orderProductIds = user.orders
        .filter(order => order && order.productId) // Ensure valid structure
        .map(order => order.productId); // Collect productId from orders
    }

    // Collect product IDs from the cart
    if (Array.isArray(user.addtocart) && user.addtocart.length > 0) {
      cartProductIds = user.addtocart; // Use directly if it's an array of product IDs
    }

    // Collect product IDs from the wishlist
    if (Array.isArray(user.wishlist) && user.wishlist.length > 0) {
      wishlistProductIds = user.wishlist; // Use directly as it already contains product IDs
    }

    console.log("Filtered wishlistProductIds:", wishlistProductIds);

    // Fetch products for the collected product IDs
    const orderProducts = await Products.find({ _id: { $in: orderProductIds } });
    console.log("orderProducts:", orderProducts);

    const cartProducts = await Products.find({ _id: { $in: cartProductIds } });
    console.log("cartProducts:", cartProducts);

    const wishlistProducts = await Products.find({ _id: { $in: wishlistProductIds } });
    console.log("wishlistProducts:", wishlistProducts);

    // Fetch the seller's own listed products
    const sellerProducts = await Products.find({ sellerId: user._id });
    console.log("sellerProducts:", sellerProducts);

    // Respond with the seller's details, their products, and differentiated order/cart/wishlist products
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
          wishlist: user.wishlist, // Include wishlist in the response
        },
        sellerProducts,    // Products added by the seller
        orderProducts,     // Products that are in the orders
        cartProducts,      // Products that are in the cart
        wishlistProducts,  // Products that are in the wishlist
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
    const id = req.params.pid;

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

exports.BlockOrUnblock = async function (req, res) {
  try {
      let id = req.params.id;
      let description = req.params.description;
      console.log("description : ",description)

      // Check if ID exists in the users collection
      let user = await Users.findById(id);

      if (user) {
          // Update userStatus for the user
          user.userStatus = user.userStatus === 'Block' ? 'UnBlock' : 'Block';
          await user.save();

          // Send email notification for user block/unblock
          // const emailTemplate = await set_block_template(user.email, description);
          // await sendEmail(user.email, "block", emailTemplate);

          return res.status(200).json({
              message: `User ${user.userStatus} successfully.`,
              user,
          });
      } else {
          // Check if ID exists in the Product collection
          let product = await Products.findById(id);

          if (product) {
              // Update productStatus for the product
              product.productStatus = product.productStatus === 'Block' ? 'UnBlock' : 'Block';
              await product.save();

              // Find the seller's email address (using sellerId from the product)
              let seller = await Users.findById(product.sellerId);
              if (seller) {
                  // Send email notification for product block/unblock to the seller
                  // const emailTemplate2 = await set_block_template(seller.email, description);
                  // await sendEmail(seller.email, "block", emailTemplate2);
              }

              return res.status(200).json({
                  message: `Product ${product.productStatus} successfully.`,
                  product,
              });
          } else {
              // If ID not found in both collections
              return res.status(404).json({
                  message: 'ID not found in Users or Products collection.',
              });
          }
      }
  } catch (error) {
      console.error('Error in BlockOrUnblock function:', error);
      res.status(500).json({
          message: 'Internal server error',
          error: error.message,
      });
  }
};

exports.getproductsall = async (req, res) => {
  try {
      // Fetch all products from the Product collection
      const products = await Products.find();

      // Check if products are found
      if (products.length === 0) {
          return res.status(404).json({
              success: false,
              message: 'No products found'
          });
      }

      // Return the products in the response
      return res.status(200).json({
          success: true,
          responseProducts: products
      });
  } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({
          success: false,
          message: 'Server error while fetching products'
      });
  }
};



