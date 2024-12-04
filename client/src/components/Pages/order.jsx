import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

const OrderDetails = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id,usertype } = useParams();
 
let token = localStorage.getItem(id)
    // Fetch orders on component mount
    useEffect(() => {
        if (!id || !token) {
            alert("User ID and token are required.");
            return;
        }

        const getOrders = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/gatAllorders/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                });

                if (response.data && response.data.orderedProducts) {
                    setOrders(response.data.orderedProducts);
                } else {
                    setError(response.data.message || "Failed to fetch ordered products.");
                }
            } catch (err) {
                setError("An error occurred while fetching ordered products.");
            } finally {
                setLoading(false);
            }
        };

        getOrders();
    }, [id, token]);

    // Handle cancel order
    const cancelOrder = async (orderId, productId, quantity) => {
        const requestBody = {
            order_id: orderId,
            product_id: productId,
            quantity: parseInt(quantity)
        };

        try {
            const response = await axios.post(`http://localhost:3000/cancelOrder/${id}`, requestBody, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.data.success) {
                alert("Order canceled successfully!");
                // Reload orders after cancellation
                setOrders(orders.filter(order => order.orderId !== orderId));
            } else {
                alert(response.data.message || "Failed to cancel order.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while canceling the order.");
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-3"></div>
                <div className="col-6 border addtocartdetailsdiv">
                    <div className="row" id="fetchallorderproducts">
                        {loading ? (
                            <p>Loading orders...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                            orders.map(product => {
                                const productIdsString = `${product.productId},${product.quantity},${product.orderId}`; // Format the string with productId, quantity, and orderId
                                return (
                                    <div key={product.orderId} className="bg-white p-4 border-bottom border-1 mt-2 mb-4">
                                        <div className="d-flex align-items-center">
                                            <img src={product.productImage[0]} alt={product.productName} className="rounded me-3" width="60" height="60" />
                                            <div>
                                                <h5 className="mb-1">{product.productName}</h5>
                                                <p className="text-muted">{product.productDescription}</p>
                                                <div className="d-flex align-items-center">
                                                    <span className="fw-bold text-primary">₹{product.price}</span>
                                                    {product.discountPrice && (
                                                        <span className="text-success ms-2">{product.discountPrice}% off</span>
                                                    )}
                                                </div>
                                                <div className="mt-2 d-flex flex-column">
                                                    <span className="text-muted">Quantity: {product.quantity}</span>
                                                    <span className="mb-2 mt-3 fw-bold text-primary">Price To Pay: ₹{product.totalPrice}</span>
                                                </div>
                                                <div className="mt-2">
                                                    <button
                                                        className="btn btn-sm btn-outline-danger me-2"
                                                        onClick={() => cancelOrder(product.orderId, product.productId, product.quantity)}
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

                    <div className="row border-bottom border-1 pt-3 pb-3 ms-">
                        <span className="fs-6">About Our Return Policy <i className="fa fa-long-arrow-right" aria-hidden="true"></i></span>
                    </div>
                    <div className="row border-bottom border-1 pt-3 pb-3">
                        <span className="fs-6">Terms And Conditions <i className="fa fa-long-arrow-right" aria-hidden="true"></i></span>
                    </div>

                    <div className="row" id="totalprice">
                        {/* Display total price logic here if needed */}
                    </div>
                </div>
                <div className="col-3"></div>
            </div>
        </div>
    );
};

export default OrderDetails;
