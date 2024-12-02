import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InnerPagesNav from "../nav/innerpagesnav";
import Footer from "../footer/footer";

const AddressComponent = () => {
  const { id } = useParams(); // Extract `id` from URL params
  let { usertype } = useParams();
  const navigate = useNavigate(); // Use navigate for navigation
  const [addresses, setAddresses] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [message, setMessage] = useState(""); // Message to show feedback after operation


  const handleAddAddressClick = () => {
    // Toggle form visibility
    setFormVisible(prevState => !prevState);
  };

  // Fetch addresses on component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!id) {
        setMessage("User ID is missing in the URL.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/user/${id}`);
        const result = await response.json();
        if (result.success && result.statuscode === 200) {
          const user = result.data;
          setAddresses(user.address || []);
          setLoading(false);
        } else {
          console.error("Failed to fetch user data:", result.message);
          setMessage(result.message || "Error fetching data.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setMessage("Error fetching address details.");
        setLoading(false);
      }
    };
    fetchAddresses();
  }, [id]); // Dependency on `id` to refetch if it changes



  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    const street = event.target.street.value;
    const city = event.target.city.value;
    const state = event.target.state.value;
    const country = event.target.country.value;
    const pincode = event.target.pincode.value;
    const landmark = event.target.landmark.value;
    const phonenumber = event.target.phonenumber.value;
  
    const body = { street, city, state, country, pincode, landmark, phonenumber };
  
    try {
      if (selectedAddress) {
        // Update existing address
        const addressIndex = addresses.findIndex(address => address.id === selectedAddress.id);
  
        if (addressIndex === -1) {
          alert("Address not found.");
          return;
        }
  
        // Update the address via PUT request
        const response = await fetch(`http://localhost:3000/updateaddress/${id}/${addressIndex}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
  
        const result = await response.json();
        if (response.ok) {
          // Update the address in the state
          setAddresses(addresses.map((address, index) =>
            index === addressIndex ? { ...address, ...body } : address
          ));
          alert("Address updated successfully");
  
          // Reload the page to reflect the updates
          window.location.reload();
        } else {
          alert("Error updating address: " + result.message);
        }
      } else {
        // Add new address
        const response = await fetch(`http://localhost:3000/addaddress/${id}`, {
          method: "POST", // POST for adding a new address
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
  
        const result = await response.json();
        if (response.ok) {
          // Add the new address to the state
          setAddresses([...addresses, result.data]);
          alert("Address added successfully");
  
          // Reload the page to reflect the new address
          window.location.reload();
        } else {
          alert("Error adding address: " + result.message);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing the request.");
    }
  };
  
  
  
  
  const handleAddressEdit = (index) => {
    setSelectedAddress(addresses[index]);
    setFormVisible(true);
    setMessage(""); // Clear any previous message
  };

  const handleAddressDelete = async (index) => {
    try {
      // Ensure that the address index is valid
      if (index < 0 || index >= addresses.length) {
        setMessage("Invalid address index.");
        return;
      }
  
      // Get the user ID and address index
      console.log("Deleting address with userId:", id, " and index:", index);  // Debugging
  
      // Send DELETE request with userId and address index
      const response = await fetch(`http://localhost:3000/deleteaddress/${id}/${index}`, {
        method: "DELETE",
      });
  
      const result = await response.json();
      if (response.ok) {
        // Remove address from state if deletion was successful
        setAddresses(addresses.filter((_, i) => i !== index));
        setMessage(result.message || "Address deleted successfully");
      } else {
        setMessage(result.message || "Error deleting address.");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      setMessage("An error occurred while deleting the address.");
    }
  };
  
  
  

  return (
    <>
      <InnerPagesNav />
      <div className="container mx-auto min-h-screen flex justify-center">
  <div className="contentarea w-full max-w-2xl p-6 flex flex-col mx-auto border rounded-lg shadow-lg bg-white">
    {/* Back to Home and Add Address Buttons */}
    <div className="flex flex-col w-full mb-6 gap-4">
      <button
        className="text-black text-lg flex items-center gap-2 hover:text-blue-600 transition-colors"
        onClick={() => navigate(`/index/${id}`)}
      >
        <i className="fa fa-home" aria-hidden="true"></i>
        Back to Home
      </button>
      <button
        className="flex items-center gap-2 text-black py-1 px-1 rounded-lg  transition-colors"
        onClick={handleAddAddressClick}
      >
        <i className="fas fa-plus-circle text-xl"></i>
        <span className="text-xl">Add Address</span>
      </button>
    </div>

    {/* Feedback Message */}
    {message && (
      <div className="alert alert-info bg-blue-100 text-blue-700 p-4 rounded-lg">
        {message}
      </div>
    )}

    {formVisible ? (
      // Address Form
      <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
        <input
          type="text"
          name="street"
          className="form-control p-3 border border-gray-300 rounded-lg w-full"
          placeholder="Street Address *"
          required
          defaultValue={selectedAddress?.street || ""}
        />
        <input
          type="text"
          name="city"
          className="form-control p-3 border border-gray-300 rounded-lg w-full"
          placeholder="City *"
          required
          defaultValue={selectedAddress?.city || ""}
        />
        <input
          type="text"
          name="state"
          className="form-control p-3 border border-gray-300 rounded-lg w-full"
          placeholder="State *"
          required
          defaultValue={selectedAddress?.state || ""}
        />
        <input
          type="text"
          name="country"
          className="form-control p-3 border border-gray-300 rounded-lg w-full"
          placeholder="Country *"
          required
          defaultValue={selectedAddress?.country || ""}
        />
        <input
          type="text"
          name="pincode"
          className="form-control p-3 border border-gray-300 rounded-lg w-full"
          placeholder="Pincode *"
          required
          defaultValue={selectedAddress?.pincode || ""}
        />
        <input
          type="text"
          name="landmark"
          className="form-control p-3 border border-gray-300 rounded-lg w-full"
          placeholder="Landmark *"
          required
          defaultValue={selectedAddress?.landmark || ""}
        />
        <input
          type="text"
          name="phonenumber"
          className="form-control p-3 border border-gray-300 rounded-lg w-full"
          placeholder="Phone Number *"
          required
          defaultValue={selectedAddress?.phonenumber || ""}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {selectedAddress ? "Update Address" : "Add Address"}
        </button>
      </form>
    ) : (
      <div className="text-center">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="mt-7 pt-3 pb-3">
            {addresses.length === 0 ? (
              <>
                <i className="fas fa-frown text-gray-500 text-4xl mt-3 mb-3"></i>
                <p className="text-gray-600 mt-5 mb-5">
                  You have no saved addresses yet.
                </p>
              </>
            ) : (
              <div className="flex flex-col gap-4">
                {addresses.map((address, index) => (
                  <div
                    key={index}
                    className="border border-gray-300 p-4 rounded-lg shadow-sm"
                  >
                    <span className="text-lg font-semibold">
                      Address {index + 1}
                    </span>
                    <p className="text-gray-700 mt-1">
                      {`${address.street}, ${address.city}, ${address.state}, ${address.country}`}
                    </p>
                    <p className="text-gray-700">Pincode: {address.pincode}</p>
                    <p className="text-gray-700">Landmark: {address.landmark}</p>
                    <p className="text-gray-700">Phone: {address.phonenumber}</p>
                    <div className="flex gap-4 mt-4 justify-center">
                      <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition-colors"
                        onClick={() => handleAddressEdit(index)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 transition-colors"
                        onClick={() => handleAddressDelete(index)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    )}
  </div>
</div>


<Footer/>

    </>
  );
};

export default AddressComponent;
