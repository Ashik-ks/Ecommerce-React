import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useCount } from '../CountContext';
import axios from 'axios';
import AddToWishlist from './addtowishlist';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [showWishlist, setShowWishlist] = useState(false);
    const [localCount, setLocalCount] = useState(0); // Local state for fetched count
    const { updateCount } = useCount();
    const navigate = useNavigate();
    const { id, usertype } = useParams();

    useEffect(() => {
        // Determine if the wishlist icon should be shown
        setShowWishlist(id && id !== 'null');

        // Fetch products data from the server
        const fetchProducts = async () => {
            const userId = id ?? 'null'; // Default to 'null' if id is missing
            try {
                const response = await fetch(`http://localhost:3000/getallproducts/${userId}`);
                const parsedResponse = await response.json();

                if (parsedResponse.success && Array.isArray(parsedResponse.responseProducts)) {
                    setProducts(parsedResponse.responseProducts);
                    setLocalCount(parsedResponse.count); // Update local count state
                    updateCount(parsedResponse.count); // Update shared count state
                } else {
                    setProducts([]);
                }
            } catch (err) {
                console.error('Error:', err);
            }
        };

        fetchProducts();
    }, [id, updateCount]); // Dependency array includes id and updateCount

    const token = localStorage.getItem(id);

    const addToWishlist = async (productId) => {
        try {
            await AddToWishlist(productId, id, token);
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            alert("Something went wrong while adding to the wishlist.");
        }
    };

    const singleProduct = (productId, category) => {
        // Navigate to the single product view
        navigate(`/singleview/${productId}/${id}/${category}/${usertype}`);
    };

    return (
        <>
<div className="container max-w-screen-xl px-4 py-6 mx-auto">
    <div id="allproducts" className="mt-5">
        {products.length > 0 ? (
            <div className="grid-container">
                {products.map((product) => {
                    const imageUrl = product.images && product.images[0]
                        ? product.images[0]
                        : 'fallback-image-url.jpg'; // Use fallback image if not available

                    return (
                        <div
                            key={product._id}
                            className="product-card transition-transform duration-300 hover:scale-105 hover:shadow-lg bg-white rounded-lg p-3"
                            style={{
                                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Default shadow
                                borderRadius: "8px",
                            }}
                        >
                            {/* Conditionally render the wishlist heart icon */}
                            {showWishlist && id !== 'null' && id !== 'undefined' && (
                                <div
                                    className="position-relative"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent event from bubbling up
                                        addToWishlist(product._id);
                                    }}
                                >
                                    <span
                                        className="wishlistheart"
                                        style={{
                                            position: "absolute",
                                            top: "-12px",
                                            left: "10px",
                                            zIndex: 10,
                                        }}
                                    >
                                        <i
                                            className={`fa fa-heart fs-3 ${product.isInWishlist ? 'text-danger' : 'text-slate-300'}`}
                                            aria-hidden="true"
                                        ></i>
                                    </span>
                                </div>
                            )}

                            {/* Product Image */}
                            <div onClick={(e) => {
                                e.stopPropagation(); // Prevent the click on the image from triggering wishlist action
                                singleProduct(product._id, product.category);
                            }}>
                                <img
                                    src={`http://localhost:3000/${imageUrl}`}
                                    className="w-full mx-auto h-[100px] object-cover md:h-[250px] lg:h-[300px] rounded-md"
                                    alt="Item Image"
                                />
                            </div>

                            {/* Product Details */}
                            <button className="border-0">
                                <div className="d-flex justify-content-start">
                                    {/* Product Name */}
                                    <div className="mt-4 text-md text-start text-gray-800 ms-1">
                                        {product.name.slice(0, 20)}
                                        {product.name.length > 30 ? "..." : ""}
                                    </div>
                                    {/* Price and Discount Price */}
                                    <div className="flex justify-content-start gap-3 mt-1 ms-1">
                                        <span
                                            className="text-lg font-bold text-black"
                                            style={{ fontSize: "1rem", fontWeight: "bold" }}
                                        >
                                            Offer: ₹{product.discountPrice}
                                        </span>
                                        <span
                                            className="text-md price line-through text-black"
                                            style={{ fontSize: "1rem" }}
                                        >
                                            Price: ₹{product.price}
                                        </span>
                                    </div>

                                    {/* Stock status */}
                                    <div
                                        className="mt-1 ms-1 text-sm text-gray-500 text-start"
                                        style={{ fontSize: "1rem", fontWeight: "bold" }}
                                    >
                                        {product.stockStatus}
                                    </div>
                                </div>
                            </button>
                        </div>
                    );
                })}
            </div>
        ) : (
            <div>No products found.</div>
        )}
    </div>
</div>

        </>
    );
};

export default AllProducts;
