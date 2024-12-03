import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InnerPagesNav from "../nav/innerpagesnav";
import Footer from "../footer/footer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTag,faAlignLeft,faList,faListAlt,faCube,faDollarSign,faTags,faBoxes,faImages,faWeight,faPaperPlane,}
from '@fortawesome/free-solid-svg-icons';

function Addproduct() {
  const { id, usertype } = useParams();
  const navigate = useNavigate();
  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]); // For displaying selected files
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    item: "",
    price: "",
    discountPrice: "",
    stockQuantity: "",
    weight: "",
    images: [],
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch("http://localhost:3000/category");
      const output = await response.json();
      if (response.ok && output.data && Array.isArray(output.data)) {
        setCategoriesData(output.data);
      } else {
        setErrorMessage("Failed to load categories.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while fetching categories.");
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setProductData((prevState) => ({
      ...prevState,
      category: categoryId,
    }));
    setSelectedSubcategory("");
    setSelectedItem("");
  };

  const handleSubcategoryChange = (e) => {
    const subcategoryName = e.target.value;
    setSelectedSubcategory(subcategoryName);
    setProductData((prevState) => ({
      ...prevState,
      subcategory: subcategoryName,
    }));
    setSelectedItem("");
  };

  const handleItemChange = (e) => {
    const itemName = e.target.value;
    setSelectedItem(itemName);
    setProductData((prevState) => ({
      ...prevState,
      item: itemName,
    }));
  };

  const handleImageChange = async (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files); // Display selected files
    const base64Images = await convertImagesToBase64(files);
    setProductData((prevState) => ({
      ...prevState,
      images: base64Images,
    }));
  };

  const convertImagesToBase64 = async (files) => {
    const base64Images = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      const base64 = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      base64Images.push(base64);
    }
    return base64Images;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { name, description, category, subcategory, item, price, discountPrice, stockQuantity, weight, images } =
      productData;

    if (!name || !description || !category || !price || !stockQuantity) {
      setErrorMessage("Missing required fields.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem(id);
    if (!token) {
      setErrorMessage("Authorization token is missing.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/addproducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          category,
          subcategory,
          item,
          price: parseFloat(price),
          discountPrice: discountPrice ? parseFloat(discountPrice) : null,
          stockQuantity: parseInt(stockQuantity, 10),
          images,
          weight: weight ? parseFloat(weight) : null,
          sellerId: id,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage("Product added successfully!");
        setProductData({
          name: "",
          description: "",
          category: "",
          subcategory: "",
          item: "",
          price: "",
          discountPrice: "",
          stockQuantity: "",
          weight: "",
          images: [],
        });
        setSelectedFiles([]);
      } else {
        setErrorMessage(result.message || "An error occurred while adding the product.");
      }
    } catch (error) {
      setErrorMessage("Failed to submit product data.");
    } finally {
      setLoading(false);
    }
  };

    return (
        <>
            <InnerPagesNav />
            <div className="mt-3 backgroundimage ">
    {successMessage && <div className="text-green-500 mt-3">{successMessage}</div>}
    {errorMessage && <div className="text-red-500 mt-3">{errorMessage}</div>}

    <div className="form-container" id="formcontainer">
  {/* Title or Introductory Text */}
  <h2 className="form-title">Add Product Here</h2>
  <p className="form-description">Please fill in the details below to add a new product to the store.</p>

  <form id="productForm" onSubmit={handleFormSubmit}>
    {/* Product Name */}
    <div className="productForm-field">
      <label htmlFor="name">
        <FontAwesomeIcon icon={faTag} /> Product Name:
      </label>
      <input
        type="text"
        id="name"
        name="name"
        className="productForm-input"
        value={productData.name}
        onChange={(e) => setProductData({ ...productData, name: e.target.value })}
        required
      />
    </div>

    {/* Description */}
    <div className="productForm-field">
      <label htmlFor="description">
        <FontAwesomeIcon icon={faAlignLeft} /> Description:
      </label>
      <textarea
        id="description"
        name="description"
        className="productForm-input description-input"
        value={productData.description}
        onChange={(e) => setProductData({ ...productData, description: e.target.value })}
        required
      />
    </div>

    {/* Category and Subcategory */}
    <div className="productForm-field">
      <label htmlFor="category">
        <FontAwesomeIcon icon={faList} /> Category:
      </label>
      <select
        id="category"
        name="category"
        className="productForm-input"
        value={productData.category}
        onChange={handleCategoryChange}
        required
      >
        <option value="">Select a category</option>
        {categoriesData.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>

    <div className="productForm-field">
      <label htmlFor="subcategory">
        <FontAwesomeIcon icon={faListAlt} /> Subcategory:
      </label>
      <select
        id="subcategory"
        name="subcategory"
        className="productForm-input"
        value={productData.subcategory}
        onChange={handleSubcategoryChange}
        required
      >
        <option value="">Select a subcategory</option>
        {categoriesData
          .find((category) => category._id === productData.category)
          ?.subcategories.map((subcategory) => (
            <option key={subcategory.name} value={subcategory.name}>
              {subcategory.name}
            </option>
          ))}
      </select>
    </div>

    {/* Item */}
    <div className="productForm-field">
      <label htmlFor="item">
        <FontAwesomeIcon icon={faCube} /> Item:
      </label>
      <select
        id="item"
        name="item"
        className="productForm-input"
        value={productData.item}
        onChange={handleItemChange}
        required
      >
        <option value="">Select an item</option>
        {categoriesData
          .find((category) => category._id === productData.category)
          ?.subcategories.find((subcategory) => subcategory.name === productData.subcategory)?.items.map(
            (item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            )
          )}
      </select>
    </div>

    {/* Price and Discount Price */}
    <div className="productForm-field flex-row">
      <div className="price-section">
        <label htmlFor="price">
          <FontAwesomeIcon icon={faDollarSign} /> Price:
        </label>
        <input
          type="number"
          id="price"
          name="price"
          className="productForm-input"
          value={productData.price}
          onChange={(e) => setProductData({ ...productData, price: e.target.value })}
          required
        />
      </div>

      <div className="price-section">
        <label htmlFor="discountPrice">
          <FontAwesomeIcon icon={faTags} /> Discount Price (Optional):
        </label>
        <input
          type="number"
          id="discountPrice"
          name="discountPrice"
          className="productForm-input"
          value={productData.discountPrice}
          onChange={(e) => setProductData({ ...productData, discountPrice: e.target.value })}
        />
      </div>
    </div>

    {/* Stock Quantity and Weight */}
    <div className="productForm-field flex-row">
      <div className="stock-section">
        <label htmlFor="stockQuantity">
          <FontAwesomeIcon icon={faBoxes} /> Stock Quantity:
        </label>
        <input
          type="number"
          id="stockQuantity"
          name="stockQuantity"
          className="productForm-input"
          value={productData.stockQuantity}
          onChange={(e) => setProductData({ ...productData, stockQuantity: e.target.value })}
          required
          min="0"
        />
      </div>

      <div className="stock-section">
        <label htmlFor="weight">
          <FontAwesomeIcon icon={faWeight} /> Weight (Optional):
        </label>
        <input
          type="number"
          id="weight"
          name="weight"
          className="productForm-input"
          value={productData.weight}
          onChange={(e) => setProductData({ ...productData, weight: e.target.value })}
        />
      </div>
    </div>

    {/* Images */}
 <div className="productForm-field">
  <label htmlFor="images">
    <FontAwesomeIcon icon={faImages} /> Images:
  </label>

  <label htmlFor="file" className="custum-file-upload">
    <div className="icon">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" />
      </svg>
    </div>
    <div className="text">
      <span>Click to upload images</span>
    </div>
    <input
      id="file"
      type="file"
      multiple
      accept="image/*"
      onChange={handleImageChange}
      style={{ display: 'none' }}
    />
  </label>

  {selectedFiles.length > 0 && (
    <div className="selected-files">
      <p>Selected images:</p>
      <div className="image-thumbnails">
        {selectedFiles.map((file, index) => (
          <div key={index} className="image-thumbnail">
            <img
              src={URL.createObjectURL(file)}
              alt={`Selected file ${index + 1}`}
              className="thumbnail-img"
            />
          </div>
        ))}
      </div>
    </div>
  )}
</div>



    {/* Submit Button */}
    <button type="submit" id="submit-button" disabled={loading}>
      <FontAwesomeIcon icon={faPaperPlane} /> Submit Product
    </button>
  </form>
</div>

</div>

            <Footer />
        </>
    );
}

export default Addproduct;
