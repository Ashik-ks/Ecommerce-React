import React, { useState, useEffect, useRef } from "react";
import Footer from "../footer/footer";
import InnerPagesNav from "../nav/innerpagesnav";
import { useNavigate, useParams } from "react-router-dom";
import { useCount } from '../CountContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  // <-- Add this import
import { faHeart, faShoppingCart } from "@fortawesome/free-solid-svg-icons";  // <-- Import required icons

function Singleview() {
    const [productData, setProductData] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [sellerData, setsellerData] = useState(null);
    const [categoryProducts, setcategoryProducts] = useState([]);
    const [zoomedImage, setZoomedImage] = useState(null);
    const zoomedImgRef = useRef(null);

    const navigate = useNavigate();
    const { pid } = useParams();
    const { id } = useParams();
    console.log("pid : ", id);
    let { usertype } = useParams();

    const singleProduct = (productId,category) => {
        // Handle navigation or action for a single product
        navigate(`/singleview/${productId}/${id}/${category}/${usertype}`);
        window.location.reload(); 
    };

    const getSingleProduct = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/getSingleproduct/${id}/${pid}`);
            const data = response.data;
            console.log("data : ", data);
            setProductData(data.product);
            setRelatedProducts(data.categoryProduct);
            setcategoryProducts(data.productcategory);
            setsellerData(data.sellername);
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    useEffect(() => {
        getSingleProduct();
    }, [pid]);

    const sanitizeUrl = (url) => {
        try {
            if (!url) throw new Error("Invalid URL");
            const normalizedUrl = url.replace(/\\/g, '/').replace(/\/{2,}/g, '/');
            return encodeURI(decodeURIComponent(normalizedUrl.trim()));
        } catch (error) {
            console.error("Error sanitizing URL:", error);
            return 'path/to/placeholder-image.jpg'; // Fallback placeholder
        }
    };

    const displayZoomedImage = (imageUrl) => {
        const sanitizedUrl = sanitizeUrl(imageUrl);
        setZoomedImage(sanitizedUrl); // Set sanitized URL to state
    };

    const handleImageError = () => {
        console.error("Failed to load image, setting fallback image");
        setZoomedImage('path/to/placeholder-image.jpg');
    };

    return (
        <>
            <InnerPagesNav />
            <div className="border-b border-gray-300 pt-2 pb-2 bg-gray-100">
                <div className="dataContainer max-w-screen-xl mx-auto">
                    <div className="container">
                        {/* Category Breadcrumb */}
                        <div className="pt-4" id="categorydiv">
                            <div className="categoryText text-gray-600">
                                HOME &gt; {categoryProducts || 'Unknown'} &gt;{' '}
                                {productData?.subcategory || 'Unknown'} &gt;{' '}
                                {productData?.item || 'Unknown'} &gt;{' '}
                                {productData?.name || 'Unknown'}
                            </div>
                        </div>

                        {/* Product Details */}
                        <div id="singleproductcontainer" className="mt-3 bg-white p-2">
                            <div className="flex gap-4">
                                {/* Left Side Images */}
                                <div className="w-2/12">
                                    <div className="flex flex-col gap-1" id="imageunzoom">
                                        {productData?.images.map((image, index) => (
                                            <img
                                                key={index}
                                                alt="Product Image"
                                                className="img-fluid"
                                                height="100"
                                                src={`http://localhost:3000/${image}`}
                                                width="100"
                                                onClick={() => displayZoomedImage(image)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Zoomed Image */}
                                <div className="">
                                    <div className="text-center mt-1" id="imagezoom">
                                        <img
                                            id="zoomedImg"
                                            className="zoomedImg w-full h-auto"  // Added w-full to make it take full width
                                            src={`http://localhost:3000/${zoomedImage || productData?.images[0]}`}
                                            alt="Zoomed Image"
                                        />
                                    </div>
                                </div>
                                {/* Product Details */}
                                <div className="w-5/12 pt-2 ms-5">
                                    <h1 className="text-lg font-semibold mb-1">{productData?.description}</h1>
                                    <div className="flex flex-col mt-2">
                                        <span className="mb-1">Price ₹{productData?.price}</span>
                                        <span className="text-green-600 font-bold mb-1">
                                            Discount Price ₹{productData?.discountPrice}
                                        </span>
                                        <span className="font-semibold text-green-600">{productData?.weight} gm</span>
                                    </div>
                                    <div className="mt-1 mb-1">Inclusive of all taxes</div>
                                    <span className="text-sm font-semibold mt-1">Seller: {sellerData}</span>

                                    {/* Wishlist and Buy Now Buttons */}
                                    <div className="flex gap-4 mt-3">
                                        <button
                                            className="btn bg-black flex items-center border-gray-300 px-2 py-1 gap-2 rounded-[4px]"
                                            onClick={() => handleWishlist(productData?._id)}
                                        >
                                            <FontAwesomeIcon icon={faHeart} className="text-white" />
                                            <span className="text-white">Wishlist</span>
                                        </button>
                                        <button
                                            className="btn bg-black flex items-center border-gray-300 px-2 py-1 gap-2 rounded-[4px]"
                                            onClick={() => handleBuyNow(productData?._id)}
                                        >
                                            <FontAwesomeIcon icon={faShoppingCart} className="text-white" />
                                            <span className="text-white">Buy Now</span>
                                        </button>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    <div className="container text-center text-2xl font-semibold underline mt-8">
                        Related Products
                    </div>

                    {/* Grid for Related Products */}
                    <div className="datacontainercategorysinglepage mt-5">
    {relatedProducts?.map((relatedProduct) => {
        const imageUrl = relatedProduct?.images[0]
            ? `http://localhost:3000/${relatedProduct.images[0]}`
            : 'fallback-image-url.jpg';

        const isInWishlist = relatedProduct?.isWishlist ? 'block' : 'none'; // Conditionally show the heart

        return (
            <div
                key={relatedProduct?._id}
                className="flex flex-col shadow-md p-4 bg-light rounded cursor-pointer relative"
                onClick={() => singleProduct(relatedProduct._id, relatedProduct.category)}
            >
                {/* Product Image with Wishlist Heart */}
                <div className="position-relative">
                    <span
                        id={`wishlistheart-${relatedProduct._id}`}
                        className="wishlistheart"
                        style={{
                            display: isInWishlist, // Show heart only if the product is in the wishlist
                            position: 'absolute', // Position it absolutely over the image
                            top: '-12px',
                            left: '10px', // Align to the top-left corner of the image
                            zIndex: 10, // Ensure the heart is above the image
                        }}
                    >
                        <i className="fa fa-heart fs-5 text-danger" aria-hidden="true"></i>
                    </span>

                    <img
                        src={imageUrl}
                        className="card-img-top w-75 mx-auto" // Center the image
                        alt="Related Product"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent parent click event if the user clicks the image
                            singleProduct(relatedProduct._id, relatedProduct.category);
                        }}
                    />
                </div>

                {/* Product Details */}
                <div className="mt-4">
                    <div className="text-sm text-gray-800">
                        {relatedProduct?.name.slice(0, 23)}
                        {relatedProduct.name.length > 30 ? '...' : ''}
                    </div>
                    <div className="mt-1 text-lg font-bold text-black">
                        Offer: ₹{relatedProduct?.discountPrice}
                    </div>
                    <div className="text-md text-gray-600 line-through">
                        Price: ₹{relatedProduct?.price}
                    </div>
                    <div
                        className="mt-1 text-sm text-gray-500"
                        style={{ fontSize: '1rem', fontWeight: 'bold' }}
                    >
                        {relatedProduct?.stockStatus}
                    </div>
                </div>

                {/* Add to Cart Button */}
                <div className="pb-2">
                    <button
                        className="addtocartbtn mt-2"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the parent onClick
                            addToCart(relatedProduct._id);
                        }}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        );
    })}
</div>


                </div>
            </div>
            <Footer />
        </>
    );
}

export default Singleview;
