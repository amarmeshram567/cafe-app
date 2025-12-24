import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import OrderCheckout from './pages/OrderCheckout';
import Footer from './components/Footer';
import Home from './pages/Home';
import SellerLayout from './pages/seller/SellerLayout';
import MenusList from './pages/seller/MenusList';
import Orders from './pages/seller/Orders';
import AddMenu from './pages/seller/AddMenu';
import TableBookingLists from './pages/seller/TableBookingLists';
import AddAddress from './pages/AddAddress';
import { useAppContext } from './context/AppContext';
import Login from './components/Login';
import SellerLogin from './components/seller/Admin';
import { Toaster } from "react-hot-toast"
import PaymentSuccess from './pages/PaymentSuccess';
import FullMenu from './pages/FullMenu';
import FloatingMenu from './components/FloatingMenu';

const App = () => {

  const isSellerPath = useLocation().pathname.includes("seller")

  const { showUserLogin, isSeller } = useAppContext()

  return (
    <div className='min-h-screen'>
      <Toaster />


      {isSellerPath ? null : <Navbar />}
      {showUserLogin ? <Login /> : null}


      <div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/menu' element={
            <div className='relative min-h-screen'>
              <FullMenu />
              <FloatingMenu />
            </div>
          } />

          <Route path='/address' element={<AddAddress />} />

          <Route path='/seller' element={isSeller ? <SellerLayout /> : <SellerLogin />}>

            <Route index element={<AddMenu />} />
            <Route path='menu-list' element={<MenusList />} />
            <Route path='orders' element={<Orders />} />
            <Route path='table-bookings' element={<TableBookingLists />} />

          </Route>

          <Route path='/payment-success' element={<PaymentSuccess />} />

          <Route path='/address' element={<AddAddress />} />

        </Routes>
      </div>

      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;
