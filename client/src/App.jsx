import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CountProvider } from './components/CountContext';
import Home from './components/Pages/home'
import Seller from './components/Pages/seller';
import Category from './components/Pages/category';
import Singleview from './components/Pages/singleview';
import SearchPage from './components/Pages/search';
import Profile from './components/Pages/profile';
import AddressPage from './components/Pages/address';
import SettingsPage from './components/Pages/settings';
import Addproduct from './components/Pages/addProduct';
import Addtocartpage from './components/Pages/cart';
import AddtoWhishlistPage from './components/Pages/Wishlist';
import Billing from './components/Pages/billing';
import OrderDetails from './components/Pages/order';
import Sections from './components/Pages/sections';
import Dashboard from './components/Pages/admin';
import AdminViewpage from './components/Pages/adminviewpages';
import AdminListing from './components/Pages/adminlisting';
import AdminSingleView from './components/Pages/adminsingleview';

function App() {
  return (
    <>
    <Router>
      <CountProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/index/:id/:usertype" element={<Home />} />
          <Route path="/seller/:id/:usertype" element={<Seller />} />
          <Route path="/admin/:id/:usertype" element={<Dashboard />} />
          <Route path="/category/:item/:id/:usertype" element={<Category />} />
          <Route path="/singleview/:pid/:id/:categoryid/:usertype" element={<Singleview />} />
          <Route path="/searchpage/:item/:id/:usertype" element={<SearchPage />} />
          <Route path="/profile/:id/:usertype" element={<Profile />} />
          <Route path="/address/:id/:usertype" element={<AddressPage />} />
          <Route path="/settings/:id/:usertype" element={<SettingsPage />} />
          <Route path="/addproduct/:id/:usertype" element={<Addproduct />} />
          <Route path="/cart/:id/:usertype" element={<Addtocartpage />} />
          <Route path="/wishlist/:id/:usertype" element={<AddtoWhishlistPage />} />
          <Route path="/billing/:id/:pid/:usertype" element={<Billing />} />
          <Route path="/order/:id/:usertype" element={<OrderDetails />} />
          <Route path="/section/:id/:usertype/:state" element={<Sections />} />
          <Route path="/adminviewpage/:id/:usertype/:state" element={<AdminViewpage />} />
          <Route path="/adminlistingpage/:id/:usertype/:state/:buyerid" element={<AdminListing />} />
          <Route path="/adminsingleviewpage/:id/:usertype/:pid" element={<AdminSingleView />} />

        </Routes>
      </CountProvider>
    </Router>
    </>
  )
}

export default App
