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

function App() {

  return (
    <>
    <Router>
      <CountProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/index/:id/:usertype" element={<Home />} />
          <Route path="/seller/:id/:usertype" element={<Seller />} />
          <Route path="/category/:item/:id/:usertype" element={<Category />} />
          <Route path="/singleview/:pid/:id/:categoryid/:usertype" element={<Singleview />} />
          <Route path="/searchpage/:item/:id/:usertype" element={<SearchPage />} />
          <Route path="/profile/:id/:usertype" element={<Profile />} />
          <Route path="/address/:id/:usertype" element={<AddressPage />} />
          <Route path="/settings/:id/:usertype" element={<SettingsPage />} />
          <Route path="/addproduct/:id/:usertype" element={<Addproduct />} />

        </Routes>
      </CountProvider>
    </Router>
    </>
  )
}

export default App
