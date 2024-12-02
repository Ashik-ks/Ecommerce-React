import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate, useParams } from "react-router-dom";
import { useCount } from '../CountContext';
import axios from 'axios';
import { faMagnifyingGlass, faHeart, faCartShopping, faUser, faGift, faCog, faRightToBracket, }
  from "@fortawesome/free-solid-svg-icons";
import purpleLogo from "../../assets/images/purpplelogo.png"; // Adjust the import based on your actual path
import purplejoinElite from "../../assets/images/purplejoinElite.png.gif";

const HeaderComponent = () => {
  const { count } = useCount();
  console.log("count : ", count)
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [isEmailSectionVisible, setIsEmailSectionVisible] = useState(true);
  const [isPasswordSectionVisible, setIsPasswordSectionVisible] = useState(false);
  const [isUserTypeSectionVisible, setIsUserTypeSectionVisible] = useState(true);
  const [isOtpSectionVisible, setIsOtpSectionVisible] = useState(false);
  const [data7, setData7] = useState([]); // State to store fetched data
  const [query, setQuery] = useState(""); // State for search query
  const [filteredResults, setFilteredResults] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const navigate = useNavigate();
  let { id } = useParams();
  let { usertype } = useParams();

  if (!id) {
    id = undefined || 'undefined'
  }

  const openOffcanvas = () => setIsOffcanvasOpen(true);
  const closeOffcanvas = () => setIsOffcanvasOpen(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  // Handle email input
  const handleEmailInput = (enteredEmail) => {
    setEmail(enteredEmail);
    if (enteredEmail.trim() === "admin@gmail.com") {
      setIsPasswordSectionVisible(true); // Show password section for admin
      setIsUserTypeSectionVisible(false); // Hide user type section for admin
    } else {
      setIsPasswordSectionVisible(false); // Hide password section for non-admin
      setIsUserTypeSectionVisible(true); // Show user type section for non-admin
    }
  };

  // Send OTP to the server
  const sendEmailToServer = () => {
    if (email && email !== "admin@gmail.com" && userType) {
      axios
        .post("http://localhost:3000/sendotp", { email, userType })
        .then((response) => {
          if (response.data.statusCode === 200) {
            alert("An OTP has been sent to your email");

            // Hide email and user type input sections
            setIsEmailSectionVisible(false);
            setIsUserTypeSectionVisible(false);

            // Show OTP input field
            setIsOtpSectionVisible(true); // Show OTP section
          } else {
            alert(response.data.message || "Error sending OTP");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Error sending OTP");
        });
    } else {
      alert("Please enter a valid email address and user type");
    }
  };

  // Verify OTP function
  const verifyOtp = () => {
    const otp = document.getElementById("otpInput").value;
    if (otp) {
      axios
        .post("http://localhost:3000/verifyotp", { email, otp })
        .then((response) => {
          if (response.data.statusCode === 200) {
            alert("Login or Registration successful!");

            let tokenkey = response.data.data.tokenid;
            let token = response.data.data.token;

            // Store token in localStorage
            localStorage.setItem(tokenkey, token);
            localStorage.setItem(tokenkey + "_userType", response.data.data.userType);

            const userTypeValue = response.data.data.userType || "Unknown";

            if (response.data.data.userType === "Buyer") {
              navigate(`/index/${tokenkey}/${userTypeValue}`);
              window.location.reload();
            } else if (response.data.data.userType === "Seller") {
              navigate(`/seller/${tokenkey}/${userTypeValue}`);
            }

            closePopup(); // Close the popup
          } else {
            alert("Invalid OTP. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Error verifying OTP");
        });
    } else {
      alert("Please enter the OTP");
    }
  };

  // Admin login logic
  const adminLogin = () => {
    const password = document.getElementById("passwordInput").value;
    if (password) {
      axios
        .post("http://localhost:3000/sendotp", { email, password, userType: "Admin" })
        .then((response) => {
          if (response.data.statusCode === 200) {
            let token = response.data.data.token;
            let tokenkey = response.data.data.id;

            // Store token in localStorage
            localStorage.setItem(tokenkey, token);
            localStorage.setItem(tokenkey + "_userType", response.data.data.userType);

            alert("Admin login successful!");
            window.location.href = `admin.html?id=${tokenkey}/${response.data.data.userType}`;

            closePopup();
          } else {
            alert("Invalid password. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Error during admin login");
        });
    } else {
      alert("Please enter a valid password");
    }
  };

  const handleLogout = () => {
    // Clear user data, session, or perform any necessary logout logic
    setIsLoggedIn(false);
    setUserType(null);
    alert("You have been logged out.");
    navigate(`/`);
    window.location.reload();
  };

  useEffect(() => {
    checkUserStatus();
  }, [id]); // Re-run the effect when 'id' changes

  // Function to check user status based on the 'id'
  const checkUserStatus = () => {
    console.log("Checking user status...");

    if (id) {
      const storedUserType = localStorage.getItem(id + '_userType');
      console.log("Stored user type:", storedUserType);

      if (storedUserType) {
        setUserType(storedUserType);
        setIsLoggedIn(true); // Set user as logged in if a user type is found
      } else {
        setIsLoggedIn(false);
        setUserType(null);
      }
    } else {
      setIsLoggedIn(false);
      setUserType(null); // If no 'id' in the URL, set the user as not logged in
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/getallproducts/${id}`);
        const parsedResponse = await response.json();
        console.log("parsedResponse:", parsedResponse);

        // Ensure the response contains the expected array
        if (parsedResponse.success && Array.isArray(parsedResponse.responseProducts)) {
          setData7(parsedResponse.responseProducts);
        } else {
          setData7([]);  // Default to empty array if no valid products
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setData7([]); // Fallback to empty array on error
      }
    };

    fetchProducts();
  }, [id]);

  const handleSearch = (event) => {
    const query = event.target.value.trim().toLowerCase(); // Update query with the latest input
    setQuery(query); // Set query state

    // Check if data7 is an array before filtering
    if (Array.isArray(data7) && data7.length > 0) {
      console.log("Data7:", data7);  // Log the full array of products
      console.log("Search Query:", query);  // Log the current search query

      // Filter products that match the query
      const results = data7.filter(item => {
        // Check if the product name includes the entire query string progressively
        return item.name.toLowerCase().includes(query);
      });

      // Log the filtered results
      console.log("Filtered Results:", results);

      // If query is empty, reset results to show all products
      if (query === '') {
        setFilteredResults(data7);
      } else {
        setFilteredResults(results);
      }
    } else {
      console.warn("Search attempted with empty or non-array data.");
      setFilteredResults([]); // Clear results if no valid data
    }
  };

  const handleRedirectsearch = (item) => {
    navigate(`/searchpage/${item}/${id}/${usertype}`);
  };


  return (
    <div className="border-b border-gray-300 pb-2">
      {/* First Grid - Hidden until md */}
      <div className="grid md:hidden grid-cols-2 gap-4 pb-2">
        {/* Second Column */}
        <div className="flex items-center justify-start ml-6 mt-3 gap-2">
          <img src={purpleLogo} alt="purplelogo" className="purpplelogo1" />
          <img src={purplejoinElite} alt="Purple Logo" className="PurpleLogoelite" />
        </div>

        {/* Third Column */}
        <div className="flex items-center justify-end gap-3 mr-10 mt-3">
          <span>
            <i className="fa-regular fa-heart pxsmile"></i>
          </span>
          <span className="relative">
            <FontAwesomeIcon
              icon={faCartShopping}
              className=" mt-1 pxsmile"
            />
            {count > 0 && (
              <span
                className="absolute top-0 right-0 bg-indigo-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center text-[10px] transform translate-x-1/2 -translate-y-1/2"
                id="cartcount"
              >
                {count}
              </span>
            )}
          </span>


          <div className="dropdown relative inline-block">
            <span className="dropbtn d-flex gap-3 p-3 text-gray-700 text-sm">
              <i className="fa-regular fa-face-smile pxsmile" />
            </span>
            <div className="dropdown-content hidden">
              <a
                href="#"
                className="flex gap-3 p-3 text-gray-700 text-sm items-center"
              >
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-gray-500 text-lg"
                />
                <button
                  className="dropdowntext ms-2"
                  onClick={(event) => {
                    event.preventDefault(); // Prevents the default button behavior
                    navigate(`/profile/${id}/${usertype}`);
                  }}
                >
                  My Account
                </button>
              </a>
              <a
                href="#"
                className="flex gap-3 p-3 text-gray-700 text-sm items-center"
              >
                <FontAwesomeIcon
                  icon={faGift}
                  className="text-gray-500 text-lg"
                />
                <span className="dropdowntext ms-2">Orders</span>
              </a>
              <a
                href="#"
                className="flex gap-3 p-3 text-gray-700 text-sm items-center"
              >
                <FontAwesomeIcon
                  icon={faHeart}
                  className="text-gray-500 text-lg"
                />
                <span className="dropdowntext ms-2">Wishlist</span>
              </a>
              {usertype === 'Seller' && (
                <a
                  href="#"
                  className="flex gap-3 p-3 text-gray-700 text-sm items-center"
                >
                  <FontAwesomeIcon
                    icon={faCog}
                    className="text-gray-500 text-lg"
                  />
                  <span className="dropdowntext ms-2" onClick={(event) => {
                    event.preventDefault();
                    navigate(`/settings/${id}/${usertype}`);
                  }}>Settings</span>
                </a>
              )}

              {isLoggedIn ? (
                <div
                  className="logout flex gap-3 p-3 text-gray-700 text-sm items-center"
                  id="logout"
                >
                  <span>
                    <FontAwesomeIcon
                      icon={faRightToBracket}
                      className="text-gray-500 text-lg ms-1"
                    />
                  </span>
                  <button
                    className="loginbtn border-0 w-full text-left text-gray-500"
                    onClick={() => alert("Logging out...")}
                  >
                    <span className="text-xs text-gray-700">Log Out</span>
                  </button>
                </div>
              ) : (
                <div
                  className="login flex gap-3 p-3 text-gray-700 text-sm items-center"
                  id="login"
                >
                  <span>
                    <FontAwesomeIcon
                      icon={faRightToBracket}
                      className="text-gray-500 text-lg ms-1"
                    />
                  </span>
                  <button
                    className="loginbtn border-0 text-gray-500"
                    onClick={openPopup}
                  >
                    <span className="logintext text-gray-700">
                      Login or Register
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>



      <div className="container mx-auto px-4 ">
        {/* Grid Section */}
        <div className=" pt-2 pb-2">
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* First Column */}
            <div className="">
              <button
                id="toggleButton"
                className="bg-white border-0 pixelsearch"
                type="button"
                onClick={openOffcanvas}
              >
                <div className="searchdiv pb-1 flex gap-4" id="searchDiv">
                  <span className="searchtext ms-2 text-gray-500 text-lg">
                    What are you looking for?
                  </span>
                  <span>
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      className="text-gray-500 text-md"
                    />
                  </span>
                </div>
              </button>
            </div>

            {/* Second Column */}
            <div className="flex gap-3 items-center justify-center ml-10 hidden md:flex">
              <img src={purpleLogo} alt="purplelogo" className="purpplelogo" />
              <img src={purplejoinElite} alt="Purple Logo" className="PurpleLogoelite" />

            </div>

            {/* Third Column */}
            <div className="flex items-center justify-end gap-5 mr-10 hidden md:flex">
              <span>
                <i class="fa-regular fa-heart text-2xl"></i>
              </span>
              <span className="relative">
                <FontAwesomeIcon
                  icon={faCartShopping}
                  className="icon-smile mt-1"
                />
                {count > 0 && (
                  <span
                    className="absolute top-0 right-0 bg-indigo-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center text-[10px] transform translate-x-1/2 -translate-y-1/2"
                    id="cartcount"
                  >
                    {count}
                  </span>
                )}
              </span>


              <div className="dropdown relative inline-block">
                <span className="dropbtn d-flex gap-3 p-3 text-gray-700 text-sm">
                  <i className="fa-regular fa-face-smile icon-smile" />
                </span>
                <div className="dropdown-content hidden">
                  <a
                    href="#"
                    className="flex gap-3 p-3 text-gray-700 text-sm items-center"
                  >
                    <FontAwesomeIcon icon={faUser} className="text-gray-500 text-lg" />
                    <button
                      className="dropdowntext ms-2"
                      onClick={(event) => {
                        event.preventDefault(); // Prevents the default button behavior
                        navigate(`/profile/${id}/${usertype}`);
                      }}
                    >
                      My Account
                    </button>
                  </a>
                  <a
                    href="#"
                    className="flex gap-3 p-3 text-gray-700 text-sm items-center"
                  >
                    <FontAwesomeIcon icon={faGift} className="text-gray-500 text-lg" />
                    <span className="dropdowntext ms-2">Orders</span>
                  </a>
                  <a
                    href="#"
                    className="flex gap-3 p-3 text-gray-700 text-sm items-center"
                  >
                    <FontAwesomeIcon icon={faHeart} className="text-gray-500 text-lg" />
                    <span className="dropdowntext ms-2">Wishlist</span>
                  </a>
                  {usertype === 'Seller' && (
                    <a
                      href="#"
                      className="flex gap-3 p-3 text-gray-700 text-sm items-center"
                    >
                      <FontAwesomeIcon
                        icon={faCog}
                        className="text-gray-500 text-lg"
                      />
                      <span className="dropdowntext ms-2" onClick={(event) => {
                        event.preventDefault();
                        navigate(`/settings/${id}/${usertype}`);
                      }} >Settings</span>
                    </a>
                  )}

                  {isLoggedIn ? (
                    <div className="logout flex gap-3 p-3 text-gray-700 text-sm items-center" id="logout">
                      <span>
                        <FontAwesomeIcon icon={faRightToBracket} className="text-gray-500 text-lg ms-1" />
                      </span>
                      <button
                        className="loginbtn border-0 w-full text-left text-gray-500"
                        onClick={handleLogout} // Logout action
                      >
                        <span className="text-xs text-gray-700">Log Out</span>
                      </button>
                    </div>
                  ) : (
                    <div className="login flex gap-3 p-3 text-gray-700 text-sm items-center" id="login">
                      <span>
                        <FontAwesomeIcon icon={faRightToBracket} className="text-gray-500 text-lg ms-1" />
                      </span>
                      <button
                        className="loginbtn border-0 text-gray-500"
                        onClick={openPopup} // Open login/register popup
                      >
                        <span className="logintext text-gray-700">Login or Register</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Offcanvas */}
        {isOffcanvasOpen && (
          <div
            className="fixed top-0 left-0 w-full bg-white z-50 border border-gray-300 shadow-lg"
            tabIndex={-1}
            id="offcanvasTop"
            aria-labelledby="offcanvasTopLabel"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">

              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onClick={closeOffcanvas}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-4 overflow-y-auto">
              <div className="mb-4">
                <span className="block text-gray-600 text-sm font-medium">
                  Search for Products and Brands
                </span>
              </div>

              {/* Search Section */}
              <div className="flex flex-col  items-start gap-2 border border-gray-300 rounded-md p-2">
                <div className="container1">
                  <input
                    type="text"
                    id="input"
                    className="input w-full px-2 py-1 bg-black text-white border-none focus:ring-0 text-sm placeholder-gray-400"
                    placeholder="Search products..."
                    value={query}
                    onChange={handleSearch}
                  />
                  <i></i>
                </div>
                <div id="result" className="w-full mt-2 ms-3">
                  {/* Render filtered results */}
                  {filteredResults.length > 0 ? (
                    filteredResults.map((result) => (
                      <div key={result._id}>
                        {/* Wrap result.name with an onClick handler */}
                        <p
                          onClick={() => handleRedirectsearch(result._id)}
                          style={{
                            cursor: "pointer",
                            color: "black",
                            transition: "color 0.3s ease, font-size 0.3s ease",  // Transition for color and font-size
                            fontSize: "16px", // Initial font size
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.color = "#7C3AED"; // Change color on hover
                            e.target.style.fontSize = "18px"; // Increase font size on hover
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = "black"; // Revert color on mouse leave
                            e.target.style.fontSize = "16px"; // Revert font size
                          }}
                        >
                          {result.name}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>No results found</p> // If no results match the query
                  )}
                </div>






              </div>


            </div>
          </div>
        )}

        {/* Popup */}
        {isPopupOpen && (
          <div className="popup fixed inset-0 z-50 flex justify-center items-center">
            <div
              className="popup-content bg-white rounded-lg p-6 w-full max-w-lg min-w-[320px] shadow-lg flex flex-col justify-between relative"
              onClick={(e) => e.stopPropagation()} // Prevent popup click closing it
            >
              {/* Close Button */}
              <span
                className="close absolute top-0 right-1 text-3xl cursor-pointer"
                onClick={closePopup}
              >
                ×
              </span>

              {/* Coupon Banner */}
              <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-4 items-center justify-center mb-6">
                <div className="text-center p-3">
                  <p className="text-lg font-medium">FLAT ₹100 OFF on order above ₹999+</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium">USE CODE: APPFIRST</p>
                </div>
              </div>

              {/* Email Section */}
              {isEmailSectionVisible && (
                <div id="emailSection">
                  <h2 className="text-center text-lg font-medium mb-3 mt-3">Login or Signup</h2>
                  <input
                    id="emailInput"
                    type="text"
                    placeholder="Enter Your Email"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                    value={email}
                    onChange={(e) => {
                      const enteredEmail = e.target.value;
                      handleEmailInput(enteredEmail); // Call dynamically as email input changes
                    }}
                  />
                </div>
              )}

              {/* Password Section (only for admin) */}
              {isPasswordSectionVisible && (
                <div id="passwordSection" className="mb-4">
                  <input
                    id="passwordInput"
                    type="password"
                    placeholder="Enter Password"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                  />
                  <button
                    className="w-full p-3 bg-gray-200 text-gray-500 font-medium rounded-lg"
                    onClick={adminLogin}
                  >
                    LOGIN AS ADMIN
                  </button>
                </div>
              )}

              {/* User Type Section (for non-admin) */}
              {isUserTypeSectionVisible && email !== "admin@gmail.com" && (
                <>
                  <select
                    id="selectbox"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg mb-4 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)} // Update userType state
                  >
                    <option value="" disabled selected className="text-gray-500">
                      Select User Type
                    </option>
                    <option value="Buyer">Buyer</option>
                    <option value="Seller">Seller</option>
                  </select>

                  {/* Continue Button */}
                  <button
                    id="continueButton"
                    className="w-full p-3 bg-gray-200 text-gray-500 font-medium rounded-lg"
                    onClick={sendEmailToServer}
                  >
                    CONTINUE
                  </button>
                </>
              )}

              {/* OTP Input Section */}
              {isOtpSectionVisible && (
                <div id="otpSection">
                  <h2 className="text-center text-lg font-medium mb-3 mt-3">Enter OTP</h2>
                  <input
                    id="otpInput"
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                  />
                  <button
                    className="w-full p-3 bg-gray-200 text-gray-500 font-medium rounded-lg"
                    onClick={verifyOtp}
                  >
                    VERIFY OTP
                  </button>
                </div>
              )}
              <p className="text-xs text-center text-gray-500 mt-4">
                By creating an account or logging in, you agree to Purplle's
                <a href="#" className="text-blue-500 hover:underline">
                  Terms of Use
                </a>{" "}
                and
                <a href="#" className="text-blue-500 hover:underline">
                  Privacy Policy
                </a>{" "}
                and consent to the collection and use of your personal information/sensitive
                personal data or information.
              </p>

            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default HeaderComponent;




