import axios from 'axios';
import {toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddToWishlist = async (pid, id, token) => {
    try {
        const response = await axios.put(`http://localhost:3000/addtoWishlist/${id}/${pid}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        // Check if the response status is 200 (OK)
        if (response.status === 200) {
            toast.success(response.data.message || "Product added to wishlist successfully!"); // Success toast
            // Optionally reload the page or update the UI if necessary
            location.reload(); // Reloading the page is not recommended in React. Instead, you can update state.
        } else {
            toast.error(response.data.message || "Failed to add product to wishlist. Please try again."); // Error toast
        }
    } catch (error) {
        console.error("Error adding product to wishlist:", error);
        toast.error("An error occurred while adding the product to the wishlist. Please try again."); // Error toast
    }
};

export default AddToWishlist;
