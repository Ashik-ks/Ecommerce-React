import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import InnerPagesNav from "../nav/innerpagesnav";
import {toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../footer/footer";

const OrderDetails = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id, usertype } = useParams();
    let token = localStorage.getItem(id);

    // Fetch orders on component mount
    useEffect(() => {
        // if (!id || !token) {
        //     toast.error("Login to see your Orders");
        //     return;
        // }

        const getOrders = async () => {
            setLoading(true); // Set loading state
            try {
                const response = await axios.get(`http://localhost:3000/gatAllorders/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.data.success) {
                    if (Array.isArray(response.data.orderedProducts) && response.data.orderedProducts.length > 0) {
                        setOrders(response.data.orderedProducts);
                    } else {
                        setError(response.data.message || "Your order list is empty.");
                    }
                } else {
                    setError(response.data.message || "Failed to fetch ordered products.");
                }
            } catch (err) {
                if (err.response && err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError("An error occurred while fetching ordered products.");
                }
            } finally {
                setLoading(false);
            }
        };

        getOrders();
    }, [id, token]);

    const cancelOrder = async (orderId, productId, quantity) => {
        const requestBody = {
            order_id: orderId,
            product_id: productId,
            quantity: parseInt(quantity),
        };

        try {
            const response = await axios.post(`http://localhost:3000/cancelOrder/${id}`, requestBody, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.data.success) {
                toast.success("Order canceled successfully!", {
                    onClose: () => window.location.reload(),
                    autoClose: 1000,
                    className: "bg-purple-600 text-white font-semibold rounded-lg shadow-lg",
                    bodyClassName: "text-center text-black",
                    progressClassName: "bg-purple-300",
                });
                setOrders(orders.filter((order) => order.orderId !== orderId));
            } else {
                toast.error(response.data.message || "Failed to cancel order.");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred while canceling the order.");
        }
    };

    return (
        <>
            <InnerPagesNav />
            <div className="orderdetailsdiv w-full lg:w-auto">
    <div className="w-full lg:w-1/2 mx-auto border maindiv1 ">
        <div id="fetchallorderproducts">
            {loading ? (
                <p>Loading orders...</p>
            ) : error ? (
                <div className="text-center py-10">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-gray-400 mx-auto mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 3h18l-2 13H5L3 3zm3 14a3 3 0 106 0H6zm12 0a3 3 0 106 0h-6z"
                        />
                    </svg>
                    <p className="text-gray-500 text-lg">{error}</p>
                </div>
            ) : (
                orders.map((product) => {
                    return (
                        <div
                            key={product.orderId}
                            className="bg-white p-4 border-b border-gray-300 mt-4"
                        >
                            <div className="flex flex-col sm:flex-row items-center">
                                <img
                                    src={`http://localhost:3000/${product.productImage[0]}`}
                                    alt={product.productName}
                                    className="rounded mb-4 sm:mb-0 sm:mr-4 w-22 h-16 object-cover"
                                />
                                <div className="w-full">
                                    <h5 className="text-lg font-semibold">{product.productName}</h5>
                                    <p className="text-gray-600">{product.productDescription}</p>
                                    <div className="flex items-center mt-2">
                                        <span className="line-through text-green-600">
                                            ₹{product.price}
                                        </span>
                                        {product.discountPrice && (
                                            <span className="text-blue-600 font-bold ml-2">
                                                ₹{product.discountPrice}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-4">
                                        <span className="text-gray-500">
                                            Quantity: {product.quantity}
                                        </span>
                                        <span className="block mt-3 text-lg font-bold text-blue-600 ">
                                            Price To Pay: ₹{product.totalPrice}
                                        </span>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                                            onClick={() =>
                                                cancelOrder(
                                                    product.orderId,
                                                    product.productId,
                                                    product.quantity
                                                )
                                            }
                                        >
                                            Cancel Order
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
        <div className="border-t">
            <div className="py-3 border-gray-300">
                <span className="text-md text-gray-600 px-3 sm:px-5">
                    About Our Return Policy <i className="fa fa-long-arrow-right"></i>
                </span>
            </div>
            <div className="border-t border-gray-300 py-4">
                <span className="text-md text-gray-600 px-3 sm:px-5">
                    Terms And Conditions <i className="fa fa-long-arrow-right"></i>
                </span>
            </div>
        </div>
    </div>
</div>

            <Footer />
        </>
    );
};

export default OrderDetails;
