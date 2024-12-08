import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import InnerPagesNav from "../nav/innerpagesnav";
import Footer from "../footer/footer";
import PlaceOrder from "../functions/placeorder"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Billing() {
  const navigate = useNavigate();
  const { id, pid, usertype } = useParams();
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for the order process
  const [quantities, setQuantities] = useState({});
  const [selectedAddressId, setSelectedAddressId] = useState(""); // State for the selected address

  const token = localStorage.getItem(id);

  // Fetch cart products and addresses
  const getAllProductToOrder = async () => {
    try {
      if (!id || !token) {
        throw new Error("Missing user ID or token.");
      }

      let decodedEncode = decodeURIComponent(pid);
      const cleanedPid = decodedEncode.split('/')[0];
      let items = cleanedPid.split(',');

      if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Invalid or empty items array.");
      }

      const itemsQuery = items.join(",");

      const response = await axios.get(
        `http://localhost:3000/getallproducttoorder/${id}/${itemsQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      setCart(data.products);
      setAddresses(data.address || []);

      // Initialize quantities to 1 for each product
      const initialQuantities = data.products.reduce((acc, product) => {
        acc[product._id] = 1; // Default quantity is 1
        return acc;
      }, {});
      setQuantities(initialQuantities);
      calculateTotalPrice(data.products, initialQuantities);

    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Something went wrong while fetching the products.");
    }
  };

  useEffect(() => {
    if (id && pid) {
      getAllProductToOrder();
    }
  }, [id, pid]);

  // Calculate total price based on quantities
  const calculateTotalPrice = (products, quantities) => {
    let total = 0;
    products.forEach((product) => {
      const quantity = quantities[product._id] || 1;
      total += product.discountPrice * quantity;
    });
    setTotalPrice(total);
  };

  // Handle quantity change for a product
  const handleQuantityChange = (productId, newQuantity) => {
    setQuantities((prevQuantities) => {
      const updatedQuantities = {
        ...prevQuantities,
        [productId]: newQuantity,
      };
      calculateTotalPrice(cart, updatedQuantities);
      return updatedQuantities;
    });
  };

  // Handle address change
  const handleAddressChange = (event) => {
    setSelectedAddressId(event.target.value);
  };

  // Place order function
  const placeOrder = async () => {
    try {
      if (!selectedAddressId) {
        toast.error("Please select an address.");
        return;
      }

      const items = cart.map((product) => ({
        product_id: product._id,
        quantity: quantities[product._id] || 1,
      }));

      if (items.length === 0) {
        toast.error("No items to order. Please go back and try again.");
        return;
      }

      await PlaceOrder(id, items, selectedAddressId, setLoading, navigate, usertype); // Pass address ID here

    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Something went wrong while placing your order.");
    }
  };

  const singleProduct = (productId, category) => {
    // Navigate to the single product view
    navigate(`/singleview/${productId}/${id}/${category}/${usertype}`);
};

  return (
    <>
      <InnerPagesNav />
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 border border-gray-300">
            <div className="bg-white p-4 sm:p-6 border-b border-gray-300 mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                My Cart ({cart.length})
              </h2>
            </div>
            <div className="bg-white border-b border-gray-300 pb-3">
              <div className="flex justify-between items-center px-3 sm:px-5">
                <div className="flex items-center">
                  <i className="fas fa-map-marker-alt text-pink-500 mr-2"></i>
                  <span className="text-base sm:text-lg font-semibold">
                    Choose your Shipping Address
                  </span>
                </div>
              </div>
              <div className="mt-2 px-3 sm:px-5">
                <select
                  className="block appearance-none w-full bg-white text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  name="address"
                  id="address"
                  onChange={handleAddressChange}
                >
                  <option value="">Select an address</option>
                  {addresses.map((address, index) => (
                    <option key={index} value={address._id}>
                      {address.street}, {address.city}, {address.state}, {address.pincode}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-2 px-3 sm:px-5 text-green-600">
                Get delivery in 2 days, 24 Nov
              </p>
            </div>
            <div>
              {cart.map((product) => (
                <div key={product._id} className="bg-white border-b border-gray-300 flex flex-col sm:flex-row gap-4 sm:gap-10 items-center p-4">
                  <img src={`http://localhost:3000/${product.images[0]}`} onClick={(e) => {
                      e.stopPropagation(); 
                      singleProduct(product._id, product.category);
                  }}
                   alt={product.name} className="w-[6.2rem] h-20 object-cover rounded-md" />
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="text-base sm:text-xl font-semibold">{product.name}</h4>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mt-2">
                      <span className="text-lg font-bold text-green-600">{product.discountPrice} off</span>
                      <span className="text-black line-through">₹{product.price}</span>
                    </div>
                    <div className="mt-2">
                      <span>Quantity</span>
                      <select
                        className="p-2 border-none"
                        value={quantities[product._id] || 1}
                        onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value))}
                      >
                        {[...Array(5)].map((_, index) => (
                          <option key={index} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              <div className="bg-white px-5 mt-6 pb-5">
                <div className="flex justify-between items-center">
                  <div className="totalpricediv flex justify-between gap-5 w-full sm:w-auto">
                    <span className="text-2xl font-bold totalprice">Total Price</span>
                    <span className="text-2xl font-bold text-green-600 totalprice">₹{totalPrice}</span>
                  </div>
                  <button
                    className="totalpricebtn1 w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg text-lg cursor-pointer transition-all duration-300 hover:bg-purple-700"
                    onClick={placeOrder}
                    disabled={loading}
                  >
                    {loading ? "Placing Order..." : "Proceed to Pay"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Billing;
