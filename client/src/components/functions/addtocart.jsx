import axios from 'axios';
import {toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddToCart = async (pid, id, token) => {
    try {
        const response = await axios.put(`http://localhost:3000/addtoCart/${id}/${pid}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        // Check if the response status is 200 (OK)
        if (response.status === 200) {
            toast.success(response.data.message || "Product added to cart successfully!"); // Success toast
            // Optionally, update state or trigger re-render here
        } else {
            toast.error(response.data.message || "Failed to add product to cart. Please try again."); // Error toast
        }
    } catch (error) {
        console.error("Error adding product to cart:", error);
        toast.error("An error occurred while adding the product to the cart. Please try again."); // Error toast
    }
};

export default AddToCart;
