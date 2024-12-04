import React, { useState, useEffect, useRef } from "react";
import Footer from "../footer/footer";
import InnerPagesNav from "../nav/innerpagesnav";
import { useNavigate, useParams } from "react-router-dom";
import { useCount } from '../CountContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import AddToCart from "../functions/addtocart";
import AddToWishlist from "../functions/addtowishlist";


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

    const singleProduct = (productId, category) => {
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

    let token = localStorage.getItem(id)


    const addToCart = async (productId) => {
        try {
            await AddToCart(productId, id, token);
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Something went wrong while adding to the cart.");
        }
    };

    const addToWishlist = async (productId) => {
        try {
            await AddToWishlist(productId, id, token);
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Something went wrong while adding to the cart.");
        }
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
                                    <div className="flex gap-4 mt-25">
                                        <div className="bg-white text-center pb-2">
                                            <button
                                                className="addtocartbtn mt-2"
                                                onClick={() => addToCart(productData._id)}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                        <div className="bg-white text-center pb-2 bg-white text-center pb-2">
                                            <button
                                                className="addtocartbtn mt-2 flex gap-3 items-center"
                                                onClick={() => handleWishlist(productData?._id)}
                                            >
                                                <FontAwesomeIcon icon={faHeart} className="text-purple-400" />
                                                <span className="">Wishlist</span>
                                            </button></div>
                                        <div className="bg-white text-center pb-2 ">
                                            <button
                                                className="addtocartbtn mt-2 flex gap-3 items-center"
                                                onClick={() => handleBuyNow(productData?._id)}
                                            >
                                                <FontAwesomeIcon icon={faShoppingCart} className="text-purple-400" />
                                                <span className=""  onClick={() => {

                navigate(`/billing/${id}/${productData._id}/${usertype}`);
            }}>Buy Now</span>
                                            </button>
                                        </div>
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
{/* Grid for Related Products */}
<div className="datacontainercategorysinglepage mt-5">
    {relatedProducts?.map((relatedProduct) => {
        const imageUrl = relatedProduct?.images[0]
            ? `http://localhost:3000/${relatedProduct.images[0]}`
            : 'fallback-image-url.jpg'; // Use fallback image if not available

        // Determine if the heart should be highlighted based on the wishlist status
        const isInWishlist = relatedProduct?.isWishlist ? 'text-red-500' : 'text-slate-300'; // Apply color class dynamically

        return (
            <div
                key={relatedProduct?._id}
                className="flex flex-col shadow-md p-4 bg-light rounded cursor-pointer relative overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                onClick={() => singleProduct(relatedProduct._id, relatedProduct.category)}
            >
                {/* Conditionally Render Wishlist Heart */}
                {id && id !== "undefined" && ( // Render heart only if `id` exists and is valid
                    <div
                        className="position-relative"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent navigation click event
                            addToWishlist(relatedProduct._id); // Handle add/remove from wishlist
                        }}
                    >
                        <span
                            id={`wishlistheart-${relatedProduct._id}`}
                            className="wishlistheart"
                            style={{
                                position: 'absolute',
                                top: '-2px',
                                left: '10px',
                                zIndex: 10, // Ensure the heart is above the image
                            }}
                        >
                            <i
                                className={`fa fa-heart fs-5 ${isInWishlist}`} // Dynamically style the heart icon
                                aria-hidden="true"
                            ></i>
                        </span>
                    </div>
                )}

                {/* Product Image */}
                <img
                    src={imageUrl}
                    className="w-full mx-auto h-[100px] object-cover md:h-[250px] lg:h-[300px]" // Fixed height and responsive styles
                    alt="Related Product"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent parent click event if the user clicks the image
                        singleProduct(relatedProduct._id, relatedProduct.category);
                    }}
                />

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
