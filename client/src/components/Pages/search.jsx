import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import InnerPagesNav from "../nav/innerpagesnav";
import Footer from "../footer/footer";
import AddToWishlist from "../functions/addtowishlist";
import categorybanner1 from "../../assets/images/categorybanner1.webp";
import categorybanner2 from "../../assets/images/categorybanner2.webp";
import lipbalmbanner from "../../assets/images/lipbalmbanner.webp";
import hairspraybanner from "../../assets/images/hairspraybanner.webp";
import bathandboybanner from "../../assets/images/bathand body banner.webp";
import {toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SearchPage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [searchProduct, setSearchProduct] = useState(null);
    const [searchProductItems, setSearchProductItems] = useState([]);
    const [searchProductCategories, setSearchProductCategories] = useState([]);
    const displayedIds = new Set(); // Track displayed IDs to prevent duplicates
    const [showAll, setShowAll] = useState(false);


    const images = [lipbalmbanner, hairspraybanner, bathandboybanner];
    const navigate = useNavigate();
    const { item, id, usertype } = useParams();

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    }, []);

    const fetchSearchProducts = async () => {
        try {
            const response = await fetch(`http://localhost:3000/searchproducts/${item}/${id}`);
            const parsedResponse = await response.json();
            console.log("parsed_response:", parsedResponse);

            // Set state with fetched data
            setSearchProduct(parsedResponse.product.searchproduct);
            setSearchProductItems(parsedResponse.product.searchproductitem);
            setSearchProductCategories(parsedResponse.product.searchproductcategory);
        } catch (error) {
            console.error("Error fetching search products:", error);
        }
    };

    useEffect(() => {
        fetchSearchProducts();
    }, [item, id]);

    const renderUniqueItems = (items) => {
        const itemsToShow = showAll ? items : items.slice(0, 4);
        return items
            .filter((item) => {
                // If the item's _id has already been displayed or it's the main product, skip it
                if (displayedIds.has(item._id) || item._id === searchProduct?._id) return false;
                displayedIds.add(item._id); // Mark item as displayed
                console.log("Displayed IDs:", Array.from(displayedIds));
                return true;
            })
            .map((item) => (
                <div key={item._id} className="bg-white shadow-md rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                    {/* Product Image and Heart Icon */}
                    <div className="relative cursor-pointer" onClick={() => singleProduct(item._id, item.category)}>
                        {/* Conditionally render heart icon only if `id` exists in params */}
                        {id && id !== "undefined" && (
                            <span
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent event from bubbling up to the image click handler
                                    addToWishlist(item._id); // Add/remove from wishlist based on current state
                                }}
                                id={`wishlistheart-${item._id}`}
                                className="wishlistheart"
                                style={{
                                    position: 'absolute',
                                    top: '12px',  // Adjusted for visibility
                                    zIndex: 10,
                                }}
                            >
                                {/* Red heart if in wishlist, black heart if not */}
                                <i
                                    className={`fa fa-heart fs-5 ${item.isInWishlist ? 'text-danger' : 'text-slate-300'}`} // Red if in wishlist, black if not
                                    aria-hidden="true"
                                ></i>
                            </span>
                        )}
    
                        {/* Product Image */}
                        <img
                            src={`http://localhost:3000/${item.images && item.images[0] ? item.images[0] : 'fallback-image-url.jpg'}`}
                            alt={item.name || 'Fallback Image Description'}  // Fallback alt text if item.name is missing
                            className="w-full h-[100px] md:h-[250px] lg:h-[300px] object-cover mx-auto"
                        />
                    </div>
    
                    {/* Product Details */}
                    <div className="p-4">
                        <h3 className="font-semibold text-lg text-gray-800 truncate">{item.name}</h3>
                        <div className="flex justify-start items-center gap-3 mt-2">
                            <span className="text-lg font-bold text-black">Offer: ₹{item.discountPrice}</span>
                            <span className="text-md text-gray-600 line-through">₹{item.price}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">{item.stockStatus}</div>
                    </div>
    
                    {/* Uncomment if you want to add the Add to Cart button */}
                    {/* <div className="bg-white text-center pb-2">
                        <button className="addtocartbtn mt-2" onClick={() => addToCart(item._id)}>
                            Add to Cart
                        </button>
                    </div> */}
                </div>
            ));
    };
    
    

    const singleProduct = (productId, category) => {
        // Handle navigation or action for a single product
        navigate(`/singleview/${productId}/${id}/${category}/${usertype}`);
    };

    let token = localStorage.getItem(id)

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

            {/* Carousel Section */}
            <div className="max-w-screen-xl mx-auto mt-5 mb-5">
                <div className="relative mx-auto">
                    <div className="w-full overflow-hidden relative">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{
                                transform: `translateX(-${currentIndex * 100}%)`,
                            }}
                        >
                            {images.map((image, index) => (
                                <div key={index} className="w-full flex-shrink-0">
                                    <img
                                        src={`http://localhost:3000/${image}`}
                                        className="d-block w-full object-cover"
                                        alt={`Banner ${index + 1}`}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Carousel Buttons */}
                        <button
                            className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10 p-3 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full"
                            onClick={prevSlide}
                        >
                            <ChevronLeftIcon className="w-6 h-6 text-white" />
                        </button>
                        <button
                            className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10 p-3 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full"
                            onClick={nextSlide}
                        >
                            <ChevronRightIcon className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div className="container max-w-screen-xl px-4 py-6 mx-auto">
    <div className="grid-container">
        {/* Render the main product only if it hasn't been displayed yet */}
        {searchProduct && !displayedIds.has(searchProduct._id) && (
            <div
                key={searchProduct._id}
                className="bg-white shadow-md rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            >
                <div className="relative" onClick={() => singleProduct(searchProduct._id, searchProduct.category)}>
                    {/* Conditionally render Wishlist heart icon only if `id` exists */}
                    {id && id !== "undefined" && (
                        <span
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent event from bubbling up to the image click handler
                                addToWishlist(searchProduct._id); // Add/remove from wishlist based on current state
                            }}
                            id={`wishlistheart-${searchProduct._id}`}
                            className="wishlistheart"
                            style={{
                                position: "absolute",
                                top: "3px",
                                left: "10px",
                                zIndex: 10,
                            }}
                        >
                            <i
                                className={`fa fa-heart fs-5 ${
                                    searchProduct.isInWishlist ? "text-danger" : "text-slate-300"
                                }`} // Red if in wishlist, black if not
                                aria-hidden="true"
                            ></i>
                        </span>
                    )}

                    {/* Product Image */}
                    <img
                        src={`http://localhost:3000/${
                            searchProduct.images && searchProduct.images[0]
                                ? searchProduct.images[0]
                                : "fallback-image-url.jpg"
                        }`}
                        alt={searchProduct.name || "Fallback Image Description"} // Add fallback alt text
                        className="w-full h-[100px] md:h-[250px] lg:h-[300px] object-cover mx-auto"
                    />
                </div>

                {/* Product Details */}
                <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 truncate">{searchProduct.name}</h3>
                    <div className="flex justify-start items-center gap-3 mt-2">
                        <span className="text-lg font-bold text-black">Offer: ₹{searchProduct.discountPrice}</span>
                        <span className="text-md text-gray-600 line-through">₹{searchProduct.price}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">{searchProduct.stockStatus}</div>
                </div>

                {/* Uncomment this block if you want to enable Add to Cart */}
                {/* <div className="bg-white text-center pb-2">
                    <button className="addtocartbtn mt-2" onClick={() => addToCart(searchProduct._id)}>
                        Add to Cart
                    </button>
                </div> */}
            </div>
        )}

        {/* Render Unique Product Items */}
        {renderUniqueItems(searchProductItems)}
    </div>
</div>


            {/* Category Banners */}
            <div className="container max-w-screen-xl mx-auto">
                <div className="flex flex-wrap">
                    <div className="w-full sm:w-1/2 p-2">
                        <img
                            src={categorybanner1}
                            alt="Category Banner 1"
                            className="w-full h-auto rounded-lg"
                        />
                    </div>
                    <div className="w-full sm:w-1/2 p-2">
                        <img
                            src={categorybanner2}
                            alt="Category Banner 2"
                            className="w-full h-auto rounded-lg"
                        />
                    </div>
                </div>
            </div>

            <div className="container max-w-screen-xl px-4 py-6 mx-auto">
                <div className="text-center text-2xl font-bold mb-5">
                    {searchProduct?.category?.name && (
                        <>
                            <p className="text-3xl text-gray-600 mt-7">
                                {searchProduct.category.name}
                            </p>
                            <div className="text-center mt-1 text-blue-500">
    <span className="mb-5 text-lg cursor-pointer" onClick={() => setShowAll(!showAll)}>
        {showAll ? "Show Less" : "View All"}
    </span>
    <i className="fa-solid fa-arrow-right text-lg"></i>
</div>

                        </>
                    )}
                </div>
            </div>


            {/* Category Section */}
            <div className="max-w-screen-xl mx-auto p-4">
                <div
                    id="datacontainersearchcategory"
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-5"
                >
                    {renderUniqueItems(searchProductCategories)}
                </div>
            </div>

            <Footer />
        </>
    );
}

export default SearchPage;
