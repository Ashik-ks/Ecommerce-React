import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InnerPagesNav from "../nav/innerpagesnav";
import Footer from "../footer/footer";
import axios from "axios";
import AddToWishlist from "../functions/addtowishlist";
import {toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Sections() {
  const { id, usertype, state } = useParams();
  const [products, setProducts] = useState({
    productOnOffer: [],
    productOnEliteOffer: [],
    productNew: [],
    productSplurge: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllOffer, setShowAllOffer] = useState(false);
  const [showAllEliteOffer, setShowAllEliteOffer] = useState(false);
  const [showAllNewProducts, setShowAllNewProducts] = useState(false);
  const [showAllSplurge, setShowAllSplurge] = useState(false);

  const offerRef = useRef(null);
  const eliteOfferRef = useRef(null);
  const newProductRef = useRef(null);
  const splurgeProductRef = useRef(null);

  // Fetch products and handle scroll
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/productsections/${id || "default"}`);
        setProducts({
          productOnOffer: response.data.productOnOffer,
          productOnEliteOffer: response.data.productOnEliteOffer,
          productNew: response.data.productNew,
          productSplurge: response.data.highestPricedProducts
        });
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  // Handle scroll to section based on 'state' in URL
  useEffect(() => {
    if (!loading && state) {
      const sectionState = decodeURIComponent(state).toUpperCase();
      setTimeout(() => {
        if (sectionState === "OFFERS" && offerRef.current) {
          offerRef.current.scrollIntoView({ behavior: "smooth" });
        } else if (sectionState === "ELITE OFFERS" && eliteOfferRef.current) {
          eliteOfferRef.current.scrollIntoView({ behavior: "smooth" });
        } else if (sectionState === "NEW" && newProductRef.current) {
          newProductRef.current.scrollIntoView({ behavior: "smooth" });
        } else if (sectionState === "SPLURGE" && splurgeProductRef.current) {
          splurgeProductRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    }
  }, [loading, state]);

  const addToWishlist = async (productId) => {
    try {
      await AddToWishlist(productId, id, localStorage.getItem(id));
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Something went wrong while adding to the cart.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleToggleView = (section) => {
    if (section === "offer") setShowAllOffer(!showAllOffer);
    if (section === "eliteOffer") setShowAllEliteOffer(!showAllEliteOffer);
    if (section === "newProducts") setShowAllNewProducts(!showAllNewProducts);
    if (section === "splurge") setShowAllSplurge(!showAllSplurge);
  };

  return (
    <>
      <InnerPagesNav />
      <div className="container max-w-screen-xl px-4 py-6 mx-auto">
        {/* Products on Offer */}
        <div ref={offerRef} id="allproducts" className="mt-5">
          <div className="container max-w-screen-xl mx-auto mb-7">
            <div className="text-center mb-5">
              <div className="text-center text-3xl font-bold mt-5 text-purple-500">Products On Offer</div>
              <div className="text-center text-lg mt-3 text-black">
                <button onClick={() => handleToggleView("offer")} className="mb-5 me-2 cursor-pointer">
                  {showAllOffer ? "Show Less" : "View All"}
                </button>
                <i className="fa-solid fa-arrow-right"></i>
              </div>
            </div>
          </div>
          {products.productOnOffer.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {showAllOffer
                ? products.productOnOffer.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      addToWishlist={addToWishlist}
                    />
                  ))
                : products.productOnOffer.slice(0, 4).map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      addToWishlist={addToWishlist}
                    />
                  ))}
            </div>
          ) : (
            <div>No products found.</div>
          )}
        </div>

        {/* Elite Offer Products */}
        <div ref={eliteOfferRef} id="elite-offer-products" className="mt-8">
          <div className="text-center mb-12">
            <div className="text-center text-3xl font-bold mt-5 text-purple-500">Elite Offer Products</div>
            <div className="text-center text-lg mt-3 text-black">
              <button onClick={() => handleToggleView("eliteOffer")} className="mb-5 me-2 cursor-pointer">
                {showAllEliteOffer ? "Show Less" : "View All"}
              </button>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </div>
          {products.productOnEliteOffer.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {showAllEliteOffer
                ? products.productOnEliteOffer.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      addToWishlist={addToWishlist}
                    />
                  ))
                : products.productOnEliteOffer.slice(0, 4).map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      addToWishlist={addToWishlist}
                    />
                  ))}
            </div>
          ) : (
            <div>No elite offer products found.</div>
          )}
        </div>

        {/* New Products */}
        <div ref={newProductRef} id="new-products" className="mt-8">
          <div className="text-center mb-12">
            <div className="text-center text-3xl font-bold mt-5 text-purple-500">New Products</div>
            <div className="text-center text-lg mt-3 text-black">
              <button onClick={() => handleToggleView("newProducts")} className="mb-5 me-2 cursor-pointer">
                {showAllNewProducts ? "Show Less" : "View All"}
              </button>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </div>
          {products.productNew.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {showAllNewProducts
                ? products.productNew.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      addToWishlist={addToWishlist}
                    />
                  ))
                : products.productNew.slice(0, 4).map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      addToWishlist={addToWishlist}
                    />
                  ))}
            </div>
          ) : (
            <div>No new products found.</div>
          )}
        </div>

        {/* Splurge Products */}
        <div ref={splurgeProductRef} id="splurge-products" className="mt-8">
          <div className="text-center mb-12">
            <div className="text-center text-3xl font-bold mt-5 text-purple-500">Splurge Products</div>
            <div className="text-center text-lg mt-3 text-black">
              <button onClick={() => handleToggleView("splurge")} className="mb-5 me-2 cursor-pointer">
                {showAllSplurge ? "Show Less" : "View All"}
              </button>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </div>
          {products.productSplurge.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {showAllSplurge
                ? products.productSplurge.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      addToWishlist={addToWishlist}
                    />
                  ))
                : products.productSplurge.slice(0, 4).map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      addToWishlist={addToWishlist}
                    />
                  ))}
            </div>
          ) : (
            <div>No splurge products found.</div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

const ProductCard = ({ product, addToWishlist }) => {
  const { id, usertype } = useParams();
  const navigate = useNavigate();

  const singleProduct = (productId, category) => {
    navigate(`/singleview/${productId}/${id}/${category}/${usertype}`);
  };

  return (
    <div className="product-card transition-transform duration-300 hover:scale-105 hover:shadow-lg bg-white rounded-lg p-3">
      <div className="relative cursor-pointer" onClick={() => singleProduct(product._id, product.category)}>
        {id && id !== "undefined" && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              addToWishlist(product._id);
            }}
            id={`wishlistheart-${product._id}`}
            className="wishlistheart"
            style={{
              position: "absolute",
              top: "-12px",
              left: "10px",
              zIndex: 10,
            }}
          >
            <i className={`fa fa-heart fs-5 ${product.isInWishlist ? 'text-danger' : 'text-slate-300'}`} aria-hidden="true"></i>
          </span>
        )}
        <img
          src={`http://localhost:3000/${
            product.images && product.images[0] ? product.images[0] : "fallback-image-url.jpg"
          }`}
          alt={product.name || "Fallback Image Description"}
          className="w-full h-[100px] md:h-[250px] lg:h-[300px] object-cover mx-auto"
        />
      </div>
      <div className="d-flex justify-content-start">
        <div className="mt-4 text-md text-start text-gray-800 ms-1">
          {product.name.slice(0, 20)}
          {product.name.length > 30 ? "..." : ""}
        </div>
        <div className="flex justify-content-start gap-3 mt-1 ms-1">
          <span className="text-lg font-bold text-black">Offer: ₹{product.discountPrice}</span>
          <span className="text-md price line-through text-black">Price: ₹{product.price}</span>
        </div>
        <div className="mt-1 ms-1 text-sm text-gray-500 text-start">{product.stockStatus}</div>
      </div>
    </div>
  );
};

export default Sections;
