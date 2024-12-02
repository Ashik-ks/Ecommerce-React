import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InnerPagesNav from "../nav/innerpagesnav";
import Footer from "../footer/footer";

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

                const response = await fetch(`http://localhost:3000/getsellerproduct/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch products. Status: ${response.status}`);
                }

                const parsedResponse = await response.json();
                if (parsedResponse.success) {
                    setProducts(parsedResponse.data || []);
                } else {
                    throw new Error(parsedResponse.message || "No products found for this seller.");
                }
            } catch (error) {
                setError(error.message);
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
            const response = await fetch(`http://localhost:3000/getproductdataedit/${id}/${productId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            const product = await response.json();
            console.log("response : ",product)
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
            alert("An error occurred while fetching product data.");
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
            images: formValues.images ? await convertImagesToBase64(formValues.images) : productData.images || []
        };
    
        try {
            const response = await fetch(`http://localhost:3000/editproduct/${productData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
    
            const result = await response.json();
            if (response.ok) {
                alert("Product updated successfully!");
                setShowForm(false); // Close the form after successful update
            } else {
                alert(result.message || "Failed to update the product.");
            }
        } catch (error) {
            console.error("Error updating product:", error);
            alert("An error occurred while updating the product.");
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
        
        if (files && files.length > 0) {
            const imageFiles = Array.from(files).filter(file => file.type.startsWith("image/"));
            
            if (imageFiles.length > 0) {
                setFormValues(prevValues => ({
                    ...prevValues,
                    images: imageFiles
                }));
            } else {
                alert("Please select only image files.");
            }
        } else {
            // Reset the images array if no files are selected
            setFormValues(prevValues => ({
                ...prevValues,
                images: []
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
    

    
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <>
            <InnerPagesNav />
            <div className="pt-5 pb-5 bg-slate-200">
                <h1 className="text-3xl font-bold text-center text-purple-600 mb-4">Purple.com</h1>
                <h1 className="text-3xl font-bold text-center text-purple-600 mb-6">Seller Dashboard</h1>

                <div className="border border-gray-300 p-5 bg-white flex justify-between w-full max-w-screen-xl mx-auto px-4 py-6">
                    <div className="">
                        <h2 className="font-bold text-xl">Bring Your Products to Life!</h2>
                        <p className="text-gray-500 mt-2">Share your amazing products with our community! Complete the form below to add a new item to our store.</p>
                    </div>
                    <button
                        className="bg-black text-white flex items-center gap-2 py-2 px-4 rounded-md hover:bg-gray-800"
                        onClick={() => navigate(`/addproduct/${id}/${usertype}`)}
                    >
                        Add Products
                        <i className="fas fa-arrow-right"></i>
                    </button>
                </div>

                <div className="max-w-screen-xl mt-10 mb-3 mx-auto text-3xl font-bold text-center underline decoration-black">
                    Your Products
                </div>

                <div className="container max-w-screen-xl mx-auto px-4">
                    {products.length === 0 ? (
                        <p className="text-center">You have no products.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {products.map((product) => {
                                const productImage = product.images ? product.images[0] : "placeholder.jpg";
                                return (
                                    <div key={product._id} className="product-card shadow p-3 mb-5 mt-3 bg-body rounded border-1 lh-lg">
                                        <div className="text-center">
                                            <img src={`http://localhost:3000/${productImage}`} alt={product.name} className="w-full h-38 object-cover" />
                                        </div>
                                        <div className="text-xl font-medium mt-2">
                                            {product.name.slice(0, 20)}{product.name.length > 30 ? '...' : ''}
                                        </div>
                                        <p className="text-md font-medium">Price: ${parseFloat(product.price).toFixed(2)}</p>
                                        <p className="text-md font-medium">Stock: {product.stockQuantity}</p>
                                        <p className="text-md font-medium">{product.stockStatus}</p>
                                        <div className="flex justify-center mt-2">
                                            <button
                                                className="addtocartbtn mt-2"
                                                onClick={() => handleEditClick(product._id)}
                                            >
                                                Update
                                                <i className="fa fa-pencil-square-o fs-4" aria-hidden="true"></i>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {showForm && (
                        <div className="overlay" onClick={() => setShowForm(false)}>
                           <div className="popup-form bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto relative">
    <form onSubmit={handleFormSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center mb-4 text-purple-600">Edit Product</h2>
        
        {/* Description */}
        <div>
            <label htmlFor="editdescription" className="block text-sm font-medium text-gray-700">
                Description:
            </label>
            <textarea
                id="editdescription"
                name="description"
                value={formValues.description}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                rows="3"
                placeholder="Enter product description"
            ></textarea>
        </div>
        
        {/* Price */}
        <div>
            <label htmlFor="editprice" className="block text-sm font-medium text-gray-700">
                Price:
            </label>
            <input
                type="number"
                id="editprice"
                name="price"
                value={formValues.price}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                placeholder="Enter product price"
            />
        </div>

        {/* Discount Price */}
        <div>
            <label htmlFor="editdiscountPrice" className="block text-sm font-medium text-gray-700">
                Discount Price:
            </label>
            <input
                type="number"
                id="editdiscountPrice"
                name="discountPrice"
                value={formValues.discountPrice}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                placeholder="Enter discount price (optional)"
            />
        </div>

        {/* Stock Quantity */}
        <div>
            <label htmlFor="editstockQuantity" className="block text-sm font-medium text-gray-700">
                Stock Quantity:
            </label>
            <input
                type="number"
                id="editstockQuantity"
                name="stockQuantity"
                value={formValues.stockQuantity}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                placeholder="Enter stock quantity"
            />
        </div>

        {/* Product Images */}
        <div>
            <label htmlFor="editimages" className="block text-sm font-medium text-gray-700">
                Product Images:
            </label>
            <input
                type="file"
                id="editimages"
                name="images"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
            />
        </div>

        {/* Submit Button */}
        <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
            } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
        >
            {loading ? "Updating..." : "Update Product"}
        </button>
    </form>
    {/* Close Button */}
    <button
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        onClick={() => setShowForm(false)}
    >
        <i className="fas fa-times"></i>
    </button>
</div>

                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SettingsPage;
