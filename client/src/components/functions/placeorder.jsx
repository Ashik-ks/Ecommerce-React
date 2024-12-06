import axios from 'axios';
import {toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PlaceOrder = async (id, items, addressId, setLoading, navigate, usertype) => {
  try {
    const token = localStorage.getItem(id);
    if (!token) {
      toast.error("User authentication failed. Please log in again.");
      return;
    }

    setLoading(true); // Start loading state

    const response = await axios.post(
      `http://localhost:3000/order/${id}`,
      { items, addressId },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    setLoading(false); // End loading state

    if (response.status === 200) {
      // Show success toast and navigate after toast is dismissed
      toast.success("Order placed successfully!", {
        onClose: () => navigate(`/order/${id}/${usertype}`), // Navigate after toast closes
      });
    } else {
      toast.error(response.data.message || "An error occurred while placing your order.");
    }
  } catch (error) {
    setLoading(false); // Stop loading state
    console.error("Error placing order:", error);

    // Extract server error message if available
    if (error.response && error.response.data && error.response.data.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("An error occurred while placing your order. Please try again later.");
    }
  }
};

export default PlaceOrder;
