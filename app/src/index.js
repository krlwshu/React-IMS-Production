import React, {useState} from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import useToken from './components/auth/useToken';

import {
  Login,
  Navigation,
  Footer,
  Home,
  ManageProducts,
  Inventory,
  ManageOrders,
  SupplierManageOrders,
  Dashboard
} from "./components";




const App = () => { 
  const { token, setToken } = useToken();
  if(!token) {
    return <Login setToken={setToken} />
  }

  console.log(token)
  return (

    <Router>
    <Navigation />
    <Routes>
      <Route path="/" element={<Home />} />
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


