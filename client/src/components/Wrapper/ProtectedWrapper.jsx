import React, { use, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const ProtectedWrapper = ({children}) => {
  const navigate = useNavigate();

  let token=localStorage.getItem('token')
  // console.log("protected call");
  

  useEffect(()=>{
    if(!token){
      console.log("no token, redirecting to login");
      
      navigate('/')
    }
  },[token])
  return (
    children
  )
}

export default ProtectedWrapper