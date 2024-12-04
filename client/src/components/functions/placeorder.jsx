import axios from 'axios';

const PlaceOrder = async (id, items, addressId, setLoading, navigate, usertype) => {
  try {
    const token = localStorage.getItem(id);
    if (!token) {
      alert("User authentication failed. Please log in again.");
      return;
    }

    setLoading(true); // Start loading

    // Make the POST request using axios
    const response = await axios.post(
      `http://localhost:3000/order/${id}`,
      { items, addressId }, // Pass addressId along with items
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    setLoading(false); // Stop loading

    // Handle successful response
    if (response.status === 200) {
      alert("Order placed successfully!");
      navigate(`/order/${id}/${usertype}`);
    } else {
      alert(response.data.message || "An error occurred while placing your order.");
    }
  } catch (error) {
    setLoading(false); // Stop loading on error
    console.error("Error placing order:", error);
    alert("An error occurred while placing your order. Please try again later.");
  }
};

export default PlaceOrder;
