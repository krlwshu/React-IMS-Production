import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import useToken from './components/auth/useToken';
import axios from 'axios';

import {
  Login,
  Navigation,
  Footer,
  ManageProducts,
  Inventory,
  ManageOrders,
  SupplierManageOrders,
  Dashboard
} from "./components";




const App = () => { 

  const {  setToken, verifyAuth } = useToken();

  if(!verifyAuth() ){
    return <Login setToken={setToken} />
  }

  return (

    <Router>
    <Navigation />
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/manageproducts" element={<ManageProducts />} />
      <Route path="/supplierorders" element={<SupplierManageOrders />} />
      <Route path="/manageorders" element={<ManageOrders />} />
    </Routes>
    <Footer />
  </Router>

  )
 }

//  export default App;

ReactDOM.render(
  <App/>
,
  document.getElementById("root")
);

serviceWorker.unregister();


