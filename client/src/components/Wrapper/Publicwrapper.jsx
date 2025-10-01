import { Navigate } from "react-router-dom";

const PublicWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/home" replace />;
  }
  return children;
};

export default PublicWrapper;
