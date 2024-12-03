import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import NavOne from "../nav/navOne";
import HeaderComponent from "../nav/navSecond";
import NavThird from "../nav/navThird";
import { useCount } from '../CountContext';
import Footer from "../footer/footer";
import AddToWishlist from "../functions/addtowishlist";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid"; // Import arrow icons
import categorybanner1 from "../../assets/images/categorybanner1.webp";
import categorybanner2 from "../../assets/images/categorybanner2.webp";
import lipbalmbanner from "../../assets/images/lipbalmbanner.webp";
import hairspraybanner from "../../assets/images/hairspraybanner.webp";
import bathandboybanner from "../../assets/images/bathand body banner.webp";

function Category() {
    const { count } = useCount();
    const { item, id } = useParams();
    let { usertype } = useParams();
    const [itemData, setItemData] = useState(null);
    const [data, setData] = useState([]);
    const [data1, setData1] = useState(null);
    const [data2, setData2] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    const images = [lipbalmbanner, hairspraybanner, bathandboybanner];
    // Memoize addToCart function
    const addToCart = useCallback((itemId) => {
        console.log(`Adding item ${itemId} to the cart`);
    }, []);

    // Memoize nextSlide and prevSlide functions
    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    }, []);

    const fetchData = useCallback(async () => {
        try {
            if (item) {
                const decodedItem = JSON.parse(decodeURIComponent(item));
                setItemData(decodedItem);
                const itemId = decodedItem._id;
                const categoryuserid = id || null; // Pass `null` for undefined user

                const categoryResponse = await fetch(
                    `http://localhost:3000/fetchcategory/${itemId}/${categoryuserid}`
                );
                const categoryData = await categoryResponse.json();
                setData(categoryData.data.products);
                setData2(categoryData.data.itemId);

                const itemResponse = await fetch(
                    `http://localhost:3000/fetchitem/${itemId}/${categoryuserid}`
                );
                const itemData = await itemResponse.json();
                setData1(itemData.data.products1);
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err);
            setLoading(false);
        }
    }, [item, id]);


    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;


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
            <NavOne />
            <HeaderComponent count={count} />
            <NavThird />

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

            {/* Featured Category Section */}
            <div className="container text-center text-2xl font-bold mt-5 underline">Featured</div>



{/* First Section: Display the first dataset (data1) */}
<div className="max-w-screen-xl mx-auto mt-7 mb-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data1 && data1.length > 0 ? (
            data1.map((item) => {
                const imageUrl = item.images && item.images.length > 0 ? item.images[0] : 'fallback-image-url.jpg';

                return (
                    <div 
                        key={item._id} 
                        className="product-card bg-white shadow-md rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                    >
                        <div className="relative" onClick={() => singleProduct(item._id, item.category)}>
                            {/* Conditionally Render Wishlist Heart */}
                            {id && id !== "undefined" && ( // Ensure `id` exists and is valid
                                <span
                                    id={`wishlistheart-${item._id}`}
                                    className="wishlistheart"
                                    style={{
                                        position: 'absolute',
                                        top: '-6px',
                                        left: '10px',
                                        zIndex: 10, // Ensure the heart is above the image
                                    }}
                                >
                                    {/* Display red heart if in wishlist, black heart if not */}
                                    <i
                                        className={`fa fa-heart fs-5 ${item.isInWishlist ? 'text-danger' : 'text-slate-300'}`}
                                        aria-hidden="true"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent bubbling
                                            addToWishlist(item._id); // Add or remove from wishlist
                                        }}
                                    ></i>
                                </span>
                            )}

                            {/* Product Image */}
                            <img
                                src={`http://localhost:3000/${imageUrl}`}  // Replace `imageUrl` with the actual URL
                                alt={item.name}  // Alt text for the image (using item.name for better accessibility)
                                className="w-full h-[100px] md:h-[250px] lg:h-[300px] object-cover rounded" // Fixed height, responsive breakpoints, object-cover, and rounded corners
                            />
                        </div>

                        <div className="">
                            <h3 className="font-semibold text-lg text-gray-800 truncate">{item.name}</h3>
                            <div className="flex justify-start items-center gap-3 mt-2">
                                <span className="text-lg font-bold text-black">Offer: ₹{item.discountPrice}</span>
                                <span className="text-md text-gray-600 line-through">₹{item.price}</span>
                            </div>
                            <div className="mt-2 text-sm text-gray-500">{item.stockStatus}</div>

                        </div>
                    </div>
                );
            })
        ) : (
            <div className="col-span-full text-center text-gray-500">No products available</div>
        )}
    </div>
</div>



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

            <div className="container max-w-screen-xl mx-auto mb-7">
                <div className="text-center text-2xl font-bold mb-5">
                    {data && data.length > 0 && (
                        <>
                            <div className="text-center text-3xl font-bold mt-5">{data2}</div>
                            <div className="text-center mt-3 text-blue-500">
                                <span className="mb-5">View All </span>
                                <i className="fa-solid fa-arrow-right"></i>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Second Section: Display the second dataset (data) */}
            <div className="max-w-screen-xl mx-auto p-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data && data.length > 0 ? (
            data.map((item) => (
                <div
                    key={item._id}
                    className="product-card bg-white shadow-md rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                >
                    {/* Product Image with Wishlist Heart Icon */}
                    <div className="relative cursor-pointer" onClick={() => singleProduct(item._id, item.category)}>
                        {/* Conditionally render Wishlist heart icon only if `id` exists */}
                        {id && id !== "undefined" && (
                            <span
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent event from bubbling up to the image click handler
                                    addToWishlist(item._id); // Add/remove from wishlist based on current state
                                }}
                                id={`wishlistheart-${item._id}`}
                                className="wishlistheart"
                                style={{
                                    position: "absolute",
                                    top: "-12px",
                                    left: "10px",
                                    zIndex: 10,
                                }}
                            >
                                <i
                                    className={`fa fa-heart fs-5 ${item.isInWishlist ? 'text-danger' : 'text-slate-300'}`} // Red if in wishlist, black if not
                                    aria-hidden="true"
                                ></i>
                            </span>
                        )}

                        {/* Product Image */}
                        <img
                            src={`http://localhost:3000/${
                                item.images && item.images[0] ? item.images[0] : "fallback-image-url.jpg"
                            }`}
                            alt={item.name || "Fallback Image Description"}
                            className="w-full h-[100px] md:h-[250px] lg:h-[300px] object-cover mx-auto"
                        />
                    </div>

                    {/* Product Details */}
                    <div className="p-4">
                        <h3 className="font-semibold text-lg text-gray-800 truncate">
                            {item.name}
                        </h3>
                        <div className="flex justify-start items-center gap-3 mt-2">
                            <span className="text-lg font-bold text-black">
                                Offer: ₹{item.discountPrice}
                            </span>
                            <span className="text-md text-gray-600 line-through">
                                ₹{item.price}
                            </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                            {item.stockStatus}
                        </div>
                    </div>

                    {/* Uncomment if you want to add the Add to Cart button */}
                    {/* <div className="bg-white text-center pb-2">
                        <button
                            className="addtocartbtn mt-2 hover:bg-gray-100 transition-colors duration-200"
                            onClick={() => addToCart(item._id)}
                        >
                            Add to Cart
                        </button>
                    </div> */}
                </div>
            ))
        ) : (
            <div className="col-span-full text-center text-gray-500">
                No products available
            </div>
        )}
    </div>
</div>




            <Footer />
        </>
    );
}

export default Category;
