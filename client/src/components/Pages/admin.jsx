import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import axios from "axios";
import Footer from "../footer/footer";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, TimeScale, PointElement, LineElement } from "chart.js";
import "chartjs-adapter-date-fns"; // Import date adapter for time scales
import CountUp from "react-countup";
import { FaUsers, FaBox, FaChartLine, FaDollarSign } from "react-icons/fa"; // Importing icons
import {toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import purpleLogo from "../../assets/images/purpplelogo.png";
import purplejoinElite from "../../assets/images/purplejoinElite.png.gif";

// Register ChartJS elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [sellerCount, setSellerCount] = useState(0);
  const [revenueCount, setRevenueCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const { id, usertype } = useParams();
  const token = localStorage.getItem(id);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/count", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = response.data;
        console.log("data : ",data)
        setUserCount(data.userCount);
        setOrderCount(data.orderCount);
        setProductCount(data.productCount);
        setSellerCount(data.sellerCount);
        setRevenueCount(data.totalPrice);
        setOrders(data.orders); // Set the orders from the API
      } catch (error) {
        console.error("Error fetching counts:", error);
        toast.error("Failed to fetch data.");
      }
    };

    fetchCounts();
  }, [token]);

  const chartData = {
    labels: orders.map((order) => order.productId),
    datasets: [
      {
        label: "Order Prices",
        data: orders.map((order) => order.totalPrice),
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Order Prices Over Time" },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const order = orders[tooltipItems[0].dataIndex];
            return `Product ID: ${order.productId}`;
          },
          label: (tooltipItem) => {
            const order = orders[tooltipItem.dataIndex];
            return `Price: $${order.totalPrice} | Product: ${order.productName}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Products" },
        ticks: {
          display: false, // Hide the x-axis labels
        },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Prices" },
      },
    },
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    window.location.href = "/"; // Redirect to login
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
    <div className="flex flex-col md:flex-row h-screen">
  {/* Sidebar */}
  <div>
    <button
      onClick={handleSidebarToggle}
      className="md:hidden p-4 text-white bg-gray-800"
    >
      <i className="fas fa-bars"></i>
    </button>

    <div
      className={`sidebar p-4 bg-gray-800 text-white w-full md:w-64 flex-none fixed inset-0 md:relative transform transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      style={{ height: '100vh' }} // Keep the sidebar height as full
    >
      {/* Close Button (only visible on small screens) */}
      <button
        className="absolute top-4 right-4 text-white md:hidden" // Show only on small screens
        onClick={handleCloseSidebar}
      >
        <i className="fas fa-times"></i>
      </button>

      <div className="flex align-items-center gap-3 mb-4 ms-3">
        <img src={purpleLogo} alt="Purple Logo" className="purpplelogo1" />
        <img src={purplejoinElite} alt="Purple Logo" className="PurpleLogoeliteadmin" />
      </div>

      <nav className="nav flex flex-col space-y-4">
        {/* Sidebar links */}
        <a href="#" className="dashboard nav-link active d-flex items-center py-2 gap-2 hover:bg-gray-700 px-2">
          <i className="fas fa-home"></i>
          <span className="ml-2">Dashboard</span>
        </a>
        <a
          href="#"
          className="nav-link d-flex items-center py-2 gap-2 hover:bg-gray-700 px-2"
          onClick={(event) => {
            event.preventDefault();
            navigate(`/adminviewpage/${id}/${usertype}/Buyers`);
          }}
        >
          <i className="fas fa-users"></i>
          <span className="ml-2">Buyers</span>
        </a>
        <a
          href="#"
          className="nav-link d-flex items-center py-2 gap-2 hover:bg-gray-700 px-2"
          onClick={(event) => {
            event.preventDefault();
            navigate(`/adminviewpage/${id}/${usertype}/Sellers`);
          }}
        >
          <i className="fas fa-folder"></i>
          <span className="ml-2">Sellers</span>
        </a>
        <a href="#" className="nav-link d-flex items-center py-2 gap-2 hover:bg-gray-700 px-2" onClick={(event) => {
          event.preventDefault();
          navigate(`/adminviewpage/${id}/${usertype}/orders`);
        }}>
          <i className="fas fa-calendar-alt"></i>
          <span className="ml-2">Orders</span>
        </a>
        <a
          href="#"
          className="nav-link d-flex items-center py-2 gap-2 hover:bg-gray-700 px-2"
          onClick={(event) => {
            event.preventDefault();
            navigate(`/adminviewpage/${id}/${usertype}/Products`);
          }}
        >
          <i className="fas fa-chart-pie"></i>
          <span className="ml-2">Products</span>
        </a>
        <a href="#" className="nav-link d-flex items-center py-2 gap-2 hover:bg-gray-700 px-2">
          <i className="fas fa-file-alt"></i>
          <span className="ml-2">Emails</span>
        </a>
        <a href="#" className="nav-link d-flex items-center py-2 gap-2 hover:bg-gray-700 px-2">
          <i className="fas fa-cog"></i>
          <button className="ml-2 border-0 bg-transparent text-light" onClick={handleLogout}>
            Logout
          </button>
        </a>
      </nav>
    </div>
  </div>

  {/* Main Content */}
  <div className="dashboard-container bg-slate-50 p-4 flex-1 flex flex-col overflow-y-auto">
    {/* Cards Section */}
    <div className="grid mt-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {/* Sellers Card */}
      <div className="card bg-purple-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center" onClick={(event) => {
          event.preventDefault();  // Prevent the default anchor behavior
          navigate(`/adminviewpage/${id}/${usertype}/Sellers`);  // Navigate to the desired route
        }}>
        <FaUsers className="text-4xl mb-2" />
        <h3 className="text-2xl font-bold mb-2">Sellers</h3>
        <CountUp end={sellerCount} duration={2} className="text-3xl font-bold" />
      </div>

      {/* Buyers Card */}
      <div className="card bg-blue-500 text-white p-3 rounded-lg shadow-lg flex flex-col items-center" onClick={(event) => {
          event.preventDefault();
          navigate(`/adminviewpage/${id}/${usertype}/Buyers`);
        }}>
        <FaBox className="text-4xl mb-2" />
        <h3 className="text-2xl font-bold mb-2">Buyers</h3>
        <CountUp end={userCount - sellerCount} duration={2} className="text-3xl font-bold" />
      </div>

      {/* Products Card */}
      <div className="card bg-green-500 text-white p-3 rounded-lg shadow-lg flex flex-col items-center" onClick={(event) => {
          event.preventDefault();
          navigate(`/adminviewpage/${id}/${usertype}/Products`);
        }}>
        <FaChartLine className="text-4xl mb-2" />
        <h3 className="text-2xl font-bold mb-2">Products</h3>
        <CountUp end={productCount} duration={2} className="text-3xl font-bold" />
      </div>

      {/* Revenue Card */}
      <div className="card bg-yellow-500 text-white p-3 rounded-lg shadow-lg flex flex-col items-center">
        <FaDollarSign className="text-4xl mb-2" />
        <h3 className="text-2xl font-bold mb-2">Revenue</h3>
        <CountUp end={revenueCount} duration={2} prefix="$" className="text-3xl font-bold" />
      </div>
    </div>

    {/* Chart Section */}
    <div className="chart-container bg-white p-3 rounded-lg shadow-lg mb-8">
      <h3 className="text-2xl font-bold mb-4">Order Prices Over Time</h3>
      <div style={{ height: "400px" }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  </div>

</div>

      <ToastContainer />
    </>
  );
};

export default Dashboard;
