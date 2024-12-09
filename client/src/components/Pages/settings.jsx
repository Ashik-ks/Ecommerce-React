import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import InnerPagesNav from "../nav/innerpagesnav";
import Footer from "../footer/footer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTag,faAlignLeft,faList,faListAlt,faCube,faDollarSign,faTags,faBoxes,faImages,faWeight,faPaperPlane,}
from '@fortawesome/free-solid-svg-icons';
import {toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SettingsPage = () => {
    const { id, usertype } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        description: "",
        price: "",
        discountPrice: "",
        stockQuantity: "",
        images: []
    });
    const [updateImage, setUpdateImage] = useState(false); // New state for handling image update

    const token = localStorage.getItem(id);

    useEffect(() => {
        const getSellerProducts = async () => {
          try {
            if (!id) {
              throw new Error("Seller ID not found in URL");
            }
    
            if (!token) {
              throw new Error("Authorization token is missing");
            }
    
            const response = await axios.get(`http://localhost:3000/getsellerproduct/${id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
    
            if (response.data.success) {
              setProducts(response.data.data || []);
            } else {
              throw new Error(response.data.message || "No products found for this seller.");
            }
          } catch (error) {
            setError(error.message);
            toast.error(error.message); // Show error toast
          } finally {
            setLoading(false);
          }
        };
    
        getSellerProducts();
      }, [id, token]);

    const handleEditClick = (productId) => {
        setProductData({ id: productId });
        setShowForm(true);
        fetchProductData(productId);
    };

    const fetchProductData = async (productId) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/getproductdataedit/${id}/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            const product = response.data; // Access the response data directly
            console.log("response : ", product);
            
            if (product.data) {
                setFormValues({
                    description: product.data.description || "",
                    price: product.data.price || "",
                    discountPrice: product.data.discountPrice || "",
                    stockQuantity: product.data.stockQuantity || "",
                    images: product.data.images || [],
                });
            }
        } catch (error) {
            console.error("Error fetching product details:", error);
            toast.error("An error occurred while fetching product data."); // Use toast to show the error message
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
    
        // Prepare the payload data
        const payload = {
            description: formValues.description,
            price: parseFloat(formValues.price),
            discountPrice: parseFloat(formValues.discountPrice) || null,
            stockQuantity: parseInt(formValues.stockQuantity, 10),
            images: updateImage ? await convertImagesToBase64(formValues.images) : productData.images || []
        };
    
        try {
            const response = await axios.put(`http://localhost:3000/editproduct/${productData.id}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (response.data.success) {  // Assuming response contains a success field
                toast.success("Product updated successfully!");
                setShowForm(false); // Close the form after successful update
            } else {
                toast.error(response.data.message || "Failed to update the product.");
            }
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error("An error occurred while updating the product.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files) {
            const imageFiles = Array.from(files).filter(file => file.type.startsWith("image/"));
            const previews = imageFiles.map(file => URL.createObjectURL(file));
            setFormValues(prevValues => ({
                ...prevValues,
                images: imageFiles,
                previews, // Store previews for display
            }));
        }
    };
    

    const convertImagesToBase64 = async (files) => {
        if (!files || files.length === 0) {
            return []; // Return an empty array if no files are selected
        }

        try {
            // Filter only image files
            const imageFiles = Array.from(files).filter(file => file.type.startsWith("image/"));

            const filePromises = imageFiles.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();

                    reader.onloadend = () => resolve(reader.result); // Base64 string
                    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));

                    reader.readAsDataURL(file); // Convert file to base64
                });
            });

            // Wait for all promises to resolve
            return await Promise.all(filePromises);
        } catch (error) {
            console.error("Error converting images to base64:", error);
            throw new Error("Failed to convert some images to base64.");
        }
    };


  const handleDeleteClick = async (pid) => {
        try {
            const response = await axios.delete(`http://localhost:3000/deleteproduct/${pid}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.status === 200) {
                toast.success("Product deleted successfully!");
            }
        } catch (error) {
            console.error("Error deleting the product:", error);
            toast.error("Failed to delete the product. Please try again.");
        }
    };
    
    

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <>
            <InnerPagesNav />
            <div className="pb-5 bg-slate-200">
            <div class="marquee max-w-screen-xl mx-auto">
        <div class="marquee-content">
            🚀 Welcome to your Seller Dashboard! 🚀 | 📈 Your sales have increased by 25% this month! | 🛒 New features: Bulk upload, Enhanced analytics, and more! | 🔔 Don't forget to check your notifications for important updates!
        </div>
    </div>

    <div className="space-y-5">
    {/* Add Products Section */}
    <div className="border border-gray-300 p-5 bg-white flex flex-col sm:flex-row justify-between items-center w-full max-w-screen-xl mx-auto px-4 py-6">
        <div className="text-center sm:text-left">
            <h2 className="font-bold text-xl">Bring Your Products to Life!</h2>
            <p className="text-gray-500 mt-2">
                Share your amazing products with our community! Complete the form below to add a new item to our store.
            </p>
        </div>
        <button
            className="mt-4 sm:mt-0 bg-black text-white flex items-center gap-2 py-2 px-4 rounded-md hover:bg-gray-800"
            onClick={() => navigate(`/addproduct/${id}/${usertype}`)}
        >
            Add Products
            <i className="fas fa-arrow-right"></i>
        </button>
    </div>

    {/* Notifications Section */}
    <div className="border border-gray-300 p-5 bg-white flex flex-col sm:flex-row justify-between items-center w-full max-w-screen-xl mx-auto px-4 py-6">
        <div className="text-center sm:text-left">
            <h2 className="font-bold text-xl">Stay Connected: Check Your Email for Exciting Updates!</h2>
            <p className="text-gray-500 mt-2">
                Make sure to check your inbox (and spam folder) regularly to ensure you don’t miss out on any important information.
            </p>
        </div>
        <button
            className="mt-4 sm:mt-0 bg-black text-white flex items-center gap-2 py-2 px-4 rounded-md hover:bg-gray-800"
        >
            Notifications
            <i className="fas fa-arrow-right"></i>
        </button>
    </div>
</div>


                <div className="max-w-screen-xl mt-10 mb-3 mx-auto text-3xl font-bold text-center underline decoration-black">
                Manage Your Added Products
                </div>

                <div className="container max-w-screen-xl mx-auto px-4">
    {products.length === 0 ? (
        <p className="text-center">You have no products.</p>
    ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ms-2 gap-4">
            {products.map((product) => { 
                const productImage = product.images ? product.images[0] : "placeholder.jpg";
                return (
                    <div key={product._id} className="product-card1 shadow p-3 mb-5 mt-3 bg-body rounded border-1 lh-lg">
                        <div className="text-center">
                            <img
                                src={`http://localhost:3000/${productImage}`}
                                alt={product.name}
                                className="w-full h-[150px] object-cover md:h-[200px] lg:h-[250px]"
                            />
                        </div>

                        <div className="text-xl font-medium mt-2">
                            {product.name.slice(0, 20)}{product.name.length > 30 ? '...' : ''}
                        </div>
                        <p className="text-md font-medium">Price: ${parseFloat(product.price).toFixed(2)}</p>
                        <p className="text-md font-medium">Stock: {product.stockQuantity}</p>

                        {/* Display product status and conditionally apply red color if status is 'Block' */}
                        <p
                            className={`text-md font-medium ${product.productStatus === 'Block' ? 'text-red-500' : ''}`}
                        >
                            Stock Status: {product.productStatus}
                        </p>

                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={() => handleEditClick(product._id)}
                                className="addtocartbtn"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => handleDeleteClick(product._id)}
                                className="addtocartbtn"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    )}
</div>


                {/* Show form to edit product */}
                {showForm && (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Update Your Product</h2>
                <button
                    onClick={() => setShowForm(false)}  // Close the form
                    className="text-gray-500 hover:text-gray-700"
                >
                    <i className="fas fa-times"></i> {/* You can use any icon */}
                </button>
            </div>

            <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium">Description</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={formValues.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="price" className="block text-sm font-medium">Price</label>
                    <input
                        type="text"
                        id="price"
                        name="price"
                        value={formValues.price}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="discountPrice" className="block text-sm font-medium">Discount Price</label>
                    <input
                        type="text"
                        id="discountPrice"
                        name="discountPrice"
                        value={formValues.discountPrice}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="stockQuantity" className="block text-sm font-medium">Stock Quantity</label>
                    <input
                        type="number"
                        id="stockQuantity"
                        name="stockQuantity"
                        value={formValues.stockQuantity}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                

                {/* Update Image Checkbox */}
                <div className="mb-4">
                    <label htmlFor="updateImage" className="block text-sm font-medium">Update Image</label>
                    <input
                        type="checkbox"
                        id="updateImage"
                        checked={updateImage}
                        onChange={(e) => setUpdateImage(e.target.checked)}
                    />
                </div>

                {updateImage && (
                   <div className="productForm-field">
                   <label htmlFor="images" className="block text-sm font-medium mb-2">
                     <FontAwesomeIcon icon={faImages} /> Images:
                   </label>
                 
                   {/* Custom file upload div */}
                   <label htmlFor="file" className="custum-file-upload mb-2">
                     <div className="icon">
                       <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                         <path
                           fillRule="evenodd"
                           clipRule="evenodd"
                           d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                         />
                       </svg>
                     </div>
                     <div className="text">
                       <span>Click to upload images</span>
                     </div>
                     <input
                       id="file"
                       type="file"
                       multiple // Allow selecting multiple images
                       accept="image/*" // Restrict to image files only
                       onChange={handleFileChange} // Handle file selection
                       style={{ display: 'none' }} // Hide the default file input
                     />
                   </label>
                 
                   {/* Display the selected files */}
                   {formValues.images.length > 0 && (
                     <div className="selected-files">
                       <p>Selected files:</p>
                       <ul>
                         {formValues.images.map((file, index) => (
                           <li key={index}>{file.name}</li>
                         ))}
                       </ul>
                     </div>
                   )}
                 </div>
                 
                )}

                <div className="mb-4">
                    <button type="submit" className="w-full bg-green-600 text-white p-2 rounded-md mt-3">Update Product</button>
                </div>
            </form>
        </div>
    </div>
)}
            </div>
            <Footer />
        </>
    );
};

export default SettingsPage;
