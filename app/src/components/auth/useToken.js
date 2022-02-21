import { useState } from 'react';
import axios from 'axios';

export default function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token
  };

  const [isVerified, setIsVerified] = useState(false);

  let token = sessionStorage.getItem('token');

  // Set token
  const saveToken = userToken => {
    if(userToken.verificationStatus){
      sessionStorage.setItem('token', JSON.stringify(userToken.token));
      setIsVerified(true)
    }
  };

  // Unset token
  const remToken = userToken => {
    // sessionStorage.removeItem('token');
    setIsVerified(false)
  };


  // Check auth - needs refactoring, check out react-router-dom if time permits (Typescript though)

  const [loadingData, setLoadingData] = useState(true);
  

  async function verifyToken() {
    let token = JSON.parse(sessionStorage.getItem("token"))
    if(!token){
      return false
    }
    await axios
      .get("/authVerify", {
        headers: {"x-access-token":JSON.parse(sessionStorage.getItem("token"))}
      })
      .then(({data}) => {
        setIsVerified(data.auth);
        setLoadingData(false);
      });
  }

  const checkAuth = () => {
    if (loadingData) {
      verifyToken();
    }

    return isVerified
  }

  return {
    setToken: saveToken,
    verifyAuth: checkAuth,
    signout: remToken,
    token
  }  
}