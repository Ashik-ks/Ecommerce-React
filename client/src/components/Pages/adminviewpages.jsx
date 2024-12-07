import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import purpleLogo from "../../assets/images/purpplelogo.png";
import purplejoinElite from "../../assets/images/purplejoinElite.png.gif";
import { BlockorUnblock } from "../functions/block";

function AdminViewpage() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [buyers, setBuyers] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filteredBuyers, setFilteredBuyers] = useState([]);
    const [filteredSellers, setFilteredSellers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [blockId, setBlockId] = useState(null); // State to hold ID of blocked item
    const [description, setDescription] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();
    const { id, usertype, state } = useParams();

    let token = localStorage.getItem(id);

    useEffect(() => {
        console.log("Fetching data for state:", state, "ID:", id);

        if (state === "Buyers") {
            fetchBuyers();
        } else if (state === "Sellers") {
            fetchSellers();
        } else if (state === "Products") {
            fetchProducts();

        }
        else if (state === "orders") {
            fetchOrders();
        }
    }, [state, id]);

    const fetchBuyers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/buyers`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setBuyers(response.data.data);
                setFilteredBuyers(response.data.data);
            } else {
                console.error("Error fetching buyers:", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching buyers:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSellers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/sellers`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setSellers(response.data.data);
                setFilteredSellers(response.data.data);
            } else {
                console.error("Error fetching sellers:", response.data.message);
                setError(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching sellers:", error);
            setError("An error occurred while fetching sellers.");
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/productsall`);
            if (response.data.success && Array.isArray(response.data.responseProducts)) {
                setProducts(response.data.responseProducts);
                setFilteredProducts(response.data.responseProducts);
            } else {
                setProducts([]);
                console.log("No products found or response is not valid.");
            }
        } catch (error) {
            setError('Error fetching products: ' + error.message);
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/allorders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data;
            console.log("Fetched Orders Data: ", data);

            if (data.success) {
                const allOrders = data.data;
                setOrders(allOrders);
            } else {
                setError(data.message || 'Failed to fetch orders');
            }
        } catch (err) {
            setError('An error occurred while fetching orders.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };


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

    const handleBlockButtonClick = (id) => {
        setBlockId(id); // Set the ID of the item being blocked
    };

    const blockProduct = async (pid) => {
        await BlockorUnblock(pid, setStatusMessage, setErrorMessage, id,description);
        fetchProducts();
    };


    // Search Filter
    const handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();

        if (state === "Products") {
            const filteredData = products.filter((product) =>
                product.name.toLowerCase().includes(searchTerm)
            );
            setFilteredProducts(filteredData);
        } else if (state === "Buyers") {
            const filteredData = buyers.filter((buyer) =>
                buyer.email.toLowerCase().includes(searchTerm)
            );
            setFilteredBuyers(filteredData);
        } else if (state === "Sellers") {
            const filteredData = sellers.filter((seller) =>
                seller.email.toLowerCase().includes(searchTerm)
            );
            setFilteredSellers(filteredData);
        }
    };

    return (
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

            <div
                className="dashboard-container bg-slate-50 p-4 flex-1 flex flex-col"
                style={{
                    flexGrow: 1,
                    overflowY: "auto",
                    paddingLeft: "2rem",
                    paddingRight: "2rem"
                }}
            >
                <div style={{ display: "flex", lineHeight: "28px", alignItems: "center", position: "relative", width: "50%" }}>
                    <svg
                        style={{
                            position: "absolute",
                            left: "1rem",
                            fill: "#9e9ea7",
                            width: "1rem",
                            height: "1rem"
                        }}
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                    >
                        <g>
                            <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9S2 6.03 2 11s4.03 9 9 9c2.158 0 4.167-.922 5.685-2.465l3.654 3.654a.75.75 0 001.061-1.061zM11 16a5 5 0 110-10 5 5 0 010 10z"></path>
                        </g>
                    </svg>
                    <input
                        className="search-bar w-full pl-10 pr-4 py-2 rounded-md bg-slate-200 text-gray-800"
                        type="search"
                        placeholder="Search"
                        onChange={handleSearch}
                    />
                </div>

                {/* Conditional Rendering for Products, Buyers, Sellers, or Orders */}
                {state === "Products" ? (
                    filteredProducts.length > 0 ? (
                        <div className="grid-container">
                            {filteredProducts.map((product) => (
                                <div key={product._id} className="product-card" >
                                    <div>
                                        <img
                                            src={`http://localhost:3000/${product.images ? product.images[0] : 'fallback-image-url.jpg'}`}
                                            className="w-full mx-auto h-[100px] object-cover md:h-[250px] lg:h-[300px] rounded-md"
                                            alt="Product" onClick={(event) => {
                                                event.preventDefault();
                                                navigate(`/adminsingleviewpage/${id}/${usertype}/${product._id}`);
                                            }}
                                        />
                                    </div>
                                    <button className="border-0">
                                        <div className="d-flex justify-content-start">
                                            <span className="fs-6 text-gray-800">
                                                {product.name.slice(0, 20)}
                                                {product.name.length > 30 ? "..." : ""}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <div className="text-gray-800 text-sm">
                                                <p>Price: {product.price}</p>
                                                <p className="text-green-500">{product.stockStatus}</p>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        className={`adminbtn ${product.productStatus === "UnBlock" ? "hover:bg-red-500" : "hover:bg-blue-500"}`}
                                        onClick={(event) => {
                                            event.stopPropagation(); // Prevent parent onClick from firing
                                            handleBlockButtonClick(product._id);
                                        }}
                                    >
                                        {product.productStatus === "UnBlock" ? "Block" : "UnBlock"}
                                    </button>
                                    {/* Description Input when Block Button is clicked */}
                                    {blockId === product._id && (
                                        <div className="block-description">
                                            <textarea
                                                placeholder="Enter reason for blocking"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className="w-full mt-2 p-2 border border-gray-300 rounded"
                                            />
                                            <button
                                                onClick={() => blockProduct(product._id)}
                                                className="adminbtn mt-2"
                                            >
                                                Confirm Block
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No products found.</p>
                    )
                ) : state === "Buyers" ? (
                    filteredBuyers.map((buyer) => (
                        <div className="user-card user-card shadow-lg p-5 mb-4 bg-slate-50 rounded mt-8" key={buyer._id}>
                            <div className="user-card-content flex items-center justify-between">
                                <div>{buyer.name}</div>
                                <div>{buyer.email}</div>
                                <div>{buyer.address[0].state}/{buyer.address[0].city}/{buyer.address[0].street}</div>
                                <button
                                    onClick={() => handleBlockButtonClick(buyer._id)}
                                    className={`adminbtn ${buyer.userStatus === "UnBlock" ? "hover:bg-red-500" : "hover:bg-blue-500"}`}
                                >
                                    {buyer.userStatus === "UnBlock" ? "Block" : "UnBlock"}
                                </button>

                                {/* Show description input when block button is clicked */}
                                {blockId === buyer._id && (
                                    <div className="block-description">
                                        <textarea
                                            placeholder="Enter reason for blocking"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full mt-2 p-2 border border-gray-300 rounded"
                                        />
                                        <button
                                            onClick={() => blockProduct(buyer._id)}
                                            className="adminbtn mt-2"
                                        >
                                            Confirm Block
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                    ))
                ) :
                    state === "Sellers" ? (
                        filteredSellers.map((seller) => (
                            <div className="user-card shadow-lg p-5 mb-4 bg-slate-50 rounded mt-8" key={seller._id}>
                                <div className="user-card-content flex items-center justify-between">
                                    {seller.image && (
                                        <img
                                            src={`http://localhost:3000/${seller.image}`}
                                            alt={seller.name}
                                            className="admincontainerimg"
                                        />
                                    )}
                                    <div className="user-name">Seller ID: {seller._id}</div>
                                    <div className="user-email">{seller.email}</div>
                                    
                                    {/* Address Section - Display address or "N/A" */}
                                    <div>
                                        {seller.address && seller.address[0] ? (
                                            `${seller.address[0].country} / ${seller.address[0].city} / ${seller.address[0].street}`
                                        ) : (
                                            "N/A"
                                        )}
                                    </div>
                                    
                                    {/* Block/Unblock Button */}
                                    <button
                                        onClick={() => handleBlockButtonClick(seller._id)}
                                        className={`adminbtn ${seller.userStatus === "UnBlock" ? "hover:bg-red-500" : "hover:bg-blue-500"}`}
                                    >
                                        {seller.userStatus === "UnBlock" ? "Block" : "UnBlock"}
                                    </button>
                                    
                                    {/* Description Input when Block Button is clicked */}
                                    {blockId === seller._id && (
                                        <div className="block-description">
                                            <textarea
                                                placeholder="Enter reason for blocking"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className="w-full mt-2 p-2 border border-gray-300 rounded"
                                            />
                                            <button
                                                onClick={() => blockProduct(seller._id)}
                                                className="adminbtn mt-2"
                                            >
                                                Confirm Block
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) 
                : state === "orders" ? (
                    orders?.length > 0 ? (
                        <div className="order-details mt-6">
                            <h2 className="text-xl font-bold mb-4 ms-4 text-gray-800 underline">Order Details</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white shadow-lg rounded-lg border-collapse border border-gray-200">
                                    <thead>
                                        <tr className="bg-gray-100 text-left text-gray-800 uppercase text-sm leading-normal">
                                            <th className="py-3 px-6">Order ID</th>
                                            <th className="py-3 px-6">Product Name</th>
                                            <th className="py-3 px-6">Quantity</th>
                                            <th className="py-3 px-6">Total Price</th>
                                            <th className="py-3 px-6">Customer Email</th>
                                            <th className="py-3 px-6">Customer Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order, index) => (
                                            <tr
                                                key={index}
                                                className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                                    }`}
                                            >
                                                <td className="py-4 px-6 text-gray-700">{order.orderId}</td>
                                                <td className="py-4 px-6 text-gray-700">{order.productDetails?.name}</td>
                                                <td className="py-4 px-6 text-gray-700 text-center">{order.quantity}</td>
                                                <td className="py-4 px-6 text-gray-700 text-center">₹{order.totalPrice}</td>
                                                <td className="py-4 px-6 text-gray-700">{order.userEmail}</td>
                                                <td className="py-4 px-6 text-gray-700">{order.userName}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    ) : (
                        <div>No orders found.</div>
                    )
                ) : null
                }
            </div>

        </div>
    );
}

export default AdminViewpage;
