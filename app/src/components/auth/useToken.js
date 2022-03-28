import { useState } from 'react';
import axios from 'axios';

import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';

export default function useToken() {

  const dispatch = useDispatch();

  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token
  };

  const [isVerified, setIsVerified] = useState(false);

  let token = sessionStorage.getItem('token');

  // Set token
  const saveToken = userToken => {
    if (userToken.verificationStatus) {
      sessionStorage.setItem('token', JSON.stringify(userToken.token));
      setIsVerified(true)
    }
  };

  // Unset token
  const revokeSession = userToken => {
    sessionStorage.removeItem('token');
    setIsVerified(false)
  };


  // Check auth - needs refactoring, check out react-router-dom if time permits (Typescript though)

  const [loadingData, setLoadingData] = useState(true);


  async function verifyToken() {
    let token = JSON.parse(sessionStorage.getItem("token"))
    if (!token) {
      return false
    }
    return await axios
      .get("http://localhost:5000/authVerify", {
        headers: { "x-access-token": JSON.parse(sessionStorage.getItem("token")) }
      })
      .then(({ data }) => {
        setIsVerified(data.auth);
        setLoadingData(false);
        dispatch(setUser(data))
        console.log(data)
        return data.auth
      })
      .catch((err) => { return false });
    console.log(test)
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
    revoke: revokeSession,
    token
  }
}