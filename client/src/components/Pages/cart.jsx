import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import InnerPagesNav from "../nav/innerpagesnav";
import Footer from "../footer/footer";
import AddToWishlist from "../functions/addtowishlist";

function Addtocartpage() {
  const navigate = useNavigate();
  const { id } = useParams(); // User ID
  const { usertype } = useParams(); // User Type
  const [cart, setCart] = useState([]);
  const [count, setCount] = useState(0);
  const [address, setAddress] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  const token = localStorage.getItem(id);

  const addToWishlist = async (productId) => {
    try {
      await AddToWishlist(productId, id, token);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      alert("Something went wrong while adding to the wishlist.");
    }
  };

  const removeCart = async (productId) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/updateaddtoCart/${id}/${productId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log("Server Response:", data);

      if (response.status === 200) {
        alert(data.message);

        // Update cart state to reflect removal
        setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
        setCount((prevCount) => prevCount - 1);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      alert("An error occurred while removing the item. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchCartData = async () => {
      const token = localStorage.getItem(id);

      if (!token) {
        console.error("No token found for the user.");
        alert("Please log in to access your cart.");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/getalladdtoCart/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API Response:", response.data);

        const { products, count, address, totalprice } = response.data;

        setCart(products || []);
        setCount(count || 0);
        setAddress(address || "");
        setTotalPrice(totalprice || 0);
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while fetching your cart. Please try again later.");
      }
    };

    fetchCartData();
  }, [id]);

  const handleOrderNow = () => {
    const allAddToCartProductIds = cart.map((product) => product._id).join(","); // Convert product IDs to a comma-separated string

    // Navigate to the order page with dynamic parameters
    navigate(`/billing/${id}/${allAddToCartProductIds}/${usertype}`);
  };

  return (
    <>
      <InnerPagesNav />
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 border border-gray-300">
            <div className="bg-white p-4 sm:p-6 border-b border-gray-300 mb-6">
              <h2 className="text-lg font-semibold text-gray-800">My Cart ({count})</h2>
            </div>
            <div className="bg-white border-b border-gray-300 pb-3">
              <div className="flex justify-between items-center px-3 sm:px-5">
                <div className="flex items-center">
                  <i className="fas fa-map-marker-alt text-pink-500 mr-2"></i>
                  <span className="text-base sm:text-lg font-semibold">{address[0]?.pincode}</span>
                </div>
              </div>
              <p className="mt-2 px-3 sm:px-5 text-green-600">Get delivery in 2 days, 24 Nov</p>
            </div>
            <div>
              {cart.map((product) => (
                <div
                  key={product._id}
                  className="bg-white border-b border-gray-300 flex flex-col sm:flex-row gap-4 sm:gap-10 items-center p-4"
                >
                  <img
                    src={`http://localhost:3000/${product.images[0]}`}
                    alt={product.name}
                    className="w-[6.2rem] h-20 object-cover rounded-md"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="text-base sm:text-xl font-semibold">{product.name}</h4>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mt-2">
                      <span className="text-lg font-bold text-green-600">{product.discountPrice}</span>
                      <span className="text-black line-through">₹{product.price}</span>
                    </div>
                    <div className="mt-2 flex flex-col sm:flex-row gap-2 justify-center sm:justify-start">
                      <button
                        className="w-full sm:w-[110px] px-2 py-2 border-2 border-purple-600 text-purple-600 bg-transparent rounded-lg text-sm cursor-pointer transition-all duration-300 hover:bg-purple-600 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCart(product._id);
                        }}
                      >
                        Remove
                      </button>
                      <button
                        className="w-full sm:w-[130px] px-2 py-2 border-2 border-purple-600 text-purple-600 bg-transparent rounded-lg text-sm cursor-pointer transition-all duration-300 hover:bg-purple-600 hover:text-white"
                        onClick={() => {
                          if (product.wishlist) {
                            addToWishlist(product._id);
                          } else {
                            addToWishlist(product._id);
                          }
                        }}
                      >
                        {product.wishlist ? (
                          <span className="text-red-600 text-sm">&#10084; Wishlisted</span>
                        ) : (
                          "Add to Wishlist"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="bg-white px-5 mt-6">
                <div className="flex justify-between items-center">
                  <div className="flex justify-between gap-5 w-full sm:w-auto">
                    <span className="text-2xl font-bold">Total Price</span>
                    <span className="text-2xl font-bold text-green-600">₹{totalPrice}</span>
                  </div>
                  <button
                    className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg text-lg cursor-pointer transition-all duration-300 hover:bg-purple-700"
                    onClick={handleOrderNow}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="py-3 border-t border-gray-300">
                <span className="text-md text-gray-600 px-3 sm:px-5">
                  About Our Return Policy <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
                </span>
              </div>
              <div className="border-t border-gray-300 py-4">
                <span className="text-md text-gray-600 px-3 sm:px-5">
                  Terms And Conditions <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Addtocartpage;
