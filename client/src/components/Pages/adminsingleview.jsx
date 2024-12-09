import React, { useState, useEffect, useRef } from "react";
import Footer from "../footer/footer";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import purpleLogo from "../../assets/images/purpplelogo.png";
import purplejoinElite from "../../assets/images/purplejoinElite.png.gif";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import AddToCart from "../functions/addtocart";
import {toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminSingleView() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [productData, setProductData] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [sellerData, setsellerData] = useState(null);
    const [categoryProducts, setcategoryProducts] = useState([]);
    const [zoomedImage, setZoomedImage] = useState(null);
    const [userOrderDetails, setUserOrderDetails] = useState([]); // State to store user order details
    const zoomedImgRef = useRef(null);

    const navigate = useNavigate();
    const { pid } = useParams();
    const { id } = useParams();
    let { usertype } = useParams();


    const getProductOrderDetails = async () => {
        let token = localStorage.getItem(id)
        try {
           const response = await axios.get(`http://localhost:3000/productorders/${pid}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Send the token in the Authorization header
                },
            });
    
            const data = response.data;
            console.log("Product Order Details:", data);
    
            setProductData(data.data.product);  // Set product details
            setUserOrderDetails(data.data.userOrderDetails);  // Set order details of users who bought the product
        } catch (error) {
            console.error('Error fetching product order details:', error);
        }
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
            getProductOrderDetails();  // Fetch order details after getting product details
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    useEffect(() => {
        getSingleProduct();
        getProductOrderDetails()
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



    const handleSidebarToggle = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleCloseSidebar = () => {
        setSidebarOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/"; // Redirect to login
    };

    return (
        <>
        <div className="dashboard-wrapper" style={{ display: "flex", height: "100vh" }}>

    <div>
        <button
            onClick={handleSidebarToggle}
            className="md:hidden p-4 text-white bg-gray-800"
        >
            <i className="fas fa-bars"></i>
        </button>

        <div
            className={`sidebar p-4 bg-gray-800 text-white w-full md:w-64 flex-none fixed inset-0 md:relative transform transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            style={{ height: '100vh' }} // Keep the sidebar height as full
        >
            {/* Close Button (only visible on small screens) */}
            <button
                className="absolute top-4 right-4 text-white md:hidden" // Show only on small screens
                onClick={handleCloseSidebar}
            >
                <i className="fas fa-times"></i>
            </button>

            <div className="flex align-items-center gap-3 mb-4 ms-3">
                <img src={purpleLogo} alt="Purple Logo" className="purpplelogo1" />
                <img src={purplejoinElite} alt="Purple Logo" className="PurpleLogoeliteadmin" />
            </div>

            <nav className="nav flex flex-col space-y-4">
                {/* Sidebar links */}
                <a
                    className="dashboard nav-link active d-flex items-center py-2 gap-2 hover:bg-gray-700 px-2"
                    onClick={(event) => {
                        event.preventDefault();
                        navigate(`/admin/${id}/${usertype}`);
                    }}
                >
                    <i className="fas fa-home"></i>
                    <span className="ml-2">Dashboard</span>
                </a>
                <a
                    href="#"
                    className="nav-link d-flex items-center py-2 gap-2 hover:bg-gray-700 px-2"
                    onClick={(event) => {
                        event.preventDefault();
                        navigate(`/adminviewpage/${id}/${usertype}/Buyers`);
                    }}
                >
                    <i className="fas fa-users"></i>
                    <span className="ml-2">Buyers</span>
                </a>
                <a
                    href="#"
                    className="nav-link d-flex items-center py-2 gap-2 hover:bg-gray-700 px-2"
                    onClick={(event) => {
                        event.preventDefault();
                        navigate(`/adminviewpage/${id}/${usertype}/Sellers`);
                    }}
                >
                    <i className="fas fa-folder"></i>
                    <span className="ml-2">Sellers</span>
                </a>
                <a href="#" className="nav-link d-flex items-center py-2 gap-2 hover:bg-gray-700 px-2" onClick={(event) => {
          event.preventDefault();
          navigate(`/adminviewpage/${id}/${usertype}/orders`);
        }}>
          <i className="fas fa-calendar-alt"></i>
          <span className="ml-2">Orders</span>
        </a>
                <a
                    href="#"
                    className="nav-link d-flex items-center py-2 gap-2 hover:bg-gray-700 px-2"
                    onClick={(event) => {
                        event.preventDefault();
                        navigate(`/adminviewpage/${id}/${usertype}/Products`);
                    }}
                >
                    <i className="fas fa-chart-pie"></i>
                    <span className="ml-2">Products</span>
                </a>
                <a href="#" className="nav-link d-flex items-center py-2 gap-2 hover:bg-gray-700 px-2">
                    <i className="fas fa-file-alt"></i>
                    <span className="ml-2">Emails</span>
                </a>
                <a href="#" className="nav-link d-flex items-center py-2 gap-2 hover:bg-gray-700 px-2">
                    <i className="fas fa-cog"></i>
                    <button className="ml-2 border-0 bg-transparent text-light" onClick={handleLogout}>
                        Logout
                    </button>
                </a>
            </nav>
        </div>
    </div>

    {/* Data Container */}
    <div className="dataContainer flex-1 border-b border-gray-300 bg-slate-100 pt-2 pb-2">
    <div className="max-w-screen-xl mx-auto">
        <div className="imgcontainer ms-5">
            {/* Category Breadcrumb */}
            <div className="pt-2" id="categorydiv">
                <div className="categoryText text-gray-600">
                    HOME &gt; {categoryProducts || 'Unknown'} &gt;{' '}
                    {productData?.subcategory || 'Unknown'} &gt;{' '}
                    {productData?.item || 'Unknown'} &gt;{' '}
                    {productData?.name || 'Unknown'}
                </div>
            </div>

            {/* Product Details */}
            <div id="" className="mt-3 bg-white p-2">
    <div className="flex flex-col md:flex-row gap-4">
        {/* Left Side Images */}
        <div className="w-full md:w-[10%]">
    <div className="flex flex-wrap gap-2" id="imageunzoom">
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
        <div className="w-full md:w-[30%]">
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
        <div className="w-full md:w-[60%] pt-2 ps-5">
            <h1 className="text-lg font-semibold mb-1 description">{productData?.description}</h1>
            <div className="flex flex-col mt-2">
                <span className="mb-1">Price ₹{productData?.price}</span>
                <span className="text-green-600 font-bold mb-1">
                    Discount Price ₹{productData?.discountPrice}
                </span>
                <span className="font-semibold text-green-600 mb-2">{productData?.weight} gm</span>
                <span className="font-semibold text-black mb-2">stockStatus: {productData?.stockStatus}</span>
                <span className="font-semibold text-black mb-2">productStatus: {productData?.productStatus}</span>
                <span className="font-semibold text-black mb-2">stockQuantity: {productData?.stockQuantity}</span>
            </div>
            <div className="mt-1 mb-1">Inclusive of all taxes</div>
            <span className="text-sm font-semibold mt-1">Seller: {sellerData}</span>
        </div>
    </div>
</div>


            {/* Order Details */}
            <div className="order-details mt-6">
                <h2 className="text-lg font-semibold mb-2 ms-4 underline">Order Details</h2>
                {userOrderDetails.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full shadow-md">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 text-left">Order ID</th>
                                    <th className="py-2 px-4 text-left">Customer Name</th>
                                    <th className="py-2 px-4 text-left">Quantity</th>
                                    <th className="py-2 px-4 text-left">Total Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userOrderDetails.map((user, index) =>
                                    user.orders.map((order, orderIndex) => (
                                        <tr key={`${index}-${orderIndex}`}>
                                            <td className="py-2 px-4 text-left">{order.orderId}</td>
                                            <td className="py-2 px-4 text-left">{user.email}</td>
                                            <td className="py-2 px-4 text-left">{order.quantity}</td>
                                            <td className="py-2 px-4 text-left">₹{order.totalPrice}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No orders found for this product.</p>
                )}
            </div>
        </div>
    </div>
</div>

</div>

        </>
    );
}

export default AdminSingleView;
