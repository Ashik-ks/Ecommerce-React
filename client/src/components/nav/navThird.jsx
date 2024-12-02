import React, { useState, useEffect } from "react";
import { useNavigate,useParams } from 'react-router-dom';
import axios from "axios";

function NavThird() {
  const [categoriesData, setCategoriesData] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();
  let { usertype } = useParams();
 

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
    <div className="container-fluid border-b border-gray-300 relative">
      <div className="container mx-auto px-4">
        {/* Navigation Bar */}
        <div className="NavigationBar flex flex-wrap items-center justify-center py-2 bg-white  lg:space-x-4">
          {/* Category Dropdown */}
          <div
            className="relative group flex-shrink-0"
            onMouseEnter={() => setShowCategories(true)}
            onMouseLeave={() => setShowCategories(false)}
          >
            <span className="secondnavtext  text-gray-800 cursor-pointer  hover:text-blue-500 transition-colors">
              SHOP CATEGORIES
            </span>

            {/* Dropdown Content */}
            {showCategories && (
              <div className="itemsdiv absolute top-full left-0 w-[800px] bg-white border border-gray-200 shadow-lg z-10 p-4">
                <div className="flex flex-col">
                  {/* Categories List */}
                  <div className="flex flex-wrap sm:space-x-4 mb-4">
                    {categoriesData.map((category) => (
                      <div
                        key={category._id}
                        className={`category px-2 cursor-pointer text-gray-700 hover:bg-gray-100 transition-colors duration-300 ${
                          hoveredCategory && hoveredCategory._id === category._id
                            ? "bg-gray-100"
                            : ""
                        }`}
                        onMouseEnter={() => setHoveredCategory(category)}
                      >
                        {category.name}
                      </div>
                    ))}
                  </div>

                  {/* Subcategories and Items */}
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

          {/* Other Nav Items */}
          <span className="secondnavtext cursor-pointer lg:py-3 lg:px-4  text-gray-800 hover:text-blue-500 transition-colors">
            OFFERS
          </span>
          <span className="secondnavtext cursor-pointer lg:py-3 lg:px-4  text-gray-800 hover:text-blue-500 transition-colors">
            NEW
          </span>
          <span className="secondnavtext cursor-pointer lg:py-3 lg:px-4  text-gray-800 hover:text-blue-500 transition-colors">
            SPLURGE
          </span>
          <span className="secondnavtext cursor-pointer lg:py-3 lg:px-4  text-gray-800 hover:text-blue-500 transition-colors">
            MAGAZINE
          </span>
          <span className="secondnavtext cursor-pointer lg:py-3 lg:px-4  text-gray-800 hover:text-blue-500 transition-colors">
            ELITE OFFERS
          </span>
        </div>
      </div>
    </div>
  );
}

export default NavThird;
