
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import InnerPagesNav from "../nav/innerpagesnav";
import Footer from "../footer/footer";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");
  const [isEmailSectionVisible, setIsEmailSectionVisible] = useState(true);
  const [isPasswordSectionVisible, setIsPasswordSectionVisible] = useState(false);
  const [isUserTypeSectionVisible, setIsUserTypeSectionVisible] = useState(true);
  const [isOtpSectionVisible, setIsOtpSectionVisible] = useState(false);

  const navigate = useNavigate();
  let { id } = useParams();

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3000/user/${id}`)
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [id]);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleEmailInput = (enteredEmail) => {
    setEmail(enteredEmail);
    if (enteredEmail.trim() === "admin@gmail.com") {
      setIsPasswordSectionVisible(true);
      setIsUserTypeSectionVisible(false);
    } else {
      setIsPasswordSectionVisible(false);
      setIsUserTypeSectionVisible(true);
    }
  };

  const sendEmailToServer = () => {
    if (email && email !== "admin@gmail.com" && userType) {
      axios
        .post("http://localhost:3000/sendotp", { email, userType })
        .then((response) => {
          if (response.data.statusCode === 200) {
            alert("An OTP has been sent to your email");
            setIsEmailSectionVisible(false);
            setIsUserTypeSectionVisible(false);
            setIsOtpSectionVisible(true);
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

  const verifyOtp = () => {
    const otp = document.getElementById("otpInput").value;
    if (otp) {
      axios
        .post("http://localhost:3000/verifyotp", { email, otp })
        .then((response) => {
          setUserData(response.data);
          if (response.data.statusCode === 200) {
            alert("Login or Registration successful!");

            const { tokenid, token, userType } = response.data.data;

            localStorage.setItem(tokenid, token);
            localStorage.setItem(`${tokenid}_userType`, userType);

            if (userType === "Buyer") {
              navigate(`/index/${tokenid}`);
              window.location.reload();
            } else if (userType === "Seller") {
              navigate(`/seller/${tokenid}`);
            }

            closePopup();
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

  const adminLogin = () => {
    const password = document.getElementById("passwordInput").value;
    if (password) {
      axios
        .post("http://localhost:3000/sendotp", { email, password, userType: "Admin" })
        .then((response) => {
          if (response.data.statusCode === 200) {
            const { token, id, userType } = response.data.data;

            localStorage.setItem(id, token);
            localStorage.setItem(`${id}_userType`, userType);

            alert("Admin login successful!");
            window.location.href = `admin.html?id=${id}`;
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

  return (
    <>
      <InnerPagesNav />
      <div className="div border-b border-gray-300 pb-4">
  <div className="contentdiv w-1/2 mx-auto bg-white shadow-lg rounded-lg ">
    {id === undefined || id === 'undefined' ? (
      <div className="border-b-2 p-4">
        <h1 className="text-xl font-semibold">Hey there!</h1>
        <p className="text-gray-500">Login/Signup to manage your orders and more</p>
        <button
          className="mt-2 w-full py-2 text-xl bg-blue-600 text-white rounded-md"
          onClick={openPopup}
        >
          Login/Signup
        </button>
      </div>
    ) : (
      <div className="border-b-2 p-4">
        <h1 className="text-xl font-semibold">Welcome, {userData?.data?.name || "User"}!</h1>
        <p className="text-gray-500">{userData?.data?.email || "Email not available"}</p>
      </div>
    )}

    <div className="flex justify-between items-center p-4">
      <div className="flex items-center">
        <span className="bg-gray-200 p-2 rounded-full">
          <i className="fas fa-box-open text-gray-600"></i>
        </span>
        <div className="ml-3" >
          <h6 className="font-semibold mb-1">My Orders</h6>
          <p className="text-gray-500 text-sm">Track, cancel and return orders</p>
        </div>
      </div>
      <i className="fas fa-chevron-right text-gray-500"></i>
    </div>
    <div className="flex justify-between items-center p-4 bg-gray-100">
      <div className="flex items-center">
        <span className="bg-gray-200 p-2 rounded-full">
          <i className="fas fa-headset text-gray-600"></i>
        </span>
        <div className="ml-3">
          <h6 className="font-semibold mb-1">Customer Support</h6>
          <p className="text-gray-500 text-sm">Help regarding your purchase</p>
        </div>
      </div>
      <i className="fas fa-chevron-right text-gray-500"></i>
    </div>
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center">
        <span className="bg-gray-200 p-2 rounded-full">
          <i className="fas fa-crown text-gray-600"></i>
        </span>
        <div className="ml-3">
          <h6 className="font-semibold mb-1">Elite Membership</h6>
          <p className="text-gray-500 text-sm">Offers and rewards</p>
        </div>
      </div>
      <a href="#" className="text-blue-600">Explore</a>
    </div>
    <div className="border-t-2">
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center">
        <span className="bg-gray-200 p-2 rounded-full">
          <i className="fas fa-heart text-gray-600"></i>
        </span>
        <div className="ml-3">
          <h6 className="font-semibold mb-1">My Wishlist</h6>
          <p className="text-gray-500 text-sm">Your favourite products</p>
        </div>
      </div>
      <i className="fas fa-chevron-right text-gray-500"></i>
    </div>
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center">
        <span className="bg-gray-200 p-2 rounded-full">
          <i className="fas fa-star text-gray-600"></i>
        </span>
        <div className="ml-3">
          <h6 className="font-semibold mb-1">My Reviews</h6>
          <p className="text-gray-500 text-sm">Your views about the products</p>
        </div>
      </div>
      <i className="fas fa-chevron-right text-gray-500"></i>
    </div>
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center">
        <span className="bg-gray-200 p-2 rounded-full">
          <i className="fas fa-user text-gray-600"></i>
        </span>
        <div className="ml-3">
          <h6 className="font-semibold mb-1">My Beauty Profile</h6>
          <p className="text-gray-500 text-sm">Profile that represents you</p>
        </div>
      </div>
      <i className="fas fa-chevron-right text-gray-500"></i>
    </div>
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center">
        <span className="bg-gray-200 p-2 rounded-full">
          <i className="fas fa-wallet text-gray-600"></i>
        </span>
        <div className="ml-3">
          <h6 className="font-semibold mb-1">My Payments</h6>
          <p className="text-gray-500 text-sm">Manage your payments</p>
        </div>
      </div>
      <i className="fas fa-chevron-right text-gray-500"></i>
    </div>
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center">
        <span className="bg-gray-200 p-2 rounded-full">
          <i className="fas fa-map-marker-alt text-gray-600"></i>
        </span>
        <button
          className="ml-3 text-left w-full bg-white border-0 text-gray-700"
          onClick={(event) => {
            event.preventDefault(); // Prevents the default button behavior
            navigate(`/address/${id}`);
          }}
        >
          <h6 className="font-semibold text-dark mb-1">My Addresses</h6>
          <p className="text-gray-500 text-sm mb-0">
            Save addresses for faster checkout
          </p>
        </button>
      </div>
      <div className="ml-auto">
        <i className="fas fa-chevron-right text-gray-500"></i>
      </div>
    </div>
    <div className="p-4 border-t-2">
      <ul className="list-none">
        <li className="mb-3 text-lg font-semibold">About Us</li>
        <li className="mb-3 text-lg font-semibold">Privacy Policy</li>
        <li className="mb-3 text-lg font-semibold">Terms & Conditions</li>
        <li className="text-lg font-semibold">Feedback</li>
      </ul>
    </div>
  </div>
  </div>
</div>

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

<Footer />

    </>
  );
}
