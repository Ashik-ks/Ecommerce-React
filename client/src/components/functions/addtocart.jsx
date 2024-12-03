import axios from 'axios';

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
            alert(response.data.message || "Product added to cart successfully!");
            // Optionally, update state or trigger re-render here
        } else {
            alert(response.data.message || "Failed to add product to cart. Please try again.");
        }
    } catch (error) {
        console.error("Error adding product to cart:", error);
        alert("An error occurred while adding the product to the cart. Please try again.");
    }
};

export default AddToCart;
