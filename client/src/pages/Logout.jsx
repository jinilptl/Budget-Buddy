import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Logout = () => {
const navigate = useNavigate();
  async function handleLogout() {
    // Perform logout logic here
    localStorage.removeItem('token')

    alert("Logged out successfully");
    navigate('/')
  }
  useEffect(()=>{
    handleLogout();
  },[])

  return (
    <div>Logout</div>
  )
}

export default Logout