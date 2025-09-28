import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'; // ✅ import toast

const Logout = () => {
  const navigate = useNavigate();

  async function handleLogout() {
    // Perform logout logic here
    localStorage.removeItem('token');

    toast.success("Logged out successfully ✅"); // ✅ toast instead of alert
    navigate('/');
  }

  useEffect(() => {
    handleLogout();
  }, []);

  return <div>Logging out...</div>;
};

export default Logout;
