import React, { useState } from "react";
import NavOne from "../nav/navOne";
import HeaderComponent from "../nav/navSecond";
import NavThird from "../nav/navThird";
import AllProducts from "../functions/getallproduct";
import Footer from "../footer/footer";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid"; // Import arrow icons
import purplebanner1 from "../../assets/images/purplebanner1.webp";
import purplebanner2 from "../../assets/images/purplebanner2.webp";
import purplebanner3 from "../../assets/images/purplebanner3.avif";
import purplebanner4 from "../../assets/images/purplebanner4.avif";
import smallbanner1 from "../../assets/images/smallbanner1.webp";
import smallbanner2 from "../../assets/images/smallbanner2.webp";
import smallbanner3 from "../../assets/images/smallbanner3.webp";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentIndex1, setCurrentIndex1] = useState(0); 
  
  const images = [purplebanner1, purplebanner2, purplebanner3, purplebanner4];
  const images1 = [smallbanner1, smallbanner2, smallbanner3];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const nextSlide1 = () => {
    setCurrentIndex1((prevIndex) => (prevIndex + 1) % images1.length);
  };

  const prevSlide1 = () => {
    setCurrentIndex1(
      (prevIndex) => (prevIndex - 1 + images1.length) % images1.length
    );
  };

  return (
    <>
      <NavOne />
      <HeaderComponent />
      <NavThird />
      <ToastContainer position="top-center" autoClose={2000} />
      <div class="max-w-screen-xl mx-auto mt-5 mb-5">
      <div className="relative mx-auto">
        <div className="w-full overflow-hidden relative">
          {/* First Carousel Inner */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`, // Move slides based on index
            }}
          >
            {/* Loop through images and display each carousel item */}
            {images.map((image, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <img
                  src={image}
                  className="d-block w-full object-cover"
                  alt={`Purple Banner ${index + 1}`}
                />
              </div>
            ))}
          </div>

          {/* Previous Button for First Carousel */}
          <button
            className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10 p-3 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full"
            onClick={prevSlide}
          >
            <ChevronLeftIcon className="w-6 h-6 text-white" />
            <span className="visually-hidden"></span>
          </button>

          {/* Next Button for First Carousel */}
          <button
            className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10 p-3 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full"
            onClick={nextSlide}
          >
            <ChevronRightIcon className="w-6 h-6 text-white" />
            <span className="visually-hidden"></span>
          </button>
        </div>
      </div>
</div>

      <div class="max-w-screen-xl px-4 py-6 mx-auto mt-7 mb-5">
      <div className="container ">
        <div className="relative">
          <div className="w-full overflow-hidden relative">
            {/* Second Carousel Inner */}
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex1 * 100}%)`, // Move slides based on index
              }}
            >
              {/* Loop through images and display each carousel item */}
              {images1.map((image, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <img
                    src={image}
                    className="d-block w-full object-cover"
                    alt={`Banner ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            {/* Previous Button for Second Carousel */}
            <button
              className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10 p-3 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full"
              onClick={prevSlide1}
            >
              <ChevronLeftIcon className="w-6 h-6 text-white" />
              <span className="visually-hidden"></span>
            </button>

            {/* Next Button for Second Carousel */}
            <button
              className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10 p-3 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full"
              onClick={nextSlide1}
            >
              <ChevronRightIcon className="w-6 h-6 text-white" />
              <span className="visually-hidden"></span>
            </button>
          </div>
        </div>
      </div></div>

      <AllProducts />

      <Footer />
    </>
  );
}

export default Home;
