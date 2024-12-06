import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../footer/footer";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import purpleLogo from "../../assets/images/purpplelogo.png";
import purplejoinElite from "../../assets/images/purplejoinElite.png.gif";

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [sellerCount, setSellerCount] = useState(0);

  const { id } = useParams();
  const token = localStorage.getItem(id);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/count', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = response.data;
        setUserCount(data.userCount);
        setOrderCount(data.orderCount);
        setProductCount(data.productCount);
        setSellerCount(data.sellerCount);
      } catch (error) {
        console.error('Error fetching counts:', error);
        toast.error('Failed to fetch data.');
      }
    };

    fetchCounts();
  }, [token]);

  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem(id);
    toast.success("You have been logged out.");
    navigate(`/`);
  };

  // Chart.js data and options
  const chartData = {
    labels: ['Order Count', 'Product Count', 'Seller Count', 'User Count'],
    datasets: [
      {
        label: 'Counts',
        data: [orderCount, productCount, sellerCount, userCount],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 205, 86, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 205, 86, 1)'
        ],
        borderWidth: 1,
        hoverBackgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 205, 86, 0.8)'
        ]
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Dashboard Counts' }
    },
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true }
    }
  };

  const [isSidebarOpen, setSidebarOpen] = useState(false);

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
            style={{ height: '100vh' }} // Ensure the sidebar height is the same as the screen height
          >
            <div className="d-flex align-items-center mb-4 ms-3">
              <img src={purpleLogo} alt="Purple Logo" className="purpplelogo1" />
            </div>

            <button
              className="absolute top-4 right-4 text-white"
              onClick={handleCloseSidebar}
            >
              <i className="fas fa-times"></i>
            </button>

            <nav className="nav flex flex-col space-y-4">
              <a href="#" className="dashboard nav-link active d-flex items-center py-2 gap-2 hover:bg-gray-700 px-2">
                <i className="fas fa-home"></i>
                <span className="ml-2">Dashboard</span>
              </a>
              <a href="#" className="nav-link d-flex items-center py-2 gap-2 hover:bg-gray-700 px-2">
                <i className="fas fa-users"></i>
                <span className="ml-2">Buyers</span>
              </a>
              <a href="#" className="nav-link d-flex items-center py-2 gap-2 hover:bg-gray-700 px-2">
                <i className="fas fa-folder"></i>
                <span className="ml-2">Sellers</span>
              </a>
              <a href="#" className="nav-link d-flex items-center py-2 gap-2 hover:bg-gray-700 px-2">
                <i className="fas fa-calendar-alt"></i>
                <span className="ml-2">Orders</span>
              </a>
              <a href="#" className="nav-link d-flex items-center py-2 gap-2 hover:bg-gray-700 px-2">
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
        <div className="graphdiv flex-1 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4">
              <img src={purpleLogo} alt="purplelogo" className="purpplelogo1" />
              <img src={purplejoinElite} alt="Purple Logo" className="PurpleLogoelite" />
            </div>
            <div className="text-end text-lg font-bold">
              <span>Admin</span>
            </div>
          </div>

          <div className="border border-dashed border-gray-400 rounded contentarea flex-1">
            <div className="container mt-4">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ToastContainer />
    </>
  );
};

export default Dashboard;
