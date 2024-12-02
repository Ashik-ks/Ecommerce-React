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

function App() {

  return (
    <>
    <Router>
      <CountProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/index/:id" element={<Home />} />
          <Route path="/seller/:id" element={<Seller />} />
          <Route path="/category/:item/:id" element={<Category />} />
          <Route path="/singleview/:pid/:id/:categoryid" element={<Singleview />} />
          <Route path="/searchpage/:item/:id" element={<SearchPage />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/address/:id" element={<AddressPage />} />

        </Routes>
      </CountProvider>
    </Router>
    </>
  )
}

export default App
