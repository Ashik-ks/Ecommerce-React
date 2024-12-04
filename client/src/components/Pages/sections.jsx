import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import InnerPagesNav from '../nav/innerpagesnav';
import Footer from "../footer/footer";
import axios from 'axios';
import AddToWishlist from '../functions/addtowishlist';

function Sections() {
  const [productOnOffer, setProductOnOffer] = useState([]);
  const [productOnEliteOffer, setProductOnEliteOffer] = useState([]);
  const [productNew, setProductNew] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  let token = localStorage.getItem(id);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/productsections/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("response.data.productOnOffer: ",response.data.productOnOffer)
        setProductOnOffer(response.data.productOnOffer);
        setProductOnEliteOffer(response.data.productOnEliteOffer);
        setProductNew(response.data.productNew);
      } catch (err) {
        setError("Error fetching data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  const addToWishlist = async (productId) => {
    try {
        await AddToWishlist(productId, id, token);
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        alert("Something went wrong while adding to the wishlist.");
    }
};

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <InnerPagesNav />
      <div className="container max-w-screen-xl px-4 py-6 mx-auto">
        {/* Products on Offer */}
        <div id="allproducts" className="mt-5">
          <h2 className="text-xl font-bold mb-4">Products on Offer</h2>
          {productOnOffer.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productOnOffer.map((product) => {
                const imageUrl = product.images && product.images[0] ? product.images[0] : 'fallback-image-url.jpg';

                return (
                  <div
                    key={product._id}
                    className="product-card transition-transform duration-300 hover:scale-105 hover:shadow-lg bg-white rounded-lg p-3"
                    style={{
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Default shadow
                      borderRadius: "8px",
                    }}
                  >
                    {/* Wishlist Icon (conditionally rendered) */}
                    <div
                      className="position-relative"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        addToWishlist(product._id);
                    }}
                    >
                      <span
                        className="wishlistheart"
                        style={{
                          position: "absolute",
                          top: "-12px",
                          left: "10px",
                          zIndex: 10,
                        }}
                      >
                        <i
                          className={`fa fa-heart fs-3 ${product.isInWishlist ? 'text-danger' : 'text-slate-300'}`}
                          aria-hidden="true"
                        ></i>
                      </span>
                    </div>

                    {/* Product Image */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <img
                        src={`http://localhost:3000/${imageUrl}`}
                        className="w-full mx-auto h-[100px] object-cover md:h-[250px] lg:h-[300px] rounded-md"
                        alt={product.name}
                      />
                    </div>

                    {/* Product Details */}
                    <button className="border-0">
                      <div className="d-flex justify-content-start">
                        {/* Product Name */}
                        <div className="mt-4 text-md text-start text-gray-800 ms-1">
                          {product.name.slice(0, 20)}
                          {product.name.length > 30 ? "..." : ""}
                        </div>
                        {/* Price and Discount Price */}
                        <div className="flex justify-content-start gap-3 mt-1 ms-1">
                          <span
                            className="text-lg font-bold text-black"
                            style={{ fontSize: "1rem", fontWeight: "bold" }}
                          >
                            Offer: ₹{product.discountPrice}
                          </span>
                          <span
                            className="text-md price line-through text-black"
                            style={{ fontSize: "1rem" }}
                          >
                            Price: ₹{product.price}
                          </span>
                        </div>

                        {/* Stock status */}
                        <div
                          className="mt-1 ms-1 text-sm text-gray-500 text-start"
                          style={{ fontSize: "1rem", fontWeight: "bold" }}
                        >
                          {product.stockStatus}
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>No products found.</div>
          )}
        </div>

        {/* Elite Offer Products */}
        <div id="elite-offer-products" className="mt-5">
          <h2 className="text-xl font-bold mb-4">Elite Offer Products</h2>
          {productOnEliteOffer.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productOnEliteOffer.map((product) => {
                const imageUrl = product.images && product.images[0] ? product.images[0] : 'fallback-image-url.jpg';

                return (
                  <div
                    key={product._id}
                    className="product-card transition-transform duration-300 hover:scale-105 hover:shadow-lg bg-white rounded-lg p-3"
                    style={{
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Default shadow
                      borderRadius: "8px",
                    }}
                  >
                    {/* Wishlist Icon (conditionally rendered) */}
                    <div
                      className="position-relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span
                        className="wishlistheart"
                        style={{
                          position: "absolute",
                          top: "-12px",
                          left: "10px",
                          zIndex: 10,
                        }}
                      >
                        <i
                          className={`fa fa-heart fs-3 ${product.isInWishlist ? 'text-danger' : 'text-slate-300'}`}
                          aria-hidden="true"
                        ></i>
                      </span>
                    </div>

                    {/* Product Image */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <img
                        src={`http://localhost:3000/${imageUrl}`}
                        className="w-full mx-auto h-[100px] object-cover md:h-[250px] lg:h-[300px] rounded-md"
                        alt={product.name}
                      />
                    </div>

                    {/* Product Details */}
                    <button className="border-0">
                      <div className="d-flex justify-content-start">
                        {/* Product Name */}
                        <div className="mt-4 text-md text-start text-gray-800 ms-1">
                          {product.name.slice(0, 20)}
                          {product.name.length > 30 ? "..." : ""}
                        </div>
                        {/* Price and Discount Price */}
                        <div className="flex justify-content-start gap-3 mt-1 ms-1">
                          <span
                            className="text-lg font-bold text-black"
                            style={{ fontSize: "1rem", fontWeight: "bold" }}
                          >
                            Offer: ₹{product.discountPrice}
                          </span>
                          <span
                            className="text-md price line-through text-black"
                            style={{ fontSize: "1rem" }}
                          >
                            Price: ₹{product.price}
                          </span>
                        </div>

                        {/* Stock status */}
                        <div
                          className="mt-1 ms-1 text-sm text-gray-500 text-start"
                          style={{ fontSize: "1rem", fontWeight: "bold" }}
                        >
                          {product.stockStatus}
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>No elite offer products found.</div>
          )}
        </div>

        {/* New Products */}
        <div id="new-products" className="mt-5">
          <h2 className="text-xl font-bold mb-4">New Products</h2>
          {productNew.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productNew.map((product) => {
                const imageUrl = product.images && product.images[0] ? product.images[0] : 'fallback-image-url.jpg';

                return (
                  <div
                    key={product._id}
                    className="product-card transition-transform duration-300 hover:scale-105 hover:shadow-lg bg-white rounded-lg p-3"
                    style={{
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Default shadow
                      borderRadius: "8px",
                    }}
                  >
                    {/* Wishlist Icon (conditionally rendered) */}
                    <div
                      className="position-relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span
                        className="wishlistheart"
                        style={{
                          position: "absolute",
                          top: "-12px",
                          left: "10px",
                          zIndex: 10,
                        }}
                      >
                        <i
                          className={`fa fa-heart fs-3 ${product.isInWishlist ? 'text-danger' : 'text-slate-300'}`}
                          aria-hidden="true"
                        ></i>
                      </span>
                    </div>

                    {/* Product Image */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <img
                        src={`http://localhost:3000/${imageUrl}`}
                        className="w-full mx-auto h-[100px] object-cover md:h-[250px] lg:h-[300px] rounded-md"
                        alt={product.name}
                      />
                    </div>

                    {/* Product Details */}
                    <button className="border-0">
                      <div className="d-flex justify-content-start">
                        {/* Product Name */}
                        <div className="mt-4 text-md text-start text-gray-800 ms-1">
                          {product.name.slice(0, 20)}
                          {product.name.length > 30 ? "..." : ""}
                        </div>
                        {/* Price and Discount Price */}
                        <div className="flex justify-content-start gap-3 mt-1 ms-1">
                          <span
                            className="text-lg font-bold text-black"
                            style={{ fontSize: "1rem", fontWeight: "bold" }}
                          >
                            Offer: ₹{product.discountPrice}
                          </span>
                          <span
                            className="text-md price line-through text-black"
                            style={{ fontSize: "1rem" }}
                          >
                            Price: ₹{product.price}
                          </span>
                        </div>

                        {/* Stock status */}
                        <div
                          className="mt-1 ms-1 text-sm text-gray-500 text-start"
                          style={{ fontSize: "1rem", fontWeight: "bold" }}
                        >
                          {product.stockStatus}
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>No new products found.</div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Sections;
