import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import store from './redux/store'
import { Provider } from 'react-redux'
import { useSelector } from "react-redux";
import { user } from "./redux/userSlice";



import useToken from './components/auth/useToken';

import {
  Login,
  Logout,
  Navigation,
  Footer,
  ManageProducts,
  ManageOrders,
  SupplierManageOrders,
  Dashboard,
  Inventory,
  InventorySearch,
  TestRedux,
  ManageSuppliers,
  AddProduct
} from "./components";




const App = () => {
  const userProfile = useSelector(user);

  let { slug } = useParams();

  const { setToken, verifyAuth } = useToken();

  if (!verifyAuth()) {
    return <Login setToken={setToken} />
  }

  const getDefRoute = () => {
    if (userProfile.userType === "admin") {
      return <Dashboard />
    } else {
      return <SupplierManageOrders />
    }
  }


  return (

    <Router>

      <Navigation />
      <Routes>
        <Route path="/" element={getDefRoute()} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manageproducts/:slug" element={<ManageProducts />} />
        <Route path="/createproduct" element={<AddProduct />} />
        <Route path="/managesuppliers" element={<ManageSuppliers />} />
        <Route path="/supplierorders" element={<SupplierManageOrders />} />
        <Route path="/manageorders" element={<ManageOrders />} />
        <Route path="/inventory" element={<InventorySearch />} />
      </Routes>
      <Footer />
    </Router>

  )
}

//  export default App;

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  ,
  document.getElementById("root")
);

serviceWorker.unregister();


