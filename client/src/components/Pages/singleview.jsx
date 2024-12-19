import React, { useState, useEffect, useRef } from "react";
import Footer from "../footer/footer";
import InnerPagesNav from "../nav/innerpagesnav";
import { useNavigate, useParams } from "react-router-dom";
import { useCount } from '../CountContext';
import axios from 'axios';
import StarRatings from "react-star-ratings";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart,faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import AddToCart from "../functions/addtocart";
import AddToWishlist from "../functions/addtowishlist";
import {toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function Singleview() {
    const [productData, setProductData] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [sellerData, setsellerData] = useState(null);
    const [categoryProducts, setcategoryProducts] = useState([]);
    const [zoomedImage, setZoomedImage] = useState(null);
    const zoomedImgRef = useRef(null);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);
  const [likedReviews, setLikedReviews] = useState({});

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

    const addReview = async () => {
        try {
            const response = await axios.post(
                `http://localhost:3000/addProductReview/${id}/${pid}`,
                { rating, comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setReviews((prevReviews) => [...prevReviews, response.data.review]);
            setRating(0);
            setComment("");
        } catch (error) {
            console.error("Error adding review:", error);
        }
    };

    const toggleReviewForm = () => {
        setShowReviewForm(prevState => !prevState);
    };

    const handleLikeClick = (reviewId) => {
        setLikedReviews((prev) => ({
          ...prev,
          [reviewId]: !prev[reviewId],
        }));
      };
    
      const toggleViewMore = () => {
        setShowAllReviews(!showAllReviews);
      };

    return (
        <>
            <InnerPagesNav />
            <div className="border-b border-gray-300 pt-2 pb-2 bg-gray-100">
                <div className=" max-w-screen-xl mx-auto">
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
    <div id="pdetails" className="flex flex-col md:flex-row gap-4 ">
        {/* Left Side Images */}
        <div className="w-full md:w-[10%]">
            <div className="leftsideimg flex flex-wrap gap-2" id="imageunzoom">
                {productData?.images.map((image, index) => (
                    <img
                        key={index}
                        alt="Product Image"
                        className="h-full img-fluid"
                        height="200px"
                        src={`http://localhost:3000/${image}`}
                        width="100"
                        onClick={() => displayZoomedImage(image)}
                    />
                ))}
            </div>
        </div>

        {/* Zoomed Image */}
        <div className="w-full md:w-[40%]">
            <div className="text-center mt-1" id="imagezoom">
                <img
                    id="zoomedImg"
                    className="zoomedImg w-full h-auto"
                    src={`http://localhost:3000/${zoomedImage || productData?.images[0]}`}
                    alt="Zoomed Image"
                />
            </div>
        </div>

        {/* Product Details */}
        <div className="w-full md:w-[50%] pt-2 ps-5">
            <h1 className="text-lg font-semibold mb-1 description">{productData?.description}</h1>
            <div className="flex flex-col mt-2">
                <span className="mb-1">Price ₹{productData?.price}</span>
                <span className="text-green-600 font-bold mb-1">
                    Discount Price ₹{productData?.discountPrice}
                </span>
                <span className="font-semibold text-green-600">{productData?.weight} gm</span>
            </div>
            <div className="mt-1 mb-1">Inclusive of all taxes</div>
            <span className="text-sm font-semibold mt-1">Seller: {sellerData}</span>

            {/* Conditional Rendering of Wishlist and Cart Buttons */}
            <div className="flex gap-5 mt-5">
                {/* Add to Cart or Go to Cart */}
                <div className="text-start">
                    {!productData?.isInCart ? (
                        <button
                            className="addtocartbtn mt-2"
                            onClick={() => addToCart(productData._id)}
                        >
                            Add to Cart
                        </button>
                    ) : (
                        <button
                            className="addtocartbtn mt-2"
                            onClick={() => navigate(`/cart/${id}/${usertype}`)}
                        >
                            Go to Cart
                        </button>
                    )}
                </div>

                {/* Wishlist Button with Conditional Heart Icon */}
                <div className="text-center">
                    <button
                        className="addtocartbtn mt-2 flex gap-3 items-center"
                        onClick={() => addToWishlist(productData._id)}
                    >
                        <FontAwesomeIcon
                            icon={faHeart}
                            className={productData?.isWishlist ? "text-red-500" : "text-purple-400"}
                        />
                        <span>{productData?.isWishlist ? "In Wishlist" : "Wishlist"}</span>
                    </button>
                </div>

                {/* Buy Now Button */}
                <div className="text-center">
                    <button
                        className="addtocartbtn mt-2 flex gap-3 items-center"
                        onClick={() => handleBuyNow(productData?._id)}
                    >
                        <FontAwesomeIcon icon={faShoppingCart} className="text-purple-400" />
                        <span
                            onClick={() => {
                                navigate(`/billing/${id}/${productData._id}/${usertype}`);
                            }}
                        >
                            Buy Now
                        </span>
                    </button>
                </div>
            </div>

            {/* Show review button only if the product is ordered */}
            {productData?.isOrdered && (
                <div className="mt-4 text-start">
                    <button
                        className="addtocartbtn"
                        onClick={toggleReviewForm}
                    >
                        {showReviewForm ? "Cancel" : "Write a Review"}
                    </button>
                </div>
            )}

            {/* Review Form */}
            {showReviewForm && productData?.isOrdered && (
                <div className="add-review mt-4">
                    <h3 className="text-lg font-semibold">Add Your Review</h3>
                    <StarRatings
                        rating={rating}
                        changeRating={changeRating}
                        starRatedColor="gold"
                        numberOfStars={5}
                        starDimension="25px"
                        starSpacing="5px"
                        name="rating"
                    />
                    <textarea
                        className="w-full border p-2 rounded mt-2"
                        rows="4"
                        placeholder="Write your review here..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                        className="addtocartbtn"
                        onClick={addReview}
                    >
                        Submit Review
                    </button>
                </div>
            )}
        </div>
    </div>

    {/* Display Reviews */}
    <div className="reviews mt-8 border-b border-gray-300 pb-4">
      <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>

      {/* Container for all reviews */}
      <div className="reviews-container space-y-4">
        {/* Display reviews - Show only first 3 or all if 'showAllReviews' is true */}
        {productData?.reviews?.slice(0, showAllReviews ? productData.reviews.length : 3).map((review, index) => (
          <div
            key={index}
            className="review-card p-4 bg-white rounded-lg shadow-md border border-gray-200"
          >
            <div className="flex items-center justify-between mb-3">
              {/* Reviewer Name and Rating */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">{review.name}</span>
                <StarRatings
                  rating={review.rating}
                  starRatedColor="gold"
                  numberOfStars={5}
                  starDimension="18px"
                  starSpacing="3px"
                  name="rating"
                />
              </div>
              {/* Thumbs Up Icon with Animation */}
              <div
                className={`flex items-center gap-2 text-gray-500 cursor-pointer transform transition duration-300 ${
                  likedReviews[review._id] ? "scale-125 text-green-500" : ""
                }`}
                onClick={() => handleLikeClick(review._id)}
              >
                <FontAwesomeIcon
                  icon={faThumbsUp}
                  className={`text-sm ${likedReviews[review._id] ? "text-green-500" : "text-gray-500"}`}
                />
                <span className="text-sm">{likedReviews[review._id] ? "Liked" : "Helpful"}</span>
              </div>
            </div>

            {/* Review Comment */}
            <p className="text-gray-700 mb-2">{review.comment}</p>

            {/* Review Date */}
            <p className="text-sm text-gray-500">
              Reviewed on: {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* View More Button */}
      {productData?.reviews?.length > 3 && (
        <div className="mt-4 text-center">
          <button
            className="text-blue-500 font-semibold"
            onClick={toggleViewMore}
          >
            {showAllReviews ? "View Less" : "View More"}
          </button>
        </div>
      )}

      {/* Average Rating and Total Number of Reviews */}
      {productData?.reviews && productData.reviews.length > 0 && (
        <div className="mt-6 text-lg font-semibold">
          Average Rating: {productData.rating} ({productData.numReviews} reviews)
        </div>
      )}
    </div>

</div>


                    {/* Related Products */}
                    <div className="container text-center text-2xl font-semibold underline mt-8">
                        Related Products
                    </div>

                    {/* Grid for Related Products */}
{/* Grid for Related Products */}
<div className="grid-container mt-5 grid grid-cols-4 gap-4">
    {relatedProducts?.map((relatedProduct) => {
        const imageUrl = relatedProduct?.images[0]
            ? `http://localhost:3000/${relatedProduct.images[0]}`
            : 'fallback-image-url.jpg';

        const isInWishlist = relatedProduct?.isWishlist ? 'text-red-500' : 'text-slate-300';

        return (
            <div
                key={relatedProduct?._id}
                className="flex flex-col shadow-md p-4 bg-light rounded cursor-pointer relative overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                onClick={() => singleProduct(relatedProduct._id, relatedProduct.category)}
            >
                {id && id !== "undefined" && (
                    <div
                        className="position-relative"
                        onClick={(e) => {
                            e.stopPropagation();
                            addToWishlist(relatedProduct._id);
                        }}
                    >
                        <span
                            id={`wishlistheart-${relatedProduct._id}`}
                            className="absolute top-1 left-2 z-10 wishlistheart1"
                        >
                            <i
                                className={`fa fa-heart text-lg ${isInWishlist}`}
                                aria-hidden="true"
                            ></i>
                        </span>
                    </div>
                )}

                <img
                    src={imageUrl}
                    className="w-full mx-auto h-[100px] object-cover md:h-[250px] lg:h-[300px]"
                    alt="Related Product"
                    onClick={(e) => {
                        e.stopPropagation();
                        singleProduct(relatedProduct._id, relatedProduct.category);
                    }}
                />

                <div className="mt-4">
                    <div className="text-sm text-gray-800 truncate">
                        {relatedProduct?.name}
                    </div>
                    <div className="mt-1 text-lg font-bold text-black">
                        Offer: ₹{relatedProduct?.discountPrice}
                    </div>
                    <div className="text-md text-gray-600 line-through">
                        Price: ₹{relatedProduct?.price}
                    </div>
                    <div className="mt-1 text-sm text-gray-500 font-bold">
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
