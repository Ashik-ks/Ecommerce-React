import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import purpleLogo from "../../assets/images/purpplelogo.png";
import purplejoinElite from "../../assets/images/purplejoinElite.png.gif";

function AdminListing() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [sellerDetails, setSellerDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAll, setShowAll] = useState({
        cartProducts: false,
        orderProducts: false,
        wishlistProducts: false,
        sellerProducts: false,
    }); // Separate showAll state for each category
    const navigate = useNavigate();
    const { id, usertype, state, buyerid } = useParams();

    const token = localStorage.getItem(id);

    const handleSidebarToggle = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleCloseSidebar = () => {
        setSidebarOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    useEffect(() => {
        if (state === "Buyers") {
            const fetchBuyerDetails = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/buyerdetails/${buyerid}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (response.data.success) {
                        setSellerDetails(response.data.data);
                    } else {
                        setError(response.data.message);
                    }
                } catch (err) {
                    console.error("Error fetching buyer details:", err);
                    setError("Failed to fetch buyer details");
                } finally {
                    setLoading(false);
                }
            };
            fetchBuyerDetails();
        }

        // Handle fetching seller details if the state is "Sellers"
        if (state === 'Sellers') {
            const fetchSellerDetails = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/sellerdetails/${buyerid}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (response.data.success) {
                        setSellerDetails(response.data.data);
                    } else {
                        setError(response.data.message);
                    }
                } catch (err) {
                    console.error("Error fetching seller details:", err);
                    setError("Failed to fetch seller details");
                } finally {
                    setLoading(false);
                }
            };

            fetchSellerDetails();
        }
    }, [buyerid, token, state]);

    const toggleShowAll = (category) => {
        setShowAll((prevState) => ({
            ...prevState,
            [category]: !prevState[category], // Toggle showAll state for the specific category
        }));
    };

    const renderProductCards = (products, title, category) => {
        if (products && products.length > 0) {
            return (
                <div className="product-cards-container mt-4">
                    <div className="text-center">
                        <h3 className="text-lg font-bold mb-3">{title}</h3>
                        <button
                            className="text-blue-500 text-lg rounded-lg mt-2"
                            onClick={() => toggleShowAll(category)} // Pass the category to toggle state
                        >
                            {showAll[category] ? "Show Less" : "View All"}
                        </button>
                        <i className="fa-solid fa-arrow-right ms-2 text-blue-500"></i>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
                        {products.slice(0, showAll[category] ? products.length : 5).map((product, index) => (
                            <div key={index} className="product-card-container w-full">
                                <div className="product-card border p-4 rounded bg-white shadow-lg hover:shadow-xl transition-shadow duration-300" onClick={(event) => {
                    event.preventDefault();
                    navigate(`/adminsingleviewpage/${id}/${usertype}/${product._id}`);
                }}>
                                    <div className="image-container mb-4">
                                        {product?.images?.[0] ? (
                                            <img
                                                alt={`Product ${product.name}`}
                                                src={`http://localhost:3000/${product.images[0]}`}
                                                className="w-full h-64 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <span className="text-gray-500">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="text-lg font-semibold">{product.name.slice(0, 15)}
                                        {product.name.length > 30 ? "..." : ""}</h4>
                                    <p className="text-gray-600 text-base mt-1">${product.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="dashboard-wrapper" style={{ display: "flex", flexDirection: "row", height: "100vh", overflow: "hidden" }}>
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
                        <a href="#" className="nav-link d-flex items-center py-2 gap-2 hover:bg-gray-700 px-2">
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

            <div className="dashboard-container bg-slate-50 p-4 flex-1 flex flex-col overflow-y-auto">
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    sellerDetails && (
                        <div>
                            {renderProductCards(sellerDetails.sellerProducts, `${sellerDetails.user.email} selling Products`, "sellerProducts")}
                            {renderProductCards(sellerDetails.orderProducts, `${sellerDetails.user.email}'s Products in Orders`, "orderProducts")}
                            {renderProductCards(sellerDetails.cartProducts, `${sellerDetails.user.email}'s Products in Cart`, "cartProducts")}
                            {renderProductCards(sellerDetails.wishlistProducts, `${sellerDetails.user.email}'s Products in Wishlist`, "wishlistProducts")}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default AdminListing;
