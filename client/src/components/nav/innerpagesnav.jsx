import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate, useParams } from "react-router-dom";
import { useCount } from '../CountContext';
import axios from 'axios';
import { faMagnifyingGlass, faHeart, faCartShopping, faUser, faGift, faCog, faRightToBracket, }
  from "@fortawesome/free-solid-svg-icons";
import purpleLogo from "../../assets/images/purpplelogo.png";
import purplejoinElite from "../../assets/images/purplejoinElite.png.gif";


function InnerPagesNav() {
  const { count } = useCount();
  console.log("count: ", count)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [isEmailSectionVisible, setIsEmailSectionVisible] = useState(true);
  const [isPasswordSectionVisible, setIsPasswordSectionVisible] = useState(false);
  const [isUserTypeSectionVisible, setIsUserTypeSectionVisible] = useState(true);
  const [isOtpSectionVisible, setIsOtpSectionVisible] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);


  const navigate = useNavigate();
  const { id } = useParams();
  let { usertype } = useParams();


  const handleLogout = () => {
    // Clear user data, session, or perform any necessary logout logic
    setIsLoggedIn(false);
    setUserType(null);
    alert("You have been logged out.");
    navigate(`/`);
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

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

            if (response.data.data.userType === "Buyer") {
              navigate(`/index/${tokenkey}/${response.data.data.userType}`);
            } else if (response.data.data.userType === "Seller") {
              navigate(`/seller/${tokenkey}/${response.data.data.userType}`);
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
            window.location.href = `admin.html?id=${tokenkey}`;
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

  const handleItemClick = (item) => {
    const itemParam = encodeURIComponent(JSON.stringify(item));
    // Navigate to the category page with the item and user ID as query params
    navigate(`/category/${itemParam}/${id}/${usertype}`);
  };


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/category");
        const data = response.data;
        if (data && data.data && data.data.length > 0) {
          setCategoriesData(data.data);
        } else {
          console.error("No categories found");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);



  return (
    <>
      <div className="border-b border-gray-300 pt-1 pb-2">

        <div className="grid lg:hidden grid-cols-2 gap-4 pb-2 border-b border-gray-300 pt-2 pb-2">
          {/* Second Column */}
          <div className="flex items-center justify-start ml-6 mt-3 gap-2" onClick={() => navigate(`/index/${id}/${usertype}`)}>
            <img src={purpleLogo} alt="purplelogo" className="purpplelogo1" />
            <img src={purplejoinElite} alt="Purple Logo" className="PurpleLogoelite" />
          </div>

          {/* Third Column */}
          <div className="flex items-center justify-end gap-3 mr-10 mt-3">
            <span onClick={(e) => {
    e.preventDefault();
    navigate(`/wishlist/${id}/${usertype}`);
  }}>
              <i className="fa-regular fa-heart pxsmile"></i>
            </span>
            <span className="relative" onClick={(e) => {
    e.preventDefault();
    navigate(`/cart/${id}/${usertype}`);
  }}>
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
                  </button>                               </a>
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
                  <span className="dropdowntext ms-2"  onClick={(event) => {
                      event.preventDefault(); 
                      navigate(`/wishlist/${id}/${usertype}`);
                    }}>Wishlist</span>
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

        <div className="container mt-3">
          <div className="grid grid-cols-12 items-center">
            {/* First Div: Logo Section */}
            <div className="col-span-3  flex items-center justify-center hidden lg:flex" onClick={() => navigate(`/index/${id}/${usertype}`)}>
              <button className="flex items-center gap-2 border-0">
                <img
                  src={purpleLogo}
                  alt="purplelogo"
                  className="h-8 object-contain"
                />
                <img
                  src={purplejoinElite}
                  alt="purpleElite"
                  className="h-8 object-contain"
                />
              </button>
            </div>

            {/* Middle Div: Navigation Section */}
            <div className="col-span-9 lg:col-span-7 sm:col-span-12  NavigationBar flex flex-wrap items-center justify-around lg:space-x-4">
              <div
                className="relative group flex-shrink-0"
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
              >
                <span className="secondnavtext text-gray-800 cursor-pointer hover:text-blue-500 transition-colors">
                  SHOP CATEGORIES
                </span>
                {showCategories && (
                  <div className="itemsdiv absolute top-full left-0 w-[800px] bg-white border border-gray-200 shadow-lg z-10 p-4">
                    <div className="flex flex-col">
                      <div className="flex flex-wrap sm:space-x-4 mb-4">
                        {categoriesData.map((category) => (
                          <div
                            key={category._id}
                            className={`category px-2 cursor-pointer text-gray-700 hover:bg-gray-100 transition-colors duration-300 ${hoveredCategory && hoveredCategory._id === category._id ? "bg-gray-100" : ""
                              }`}
                            onMouseEnter={() => setHoveredCategory(category)}
                          >
                            {category.name}
                          </div>
                        ))}
                      </div>
                      <div className="w-full">
                        {hoveredCategory && (
                          <div className="bg-white p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                              {hoveredCategory.subcategories.map((subcategory) => (
                                <div
                                  key={subcategory._id}
                                  className="hover:bg-gray-100 transition-colors duration-300"
                                >
                                  <h4 className="font-semibold text-lg text-gray-800 mb-3">
                                    {subcategory.name}
                                  </h4>
                                  <ul className="space-y-2">
                                    {subcategory.items.map((item) => (
                                      <li
                                        key={item._id}
                                        className="text-sm text-gray-600 hover:text-blue-500 cursor-pointer transition-colors duration-300"
                                        onClick={() => handleItemClick(item)}
                                      >
                                        {item.name}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <span className="secondnavtext cursor-pointer lg:py-3 lg:px-4 text-gray-800 hover:text-blue-500 transition-colors">
                OFFERS
              </span>
              <span className="secondnavtext cursor-pointer lg:py-3 lg:px-4 text-gray-800 hover:text-blue-500 transition-colors">
                NEW
              </span>
              <span className="secondnavtext cursor-pointer lg:py-3 lg:px-4 text-gray-800 hover:text-blue-500 transition-colors">
                SPLURGE
              </span>
              <span className="secondnavtext cursor-pointer lg:py-3 lg:px-4 text-gray-800 hover:text-blue-500 transition-colors">
                MAGAZINE
              </span>
              <span className="secondnavtext cursor-pointer lg:py-3 lg:px-4 text-gray-800 hover:text-blue-500 transition-colors">
                ELITE OFFERS
              </span>
            </div>

            {/* Third Div: User Section */}
            <div className="col-span-1 lg:col-span-2  flex items-center justify-center gap-5 hidden lg:flex">
              <span onClick={(e) => {
    e.preventDefault();
    navigate(`/wishlist/${id}/${usertype}`);
  }}>
                <i className="fa-regular fa-heart text-2xl"></i>
              </span>
              <span className="relative" onClick={(e) => {
    e.preventDefault();
    navigate(`/cart/${id}/${usertype}`);
  }}>
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
                  <a href="#" className="flex gap-3 p-3 text-gray-700 text-sm items-center">
                    <FontAwesomeIcon icon={faUser} className="text-gray-500 text-lg" />
                    <button className="dropdowntext ms-2">My Account</button>
                  </a>
                  <a href="#" className="flex gap-3 p-3 text-gray-700 text-sm items-center">
                    <FontAwesomeIcon icon={faGift} className="text-gray-500 text-lg" />
                    <span className="dropdowntext ms-2">Orders</span>
                  </a>
                  <a href="#" className="flex gap-3 p-3 text-gray-700 text-sm items-center">
                    <FontAwesomeIcon icon={faHeart} className="text-gray-500 text-lg" />
                    <span className="dropdowntext ms-2" onClick={(event) => {
                      event.preventDefault();
                      navigate(`/wishlist/${id}/${usertype}`);
                    }}>Wishlist</span>
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
                      <span className="dropdowntext ms-2">Settings</span>
                    </a>
                  )}

                  {isLoggedIn ? (
                    <div className="logout flex gap-3 p-3 text-gray-700 text-sm items-center" id="logout">
                      <span>
                        <FontAwesomeIcon icon={faRightToBracket} className="text-gray-500 text-lg ms-1" />
                      </span>
                      <button
                        className="loginbtn border-0 w-full text-left text-gray-500"
                        onClick={handleLogout}
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
                        onClick={openPopup}
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
    </>
  )
}
export default InnerPagesNav;







