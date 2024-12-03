import axios from 'axios';

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
            alert(response.data.message || "Product added to whishlist successfully!");
            location.reload()
        } else {
            alert(response.data.message || "Failed to add product to wishlist. Please try again.");
        }
    } catch (error) {
        console.error("Error adding product to cart:", error);
        alert("An error occurred while adding the product to the wishlist. Please try again.");
    }
};

export default AddToWishlist;