import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useCount } from '../CountContext';
import HeaderComponent from '../nav/navSecond';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [showWishlist, setShowWishlist] = useState(false);
    const [localCount, setLocalCount] = useState(0); // Local state for fetched count
    const { updateCount } = useCount();
    const navigate = useNavigate();
    let { id } = useParams();

    useEffect(() => {

        console.log("checkid: ", id);

        // If the id is 'null', we should not display the wishlist heart icon for any product
        setShowWishlist(id !== 'null' && id !== null);

        // Default to 'null' if no ID is found in the URL
        if (id === null || id === '') {
            id = 'null';
        }

        // Fetch products data from the server
        const fetchProducts = async () => {
            try {
                const response = await fetch(`http://localhost:3000/getallproducts/${id}`);
                const parsedResponse = await response.json();
                console.log(" parsedResponse: ", parsedResponse.responseProducts);

                if (parsedResponse.success && Array.isArray(parsedResponse.responseProducts)) {
                    setProducts(parsedResponse.responseProducts);
                    setLocalCount(parsedResponse.count); // Update local state
                    updateCount(parsedResponse.count);
                } else {
                    setProducts([]);
                }
            } catch (err) {
                console.error('Error:', err);
            }
        };

        fetchProducts();
    }, []);  // Empty dependency array to run once when the component is mounted

    const addToCart = (productId) => {
        // Add to cart logic
        console.log(`Adding product ${productId} to the cart.`);
    };

    const singleProduct = (productId,category) => {
        // Handle navigation or action for a single product
        navigate(`/singleview/${productId}/${id}/${category}`);
    };

    return (
       <>
        <div className="container max-w-screen-xl px-4 py-6 mx-auto">
            <div id="allproducts" className="mt-5">
                {products.length > 0 ? (
                    <div className="grid-container">
                        {products.map((product) => {
                            const imageUrl = product.images && product.images[0] ? product.images[0] : 'fallback-image-url.jpg'; // Use fallback image if not available
                            const isInWishlist = product.isInWishlist ? 'block' : 'none';

                            return (
                                <div key={product._id} className="product-card">
                                    {/* Wishlist heart icon on top of the image */}
                                    <div className="position-relative">
                                        <span
                                            id={`wishlistheart-${product._id}`}
                                            className="wishlistheart"
                                            style={{
                                                display: isInWishlist,  // Show only if the product is in the wishlist
                                                position: 'absolute',  // Position it absolutely over the image
                                                top: '-12px',
                                                left: '10px',  // Align the heart icon to the left-top corner of the image
                                                zIndex: 10,  // Keep the heart on top of the image
                                            }}
                                        >
                                            <i className="fa fa-heart fs-5 text-danger" aria-hidden="true"></i>
                                        </span>

                                        <img
                                            src={`http://localhost:3000/${imageUrl}`}
                                            className="card-img-top w-75 mx-auto"  // Centering the image using mx-auto
                                            alt="Item Image"
                                            onClick={() => singleProduct(product._id,product.category)}
                                        />
                                    </div>
                                    <button className="border-0">
                                        <div className="d-flex justify-content-start">
                                            {/* Product Name */}
                                            <div className="mt-4 text-md text-start text-gray-800 ms-1">
                                                {product.name.slice(0, 20)}{product.name.length > 30 ? '...' : ''}
                                            </div>
                                            {/* Price and Discount Price */}
                                            <div className="flex justify-content-start gap-3 mt-1 ms-1">
                                                <span className="text-lg font-bold text-black" style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                                                    Offer: ₹{product.discountPrice}
                                                </span>
                                                <span className="text-md price line-through text-black" style={{ fontSize: '1rem' }}>
                                                    Price: ₹{product.price}
                                                </span>
                                            </div>

                                            {/* Stock status */}
                                            <div className="mt-1 ms-1 text-sm text-gray-500 text-start" style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                                                {product.stockStatus}
                                            </div>
                                        </div>
                                    </button>
                                    <div className="bg-white text-center pb-2">
                                        <button className="addtocartbtn mt-2" onClick={() => addToCart(product._id)}>
                                            Add to Cart
                                        </button>
                                    </div>
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
