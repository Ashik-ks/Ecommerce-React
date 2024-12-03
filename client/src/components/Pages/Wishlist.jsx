import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";  // Importing axios
import InnerPagesNav from "../nav/innerpagesnav";
import Footer from "../footer/footer";
import AddToWishlist from "../functions/addtowishlist";
import AddToCart from "../functions/addtocart";


function AddToWishlistPage() {
    const navigate = useNavigate();
    const { id, usertype } = useParams(); // Assuming id and usertype come from URL params
    const [wishlist, setWishlist] = useState([]);
    const [count, setCount] = useState(0);
    const [address, setPincode] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);

    const token = localStorage.getItem(id)

    const addToWishlist = async (productId) => {
        try {
            await AddToWishlist(productId, id, token);
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Something went wrong while adding to the cart.");
        }
    };

    const addToCart = async (productId) => {
        try {
            await AddToCart(productId, id, token);
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Something went wrong while adding to the cart.");
        }
    };

    useEffect(() => {
        const fetchWishlistData = async () => {
            const token = localStorage.getItem(id);

            if (!token) {
                console.error('No token found for the user.');
                alert('Please log in to access your wishlist.');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:3000/getallWishlist/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                // Log the entire response to see what is returned from the server
                console.log('API Response:', response.data);

                const { products, count, address, totalprice } = response.data;

                // Check if the products array is empty or malformed
                if (!products || !Array.isArray(products)) {
                    console.error('Unexpected API response:', { products });
                    alert('Invalid data received from server.');
                    return;
                }

                setWishlist(products);
                setCount(count);
                setPincode(address);
                setTotalPrice(totalprice);
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while fetching your wishlist. Please try again later.');
            }
        };

        fetchWishlistData();
    }, [id]);

    return (
        <>
            <InnerPagesNav />

            <div className="container mx-auto px-4">
  <div className="flex justify-center">
    <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 border border-gray-300">
      <div className="bg-white p-4 sm:p-6 border-b border-gray-300 mb-6">
        <h2 className="text-lg font-semibold text-gray-800">My Wishlist ({count})</h2>
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
        {wishlist.map((product) => (
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
                    addToWishlist(product._id);
                  }}
                >
                  Remove
                </button>
                <button
                  className="w-full sm:w-[110px] px-2 py-2 border-2 border-purple-600 text-purple-600 bg-transparent rounded-lg text-sm cursor-pointer transition-all duration-300 hover:bg-purple-600 hover:text-white"
                  onClick={() => addToCart(product._id)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <div className="py-3">
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

export default AddToWishlistPage;
