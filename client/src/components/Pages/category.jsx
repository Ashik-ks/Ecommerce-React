import React, { useState, useEffect, useCallback } from "react";
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
    const { usertype } = useParams();
    const [itemData, setItemData] = useState(null);
    const [data, setData] = useState([]);
    const [data1, setData1] = useState(null);
    const [data2, setData2] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAll, setShowAll] = useState(false); // State for toggling between show all or first 4 products
    const navigate = useNavigate();

    const images = [lipbalmbanner, hairspraybanner, bathandboybanner];

    const addToCart = useCallback((itemId) => {
        console.log(`Adding item ${itemId} to the cart`);
    }, []);

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
                const categoryuserid = id || null;

                const categoryResponse = await fetch(`http://localhost:3000/fetchcategory/${itemId}/${categoryuserid}`);
                const categoryData = await categoryResponse.json();
                setData(categoryData.data.products);
                setData2(categoryData.data.itemId);

                const itemResponse = await fetch(`http://localhost:3000/fetchitem/${itemId}/${categoryuserid}`);
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
        navigate(`/singleview/${productId}/${id}/${category}/${usertype}`);
    };

    const addToWishlist = async (productId) => {
        try {
            let token = localStorage.getItem(id);
            await AddToWishlist(productId, id, token);
        } catch (error) {
            console.error("Error adding to wishlist:", error);
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
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
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
            <div className="container text-center text-3xl font-bold mt-5 underline text-purple-500">Featured</div>

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
                                        {/* Wishlist Heart */}
                                        {id && id !== "undefined" && (
                                            <span
                                                id={`wishlistheart-${item._id}`}
                                                className="wishlistheart"
                                                style={{
                                                    position: 'absolute',
                                                    top: '-6px',
                                                    left: '10px',
                                                    zIndex: 10,
                                                }}
                                            >
                                                <i
                                                    className={`fa fa-heart fs-5 ${item.isInWishlist ? 'text-danger' : 'text-slate-300'}`}
                                                    aria-hidden="true"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addToWishlist(item._id);
                                                    }}
                                                ></i>
                                            </span>
                                        )}

                                        {/* Product Image */}
                                        <img
                                            src={`http://localhost:3000/${imageUrl}`}
                                            alt={item.name}
                                            className="w-full h-[100px] md:h-[250px] lg:h-[300px] object-cover rounded"
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

            {/* "View All" Button to toggle products */}
            <div className="text-center mb-4">
                {data && data.length > 0 && (
                    <>
                        {/* Display the category name or any other relevant data */}
                        <div className="text-center text-purple-500 text-3xl font-bold mt-5">{data2}</div>

                        {/* Button to toggle between "Show All" and "Show Less" */}
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="cursor-pointer text-xl text-black font-bold mt-2"
                        >
                            {showAll ? "Show Less" : "View All"}
                        </button>
                        <i className="fa-solid fa-arrow-right ms-1"></i>
                    </>
                )}
            </div>


            {/* Second Section: Display the second dataset (data) */}
            <div className="max-w-screen-xl mx-auto p-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {(showAll ? data : data.slice(0, 4)).map((item) => {
                        const imageUrl = item.images && item.images.length > 0 ? item.images[0] : 'fallback-image-url.jpg';
                        return (
                            <div
                                key={item._id}
                                className="product-card bg-white shadow-md rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                            >
                                <div className="relative" onClick={() => singleProduct(item._id, item.category)}>
                                    <img
                                        src={`http://localhost:3000/${imageUrl}`}
                                        alt={item.name}
                                        className="w-full h-[100px] md:h-[250px] lg:h-[300px] object-cover rounded"
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
                    })}
                </div>
            </div>

            <Footer />
        </>
    );
}

export default Category;
