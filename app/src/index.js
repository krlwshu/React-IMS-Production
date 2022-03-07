import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import store from './redux/store'
import { Provider } from 'react-redux'

import useToken from './components/auth/useToken';
import axios from 'axios';

import {
  Login,
  Navigation,
  Footer,
  ManageProducts,
  ManageOrders,
  SupplierManageOrders,
  Dashboard,
  Inventory,
  InventorySearch,
  TestRedux,
  ManageSuppliers
} from "./components";




const App = () => {

  let { slug } = useParams();

  // const { setToken, verifyAuth } = useToken();

  // if (!verifyAuth()) {
  //   return <Login setToken={setToken} />
  // }

  return (

    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manageproducts/:slug" element={<ManageProducts />} />
        <Route path="/managesuppliers" element={<ManageSuppliers />} />
        <Route path="/supplierorders" element={<SupplierManageOrders />} />
        <Route path="/manageorders" element={<ManageOrders />} />
        <Route path="/inventory" element={<InventorySearch />} />
        <Route path="/testredux" element={<TestRedux />} />
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


