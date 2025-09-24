import React, { use, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const ProtectedWrapper = ({children}) => {
  const navigate = useNavigate();

  let token=localStorage.getItem('token')

  useEffect(()=>{
    if(!token){
      navigate('/')
    }
  },[token])
  return (
    children
  )
}

export default ProtectedWrapper