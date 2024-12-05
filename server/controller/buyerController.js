const Users = require('../db/model/users');
const Product = require('../db/model/products')
const category = require("../db/model/category");
const { success_function, error_function } = require('../utils/responsehandler');
const bcrypt = require('bcrypt');
const UserType = require("../db/model/userType")
const mongoose = require('mongoose');
const set_stock_template = require("../utils/email-templates/outof-stock").outOfStock;
const set_orderplace_template = require("../utils/email-templates/orderplaced").orderPlace;
const set_order_cancel_template = require("../utils/email-templates/cancel-order").cancelOrder

const sendEmail = require("../utils/send-email").sendEmail;


// getcategory 
exports.getCategory = async function (req, res) {
    try {
        let categories = await category.find();
        console.log("Categories: ", categories);

        return res.status(200).send(success_function({
            success: true,
            statuscode: 200,
            message: "Categories retrieved successfully",
            data: categories
        }));
    } catch (error) {
        console.error("Error fetching categories:", error);

        return res.status(400).send(error_function({
            success: false,
            statuscode: 400,
            message: "Internal server error"
        }));
    }
};

//to display single user
exports.getSingleuser = async function (req, res) {
    try {
        let _id = req.params.id;

        if (_id) {
            let user = await Users.findOne({ _id });

            if (user) {
                return res.status(200).send(success_function({
                    success: true,
                    statuscode: 200,
                    data: user,
                    message: "User retrieved successfully.",
                }));
            } else {
                return res.status(404).send(error_function({
                    success: false,
                    statuscode: 404,
                    message: "User not found.",
                }));
            }
        } else {
            return res.status(400).send(error_function({
                success: false,
                statuscode: 400,
                message: "User ID is required.",  // Updated message
            }));
        }

    } catch (error) {
        console.error("Error fetching user:", error);  // Log the error for debugging
        return res.status(500).send(error_function({
            success: false,
            statuscode: 500,
            message: "please login to Continue",
        }));
    }
};


//to add address for user
exports.addAddress = async function (req, res) {
    try {
        const id = req.params.id;
        const { street, city, state, country, pincode, landmark, phonenumber } = req.body;

        if (!id || !street || !city || !state || !country || !pincode || !landmark || !phonenumber) {
            return res.status(400).send({
                success: false,
                statuscode: 400,
                message: "All address fields are required.",
            });
        }

        // Add address to the user's address array
        const updateUser = await Users.updateOne(
            { _id: id },
            {
                $push: {
                    address: { street, city, state, country, pincode, landmark, phonenumber },
                },
            }
        );

        if (updateUser.modifiedCount > 0) {
            return res.status(200).send({
                success: true,
                statuscode: 200,
                message: "Address added successfully.",
            });
        } else {
            return res.status(404).send({
                success: false,
                statuscode: 404,
                message: "User not found.",
            });
        }
    } catch (error) {
        console.error("Error adding address:", error);
        return res.status(500).send({
            success: false,
            statuscode: 500,
            message: "Internal server error.",
        });
    }
};

//  to handle address update
exports.updateaddress = async function (req, res) {
    try {
        const { id, index } = req.params; // Get user ID and address index
        const updatedAddress = req.body;  // Get updated address data from the request body
        console.log("id : ", id);
        console.log(" index : ", index)

        // Find the user by ID
        let user = await Users.findOne({ _id: id });
        if (user) {
            // Update the address at the specified index
            user.address[index] = updatedAddress;

            // Save the updated user data to the database
            await user.save();

            res.json({ success: true, message: 'Address updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ success: false, message: 'Error updating address' });
    }
};

// to delete address
exports.deleteaddress = async function (req, res) {
    try {
        const { id, index } = req.params; // Get user ID and address index


        // Find the user by ID
        let user = await Users.findOne({ _id: id });
        console.log(user, "user")

        if (user) {
            // Ensure the index is valid and within bounds
            if (index >= 0 && index < user.address.length) {
                // Remove the address from the array
                user.address.splice(index, 1);

                // Save the updated user object
                await user.save();

                // Send success response
                res.status(200).json({
                    success: true,
                    message: "Address deleted successfully",
                });
            } else {
                // If the index is out of bounds
                res.status(400).json({
                    success: false,
                    message: "Invalid index provided",
                });
            }
        } else {
            // If the user is not found
            res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
    } catch (error) {
        console.error("Error deleting address:", error);
        // Send error response
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the address",
        });
    }
};

// to delete user 
exports.deleteuser = async function (req, res) {
    try {
        // Get the user ID from the request parameters
        const id = req.params.id;

        // Attempt to delete the user by their ID
        const result = await Users.deleteOne({ _id: id });

        // Check if a user was actually deleted
        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Send success response if the user is deleted
        res.status(200).json({
            success: true,
            message: "User deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        // Send an error response if something goes wrong
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the user.",
        });
    }
};

// fetch item 
exports.getitem = async function (req, res) {
    try {
        const id = req.params.id;
        const userid = req.params.userid;

        console.log("Item ID:", id);
        console.log("User ID:", userid);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
                success: false,
                statuscode: 400,
                message: "Invalid item ID.",
            });
        }

        const objectId = new mongoose.Types.ObjectId(id);

        const categoryData = await category.findOne({
            "subcategories.items._id": objectId,
        }).populate({
            path: "subcategories.items",
            match: { _id: objectId },
            select: "name _id",
        });

        if (!categoryData) {
            return res.status(404).send({
                success: false,
                statuscode: 404,
                message: "No category found for the given item.",
            });
        }

        let foundItem = null;
        let itemName = null;

        for (const subcategory of categoryData.subcategories) {
            for (const item of subcategory.items) {
                if (item._id.toString() === objectId.toString()) {
                    foundItem = item;
                    itemName = item.name;
                    break;
                }
            }
            if (foundItem) break;
        }

        if (!foundItem) {
            return res.status(404).send({
                success: false,
                statuscode: 404,
                message: "Item not found.",
            });
        }

        let productFilter = { item: { $regex: itemName, $options: "i" } };

        if (!userid || userid === 'null' || userid === 'undefined') {
            console.log("No user ID provided; returning all products.");
            const productData = await Product.find(productFilter);

            const responseProducts = productData.map(product => ({
                ...product.toObject(),
                isInWishlist: false,
            }));

            return res.status(200).send({
                success: true,
                statuscode: 200,
                data: {
                    item: foundItem,
                    products1: responseProducts,
                },
                message: "Item and products fetched successfully.",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userid)) {
            return res.status(400).send({
                success: false,
                statuscode: 400,
                message: "Invalid user ID.",
            });
        }

        const user = await Users.findById(userid);
        if (!user) {
            return res.status(404).send({
                success: false,
                statuscode: 404,
                message: "User not found.",
            });
        }

        const userType = await UserType.findById(user.userType);
        if (userType && userType.userType === "Seller") {
            productFilter.sellerId = { $ne: userid };
        }

        const wishlist = user ? user.wishlist || [] : [];
        const wishlistIds = wishlist.map(productId => productId.toString());

        const productData = await Product.find(productFilter);
        const responseProducts = productData.map(product => ({
            ...product.toObject(),
            isInWishlist: wishlistIds.includes(product._id.toString()),
        }));

        return res.status(200).send({
            success: true,
            statuscode: 200,
            data: {
                item: foundItem,
                products1: responseProducts,
            },
            message: "Item and products fetched successfully.",
        });

    } catch (error) {
        console.error("Error fetching item:", error);
        return res.status(500).send({
            success: false,
            statuscode: 500,
            message: "Internal server error.",
        });
    }
};

//fetch products based on category
exports.getcategory = async function (req, res) {
    try {
        const itemId = req.params.id;
        const userid = req.params.userid;

        console.log("Item ID:", itemId);
        console.log("User ID:", userid);

        if (!itemId) {
            return res.status(400).send({
                success: false,
                statuscode: 400,
                message: "Item ID is required."
            });
        }

        const objectId = new mongoose.Types.ObjectId(itemId);

        const categoryData = await category.findOne({
            "subcategories.items._id": objectId
        }).select("name subcategories.name subcategories._id subcategories.items._id subcategories.items.name");

        if (!categoryData) {
            return res.status(404).send({
                success: false,
                statuscode: 404,
                message: "No category found for the given item."
            });
        }

        const itemNames = categoryData.subcategories.reduce((acc, subcategory) => {
            subcategory.items.forEach(item => acc.push(item.name));
            return acc;
        }, []);

        let productFilter = {
            item: { $in: itemNames }
        };

        if (!userid || userid === 'null' || userid === 'undefined') {
            console.log("No user ID provided; returning all products.");
            const products = await Product.find(productFilter);

            const responseProducts = products.map(product => ({
                ...product.toObject(),
                isInWishlist: false,
            }));

            const responseSubcategories = categoryData.subcategories.map(subcategory => ({
                subcategoryId: subcategory._id,
                subcategoryName: subcategory.name,
                items: subcategory.items.map(item => ({
                    itemId: item._id,
                    itemName: item.name
                }))
            }));

            return res.status(200).send({
                success: true,
                statuscode: 200,
                data: {
                    products: responseProducts,
                    itemId: categoryData.name,
                    subcategories: responseSubcategories,
                },
                message: "Subcategories, items, and products fetched successfully.",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userid)) {
            return res.status(400).send({
                success: false,
                statuscode: 400,
                message: "Invalid user ID."
            });
        }

        const user = await Users.findById(userid);
        if (!user) {
            return res.status(404).send({
                success: false,
                statuscode: 404,
                message: "User not found."
            });
        }

        const userType = await UserType.findById(user.userType);
        if (userType && userType.userType === "Seller") {
            productFilter.sellerId = { $ne: userid };
        }

        const wishlist = user ? user.wishlist || [] : [];
        const wishlistIds = wishlist.map(productId => productId.toString());

        const products = await Product.find(productFilter);
        const responseProducts = products.map(product => ({
            ...product.toObject(),
            isInWishlist: wishlistIds.includes(product._id.toString()),
        }));

        const responseSubcategories = categoryData.subcategories.map(subcategory => ({
            subcategoryId: subcategory._id,
            subcategoryName: subcategory.name,
            items: subcategory.items.map(item => ({
                itemId: item._id,
                itemName: item.name
            }))
        }));

        return res.status(200).send({
            success: true,
            statuscode: 200,
            data: {
                products: responseProducts,
                itemId: categoryData.name,
                subcategories: responseSubcategories,
            },
            message: "Subcategories, items, and products fetched successfully.",
        });

    } catch (error) {
        console.error("Error fetching subcategories and items: ", error);
        return res.status(500).send({
            success: false,
            statuscode: 500,
            message: "Internal server error."
        });
    }
};

//fetch all products
exports.getallproduct = async function (req, res) {
    try {
        const id = req.params.id;
        console.log("id : ", id)
        let products;
        let user;

        // If id is 'null' or null, fetch all products
        if (id === 'null' || id === null || id === 'undefined' || id === undefined) {
            // Fetch all products without user filtering
            products = await Product.find();
        } else {
            // Fetch user by ID
            user = await Users.findOne({ _id: id });

            if (!user) {
                return res.status(404).send({
                    success: false,
                    statuscode: 404,
                    message: "User not found",
                });
            }

            // Fetch user type to filter products based on user role
            const userType = await UserType.findOne({ _id: user.userType });

            if (!userType) {
                return res.status(404).send({
                    success: false,
                    statuscode: 404,
                    message: "User type not found",
                });
            }

            // Fetch all products based on userType
            if (userType.userType === 'Seller') {
                // If the user is a Seller, exclude their own products
                products = await Product.find({ sellerId: { $ne: id } });
            } else {
                // If the user is a Buyer, fetch all products
                products = await Product.find();
            }
        }

        // If products are found
        if (products && products.length > 0) {
            // Fetch the user's wishlist (if it exists)
            let wishlist = user ? user.wishlist || [] : [];

            // Ensure all wishlist items are in string format (important for comparison)
            wishlist = wishlist.map(productId => productId.toString());  // Convert each wishlist productId to string

            console.log("wishlist: ", wishlist); // Log wishlist to verify

            // Map through the products and add `isInWishlist` flag for each product
            const responseProducts = products.map(product => {
                // Convert product._id to string for comparison
                const productId = product._id ? product._id.toString() : null;

                console.log("productId: ", productId); // Log productId to verify

                // Check if the product ID exists in the user's wishlist
                const isInWishlist = wishlist.includes(productId);  // Check if the product is in the wishlist
                console.log(" isInWishlist: ", isInWishlist)

                // Return product data with the `isInWishlist` flag
                return {
                    _id: product._id,
                    category: product.category,
                    createdAt: product.createdAt,
                    currency: product.currency,
                    description: product.description,
                    discountPrice: product.discountPrice,
                    images: product.images,
                    item: product.item,
                    name: product.name,
                    price: product.price,
                    sellerId: product.sellerId,
                    stockQuantity: product.stockQuantity,
                    stockStatus: product.stockStatus,
                    subcategory: product.subcategory,
                    updatedAt: product.updatedAt,
                    weight: product.weight,
                    isInWishlist: isInWishlist,  // Add the flag to indicate if product is in the wishlist
                };
            });

            // Calculate the number of items in the cart for the user (if available)
            let cartCount = 0;
            if (user && user.addtocart) {
                cartCount = user.addtocart.length;
            }

            // Send response with all product data and wishlist status
            return res.status(200).send({
                success: true,
                statuscode: 200,
                responseProducts,  // Products with wishlist flag
                allproducts: products, // Include full products if needed
                count: cartCount,  // Count of products in the user's cart
                message: "Products fetched successfully",
            });
        } else {
            return res.status(404).send({
                success: false,
                statuscode: 404,
                allproducts: [],
                message: "No products found",
            });
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).send({
            success: false,
            statuscode: 500,
            message: "Error fetching products",
            error: error.message,
        });
    }
};

//get products based on search
exports.getSearch = async function (req, res) {
    try {
        const id = req.params.id;  // Product ID from params
        const userid = req.params.userid;  // User ID from params
        console.log("searchId : ", id);
        console.log("userId : ", userid);

        // Get the product by id and populate the category, use .lean() to get plain JS objects
        let searchproduct = await Product.findOne({ _id: id }).populate('category').lean();
        console.log("searchproduct : ", searchproduct);

        if (searchproduct) {
            let searchitem = searchproduct.item;
            let searchcategory = searchproduct.category;

            let searchproductitem = [];
            let searchproductcategory = [];

            if (searchitem && searchcategory) {
                // Find products by the same item and category, use .lean() to get plain JS objects
                searchproductitem = await Product.find({ item: searchitem }).lean();
                searchproductcategory = await Product.find({ category: searchcategory }).lean();
                console.log("searchproductitem : ", searchproductitem);
                console.log("searchproductcategory : ", searchproductcategory);
            }

            // Default to false for isInWishlist
            let isInWishlist = false;

            if (userid && userid !== 'null' && userid !== 'undefined') {
                const user = await Users.findById(userid);

                if (user) {
                    if (Array.isArray(user.wishlist)) {
                        isInWishlist = user.wishlist.includes(id);
                    }

                    console.log("User's wishlist includes the product:", isInWishlist);

                    // Add the isInWishlist flag to the main product
                    searchproduct.isInWishlist = isInWishlist;

                    // Add the isInWishlist flag to each product in searchproductitem
                    searchproductitem = searchproductitem.map((product) => {
                        const inWishlist = user.wishlist.includes(product._id.toString());
                        console.log(`Product ${product.name} in wishlist:`, inWishlist);
                        product.isInWishlist = inWishlist;
                        return product;
                    });

                    // Add the isInWishlist flag to each product in searchproductcategory
                    searchproductcategory = searchproductcategory.map((product) => {
                        const inWishlist = user.wishlist.includes(product._id.toString());
                        console.log(`Product ${product.name} in wishlist:`, inWishlist);
                        product.isInWishlist = inWishlist;
                        return product;
                    });
                }
            } else {
                // If no userId, the main product and items won't have isInWishlist flag
                searchproduct.isInWishlist = false;
                searchproductitem = searchproductitem.map(product => ({
                    ...product,
                    isInWishlist: false
                }));
                searchproductcategory = searchproductcategory.map(product => ({
                    ...product,
                    isInWishlist: false
                }));
            }

            // Log to verify if the isInWishlist flag is set
            console.log("Final searchproduct:", searchproduct);
            console.log("Final searchproductitem:", searchproductitem);
            console.log("Final searchproductcategory:", searchproductcategory);

            // Construct the response with the modified product data
            return res.status(200).send({
                success: true,
                statuscode: 200,
                product: {
                    searchproduct,          // Including isInWishlist here
                    searchproductitem,
                    searchproductcategory,
                },
                message: "Products fetched successfully",
            });
        } else {
            return res.status(400).send({
                success: false,
                statuscode: 400,
                message: "Product not found",
            });
        }
    } catch (error) {
        console.log("error : ", error);
        return res.status(500).send({
            success: false,
            statuscode: 500,
            message: "An error occurred",
            error: error.message,
        });
    }
};



//to get singleProduct
exports.getSingleproduct = async function (req, res) {
    try {
        let pid = req.params.pid; // Product ID
        let id = req.params.id;  // User ID (could be undefined)

        console.log("pid : ", pid, "id : ", id);

        if (pid) {
            let product = await Product.findOne({ _id: pid });
            console.log("product : ", product);

            if (product) {
                // Fetch the seller's name
                let sellername = await Users.findOne({ _id: product.sellerId });

                // Fetch the category of the product
                let Category = await category.findOne({ _id: product.category });

                // Fetch all products in the same category
                let categoryProduct = await Product.find({ category: Category._id });

                // If `id` is undefined, skip the wishlist logic
                if (id === 'undefined') {
                    return res.status(200).send({
                        success: true,
                        statuscode: 200,
                        product: product,
                        productcategory: Category.name,
                        categoryProduct: categoryProduct, // No `isWishlist` flag
                        sellername: sellername?.email || "Unknown",
                        message: "Products fetched successfully (no user ID provided)",
                    });
                }

                // Fetch the user's wishlist if `id` is defined
                let user = await Users.findOne({ _id: id }, { wishlist: 1 });
                let userWishlist = user?.wishlist || [];

                // Add isWishlist flag for each product in categoryProduct
                categoryProduct = categoryProduct.map((item) => {
                    return {
                        ...item._doc, // Spread product fields
                        isWishlist: userWishlist.includes(item._id.toString()), // Check if product is in wishlist
                    };
                });

                return res.status(200).send({
                    success: true,
                    statuscode: 200,
                    product: product,
                    productcategory: Category.name,
                    categoryProduct: categoryProduct,
                    sellername: sellername?.email || "Unknown",
                    message: "Products fetched successfully",
                });
            } else {
                return res.status(400).send({
                    success: false,
                    statuscode: 400,
                    message: "Product not found",
                });
            }
        } else {
            return res.status(400).send({
                success: false,
                statuscode: 400,
                message: "Product ID is missing",
            });
        }
    } catch (error) {
        console.log("error : ", error);
        return res.status(500).send({
            success: false,
            statuscode: 500,
            message: "An error occurred",
        });
    }
};


//to add products in addtocart
exports.addToCart = async function (req, res) {
    try {
        const { id, productid } = req.params; // Extract user ID and product ID

        // Validate inputs
        if (!id) {
            return res.status(401).json({ success: false, message: 'Please log in to add to the cart.' });
        }
        if (!productid) {
            return res.status(400).json({ success: false, message: 'Product ID is required.' });
        }

        // Use $addToSet to add product ID to the cart if it doesn't already exist
        const updateResult = await Users.updateOne(
            { _id: id },
            { $addToSet: { addtocart: productid } } // Add productid directly as a string
        );

        console.log("updateResult:", updateResult);

        // Fetch the updated user document to calculate the cart count
        const updatedUser = await Users.findOne({ _id: id });

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Check update result
        if (updateResult.matchedCount > 0) {
            if (updateResult.modifiedCount > 0) {
                res.json({
                    success: true,
                    message: 'Product added to cart successfully!',
                    // Return the updated cart count
                });
            } else {
                res.status(400).json({ success: false, message: 'Product is already in the cart.', count: updatedUser.addtocart.length });
            }
        } else {
            res.status(404).json({ success: false, message: 'User not found.' });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: 'An error occurred while adding to the cart.', error });
    }
};

//to update from addtocart
exports.updateAddToCart = async function (req, res) {
    try {
        const { id, productid } = req.params; // Extract user ID and product ID

        // Validate inputs
        if (!id) {
            return res.status(401).json({ success: false, message: 'Please log in to manage the cart.' });
        }
        if (!productid) {
            return res.status(400).json({ success: false, message: 'Product ID is required.' });
        }

        // Use $pull to remove the product ID from the cart
        const updateResult = await Users.updateOne(
            { _id: id },
            { $pull: { addtocart: productid } } // Remove the specific product ID from the cart array
        );

        console.log("updateResult:", updateResult);

        // Check update result
        if (updateResult.matchedCount > 0) {
            if (updateResult.modifiedCount > 0) {
                // Fetch the updated user document to calculate the new cart count
                const updatedUser = await Users.findOne({ _id: id });
                res.json({
                    success: true,
                    message: 'Product removed from cart successfully!',
                    count: updatedUser ? updatedUser.addtocart.length : 0, // Return updated cart count
                });
            } else {
                res.status(400).json({ success: false, message: 'Product not found in the cart.' });
            }
        } else {
            res.status(404).json({ success: false, message: 'User not found.' });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: 'An error occurred while updating the cart.', error });
    }
};

//to add products in wishlist
exports.addToWishlist = async function (req, res) {
    try {
        const { id, productid } = req.params; // Extract user ID and product ID

        // Validate inputs
        if (!id) {
            return res.status(401).json({ success: false, message: 'Please log in to add to the wishlist.' });
        }
        if (!productid) {
            return res.status(400).json({ success: false, message: 'Product ID is required.' });
        }

        // Fetch the user's current wishlist
        const user = await Users.findOne({ _id: id });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Check if the product is already in the wishlist
        const isInWishlist = user.wishlist.includes(productid);

        // If the product is already in the wishlist, remove it
        if (isInWishlist) {
            const updateResult = await Users.updateOne(
                { _id: id },
                { $pull: { wishlist: productid } } // Remove product from wishlist
            );

            console.log("Product removed from wishlist:", updateResult);

            return res.json({
                success: true,
                message: 'Product removed from wishlist.',
                wishlistCount: user.wishlist.length - 1, // Return updated wishlist count
            });
        } else {
            // If the product is not in the wishlist, add it
            const updateResult = await Users.updateOne(
                { _id: id },
                { $addToSet: { wishlist: productid } } // Add product to wishlist
            );

            console.log("Product added to wishlist:", updateResult);

            return res.json({
                success: true,
                message: 'Product added to wishlist successfully!',
                wishlistCount: user.wishlist.length + 1, // Return updated wishlist count
            });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: 'An error occurred while modifying the wishlist.', error });
    }
};


// //to update from Whishlist
// exports.updateAddToWishlist = async function (req, res) {
//     try {
//         const { id, productid } = req.params; // Extract user ID and product ID

//         // Validate inputs
//         if (!id) {
//             return res.status(401).json({ success: false, message: 'Please log in to manage the wishlist.' });
//         }
//         if (!productid) {
//             return res.status(400).json({ success: false, message: 'Product ID is required.' });
//         }

//         // Use $pull to remove the product ID from the wishlist
//         const updateResult = await Users.updateOne(
//             { _id: id },
//             { $pull: { wishlist: productid } } // Remove the specific product ID from the wishlist
//         );

//         console.log("updateResult:", updateResult);

//         // Check update result
//         if (updateResult.matchedCount > 0) {
//             if (updateResult.modifiedCount > 0) {
//                 // If the product was successfully removed, send updated wishlist count
//                 const updatedUser = await Users.findOne({ _id: id });
//                 res.json({
//                     success: true,
//                     message: 'Product removed from wishlist successfully!',
//                     wishlistCount: updatedUser ? updatedUser.wishlist.length : 0, // Updated wishlist count
//                 });
//             } else {
//                 res.status(400).json({ success: false, message: 'Product not found in the wishlist.' });
//             }
//         } else {
//             res.status(404).json({ success: false, message: 'User not found.' });
//         }
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ success: false, message: 'An error occurred while updating the wishlist.', error });
//     }
// };

//to fetch all products in addtocart
exports.getAllAddToCart = async function (req, res) {
    try {
        const id = req.params.id;

        // Validate the User ID
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing user ID",
            });
        }

        console.log("Fetching cart for user ID:", id);

        // Fetch the user by ID
        const user = await Users.findById(id);
        console.log("User:", user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if the user has items in their cart
        const { addtocart, wishlist } = user; // Assume user has a `wishlist` field
        if (!addtocart || addtocart.length === 0) {
            const pincode = user.address?.[0]?.pincode || "Add an Address";
            return res.status(200).json({
                success: true,
                message: "No products in the user's cart",
                products: [],
                count: 0,
                totalprice: 0,
                address: pincode,
            });
        }

        console.log("Product IDs in cart:", addtocart);
        console.log("Product IDs in wishlist:", wishlist);

        // Pagination (optional)
        const limit = parseInt(req.query.limit, 10) || addtocart.length;
        const skip = parseInt(req.query.skip, 10) || 0;

        // Fetch products from the database
        const products = await Product.find({ _id: { $in: addtocart } })
            .skip(skip)
            .limit(limit);

        if (!products || products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found for the given IDs",
            });
        }

        console.log("Products:", products);

        // Set a `wishlist` flag for each product
        const wishlistSet = new Set(wishlist); // Use a Set for quick lookup
        const updatedProducts = products.map((product) => {
            return {
                ...product._doc, // Spread the product data
                wishlist: wishlistSet.has(product._id.toString()), // Add `wishlist` flag
            };
        });

        // Calculate total items and total price
        const totalCount = addtocart.length;
        const totalPrice = updatedProducts.reduce(
            (sum, product) => sum + (product.discountPrice || 0),
            0
        );
        console.log("Total Price:", totalPrice);

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products: updatedProducts,
            count: totalCount,
            totalprice: totalPrice,
            address: user.address,
        });
    } catch (error) {
        console.error("Error fetching cart products:", error.message);
        res.status(500).json({
            success: false,
            message: "An internal server error occurred",
            error: error.message,
        });
    }
};


//to fetch all products in Whishlist
exports.getAllWishlist = async function (req, res) {
    try {
        const id = req.params.id;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing user ID",
            });
        }

        console.log("Fetching wishlist for user ID:", id);

        const user = await Users.findById(id);
        console.log("User:", user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const { wishlist } = user;

        if (!wishlist || wishlist.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No products in the user's wishlist",
                products: [],
                count: 0,
                address: user.address
            });
        }

        console.log("Product IDs in wishlist:", wishlist);

        const limit = parseInt(req.query.limit, 10) || wishlist.length;
        const skip = parseInt(req.query.skip, 10) || 0;

        const products = await Product.find({ _id: { $in: wishlist } })
            .skip(skip)
            .limit(limit);

        if (!products || products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found for the given IDs",
            });
        }

        console.log("Products:", products);

        const totalCount = wishlist.length;

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products,
            count: totalCount,
            address: user.address
        });
    } catch (error) {
        console.error("Error fetching wishlist products:", error.message);
        res.status(500).json({
            success: false,
            message: "An internal server error occurred",
            error: error.message,
        });
    }
};

exports.getallproducttoorder = async function (req, res) {
    try {
        // Get the 'items' from the route parameters or query string
        const items = req.params.items ? req.params.items.split(',') : []; // Split by comma if items are passed as a string in the URL
        console.log("Items:", items);

        if (items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or empty items array.",
            });
        }

        // Fetch user details from the database
        let user = await Users.findOne({ _id: req.params.id });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Fetch products whose IDs are in the `items` array
        const products = await Product.find({
            _id: { $in: items }, // Use the $in operator to find products with IDs in the 'items' array
        });

        if (!products || products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found for the given IDs.",
            });
        }

        // Return the products found in the response along with user address
        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products,
            address: user.address, // Assuming user.address is an array
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching products.",
        });
    }
};

//to place order
exports.placeOrder = async function (req, res) {
    try {
        const userId = req.params.id;
        console.log("userId:", userId);

        const { items, addressId } = req.body;  // Get addressId from the request body
        console.log("items:", items);  // Log the entire items array

        // Ensure missing quantities default to 1
        items.forEach(item => {
            if (!item.quantity || item.quantity <= 0 || item.quantity === 'null' || item.quantity === undefined) {
                item.quantity = 1; // Default to 1 if no valid quantity is provided
            }
        });

        // Validate inputs
        if (!items || items.length === 0 || !items.every(item => item.product_id && item.quantity > 0)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID or quantity",
            });
        }

        const user = await Users.findOne({ _id: userId });
        console.log("user:", user);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Retrieve the address using addressId
        const userAddress = user.address.find(address => address._id.toString() === addressId);
        if (!userAddress) {
            return res.status(404).json({
                success: false,
                message: "Address not found",
            });
        }

        // Retrieve products for all items in the cart to avoid multiple DB queries inside the loop
        const productIds = items.map(item => item.product_id);
        const products = await Product.find({ _id: { $in: productIds } });

        let totalOrderPrice = 0;
        let orderedProducts = [];
        let productUpdates = [];
        let outOfStockProducts = [];

        for (let item of items) {
            const { product_id, quantity } = item;
            const product = products.find(p => p._id.toString() === product_id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product with ID ${product_id} not found`,
                });
            }

            // Check for stock availability
            if (product.stockQuantity < quantity) {
                outOfStockProducts.push(product);  // Add to out-of-stock list if product is unavailable
                continue;  // Skip this product and move to the next one
            }

            // Calculate the total price for the product based on the discount price
            const productTotalPrice = product.discountPrice * quantity;
            totalOrderPrice += productTotalPrice;

            // Add order to user's order history
            user.orders.push({
                productId: product_id,
                quantity,
                totalPrice: productTotalPrice,
            });

            orderedProducts.push({
                productName: product.name,
                quantity,
                price: product.discountPrice,  // Use discount price here
                totalPrice: productTotalPrice,
            });

            // Decrease the stock quantity of the product
            product.stockQuantity -= quantity;

            if (product.stockQuantity === 0) {
                product.stockStatus = "Out of Stock";
                // Send an email to the seller if the product is out of stock
                const seller = await Users.findOne({ _id: product.sellerId });
                if (seller) {
                    const emailTemplate = await set_stock_template(seller.email, product.stockQuantity, product.name);
                    await sendEmail(seller.email, "Out of Stock Notification", emailTemplate);  // Send email to seller
                }
            }

            // Save product update to be processed in bulk
            productUpdates.push(product.save());
        }

        // Process all product updates in parallel
        await Promise.all(productUpdates);
        // Save user's order data
        await user.save();

        // Send order placed email to the buyer
        const userEmail = user.email;
        const emailTemplate = await set_orderplace_template(userEmail, orderedProducts, totalOrderPrice, userAddress);
        await sendEmail(userEmail, "Order Confirmation", emailTemplate);  // Sending confirmation email to the user

        // If the order was successfully placed, return the response
        return res.status(200).json({
            success: true,
            message: "Order placed successfully",
            totalAmount: totalOrderPrice,
            orders: user.orders,
            address: userAddress,  // Send the address back in the response as well
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};


// exports.reorder = async function (req, res) {
//     try {
//         const userId = req.params.id;
//         console.log("userId:", userId);

//         const { items } = req.body;
//         console.log("items:", items);

//         // Validate inputs
//         if (!items || items.length === 0 || !items.every(item => item.product_id && item.quantity > 0)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid product ID or quantity",
//             });
//         }

//         const user = await Users.findOne({ _id: userId });
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found",
//             });
//         }

//         let totalOrderPrice = 0;
//         let reorderedProducts = [];

//         // Process the items for reorder
//         for (let item of items) {
//             const { product_id, quantity } = item;

//             // Check if the product has already been ordered before
//             const alreadyOrderedProduct = user.orders.find(order => order.productId.toString() === product_id);
//             if (!alreadyOrderedProduct) {
//                 continue;  // Skip products that haven't been ordered before
//             }

//             const product = await Product.findOne({ _id: product_id });
//             if (!product) {
//                 return res.status(404).json({
//                     success: false,
//                     message: `Product with ID ${product_id} not found`,
//                 });
//             }

//             if (product.stockQuantity < quantity) {
//                 return res.status(400).json({
//                     success: false,
//                     message: `Insufficient stock available for product ${product.name}`,
//                 });
//             }

//             const productTotalPrice = product.price * quantity;
//             totalOrderPrice += productTotalPrice;

//             // Add the reordered product to the order
//             user.orders.push({
//                 productId: product_id,
//                 quantity,
//                 totalPrice: productTotalPrice,
//             });

//             reorderedProducts.push({
//                 productName: product.name,
//                 quantity,
//                 price: product.price,
//                 totalPrice: productTotalPrice,
//             });

//             // Decrease the stock of the product
//             product.stockQuantity -= quantity;

//             if (product.stockQuantity === 0) {
//                 product.stockStatus = "Out of Stock";
//                 // Send email notification to the seller (uncomment if needed)
//                 // const emailTemplate1 = await set_stock_template(user.email, product.stockQuantity);
//                 // await sendEmail(user.email, "Out of Stock Notification", emailTemplate1);
//             }

//             // Save the updated product data in the database
//             await product.save();
//         }

//         // Send reorder confirmation email if needed
//         // const emailTemplate = await set_orderplace_template(user.email, reorderedProducts, totalOrderPrice);
//         // await sendEmail(user.email, "Reorder Confirmation", emailTemplate);

//         // Save the user's updated order history
//         await user.save();

//         return res.status(200).json({
//             success: true,
//             message: "Reorder placed successfully",
//             totalAmount: totalOrderPrice,
//             orders: user.orders,
//         });

//     } catch (error) {
//         console.error("Error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Something went wrong",
//         });
//     }
// };

//to cancel order
exports.CancelOrder = async function (req, res) {
    try {
        const userId = req.params.id;
        const { order_id, product_id, quantity } = req.body; // order_id, product_id, and quantity to cancel the order
        console.log("userid : ", userId, "order_id : ", order_id, "product_id : ", product_id, "quantity : ", quantity);

        // Validate inputs
        if (!order_id || !product_id || !quantity || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID, product ID, or quantity",
            });
        }

        // Find the user by ID
        const user = await Users.findOne({ _id: userId });
        console.log("user : ", user);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Find the product by ID
        const product = await Product.findOne({ _id: product_id });
        console.log("product : ", product);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Find the specific order in the user's orders array using the order _id
        const order = user.orders.find(order => order._id.toString() === order_id && order.productId.toString() === product_id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // Check if the quantity to cancel is valid
        if (order.quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel more than the ordered quantity",
            });
        }

        // Update the product stock by adding back the canceled quantity
        product.stockQuantity += quantity;

        // If stockQuantity is now greater than 0, update the stock status to "In Stock"
        if (product.stockQuantity > 0) {
            product.stockStatus = "In Stock";
        }

        // Remove the canceled order from the user's orders array
        user.orders = user.orders.filter(order => !(order._id.toString() === order_id && order.productId.toString() === product_id));

        // Save the updated user and product
        await user.save();
        await product.save();

        // Send email to the user about the order cancellation
        // const emailTemplate = await set_order_cancel_template(user.email, product.name, quantity);
        // await sendEmail(user.email, "Order Cancelled", emailTemplate);
        // console.log("Cancellation email sent to user");

        return res.status(200).json({
            success: true,
            message: "Order canceled successfully",
            orders: user.orders,
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

exports.getOrderedProducts = async function (req, res) {
    try {
        const userId = req.params.id; // Get userId from the URL parameters
        console.log("User ID:", userId);

        // Find the user by ID
        const user = await Users.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if the user's orders array is empty
        if (!user.orders || user.orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Your order list is empty!",
            });
        }

        const orderedProducts = [];

        for (let order of user.orders) {
            const productId = order.productId;

            if (productId) {
                const product = await Product.findById(productId);
                if (product) {
                    orderedProducts.push({
                        orderId: order._id,
                        orderDate: order.orderDate,
                        orderPrice: order.totalPrice,
                        productId: product._id,
                        productName: product.name,
                        quantity: order.quantity,
                        totalPrice: order.totalPrice,
                        productImage: product.images,
                        productDescription: product.description,
                        price: product.price,
                        discountPrice: product.discountPrice,
                        category: product.category,
                        brand: product.brand,
                    });
                } else {
                    return res.status(404).json({
                        success: false,
                        message: `Product with ID ${productId} not found`,
                    });
                }
            }
        }

        // Check if no ordered products were found after processing the orders
        if (orderedProducts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found in order history",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Ordered products fetched successfully",
            orderedProducts,
        });

    } catch (error) {
        console.error("Error fetching ordered products:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching ordered products",
        });
    }
};

exports.ProductSections = async function (req, res) {
    try {
        const userId = req.params.id; // The user ID from the URL
        let productOnOffer, productOnEliteOffer, productNew, highestPricedProducts;
        let user;

        // 1. Find products under discountPrice 500
        productOnOffer = await Product.find({ discountPrice: { $lt: 500 } });

        // 2. Find the last 5 least discountPrice products (elite offer products)
        productOnEliteOffer = await Product.find()
            .sort({ discountPrice: 1 }) // Sort by discountPrice in ascending order
            .limit(5); // Limit to 5 products

        // 3. Find the last added 8 products
        const totalLength = await Product.countDocuments(); // Get total number of products
        const num = totalLength - 8; // Calculate the number of products to skip for the last 8 products

        productNew = await Product.find()
            .sort({ createdAt: 1 }) // Sort by createdAt to get the most recently added products
            .skip(num) // Skip 'num' products
            .limit(8); // Limit to 8 products after skipping 'num'

        // 4. Find the highest priced products (assuming price field)
        highestPricedProducts = await Product.find()
            .sort({ price: -1 }) // Sort by price in descending order to get the highest-priced
            .limit(5); // You can adjust the number as needed, here I assume 5 highest-priced products

        // If userId is provided, check if the product is in the user's wishlist
        if (userId && userId !== 'undefined') {
            // Find the user by ID
            user = await Users.findById(userId).select('wishlist');
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Get user's wishlist and ensure it's in string format for comparison
            let userWishlist = user.wishlist ? user.wishlist.map(id => id.toString()) : [];
            console.log('User wishlist:', userWishlist); // Debugging wishlist data

            // Helper function to add 'isInWishlist' flag to products
            const addWishlistFlag = (products) => {
                return products.map(product => {
                    const isInWishlist = userWishlist.includes(product._id.toString());
                    console.log(`Product ${product._id.toString()} is in wishlist: ${isInWishlist}`);
                    return {
                        ...product.toObject(),  // Convert product to plain object if it's a Mongoose document
                        isInWishlist: isInWishlist
                    };
                });
            };

            // Add 'isInWishlist' flag for products in different sections
            productOnOffer = addWishlistFlag(productOnOffer);
            productOnEliteOffer = addWishlistFlag(productOnEliteOffer);
            productNew = addWishlistFlag(productNew);
            highestPricedProducts = addWishlistFlag(highestPricedProducts);
        }

        // Sending the results back in the response with the wishlist flag included
        res.status(200).json({
            productOnOffer,
            productOnEliteOffer,
            productNew,
            highestPricedProducts, // Include the highest-priced products in the response
        });

    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Error fetching product sections." });
    }
};



  
  
























































