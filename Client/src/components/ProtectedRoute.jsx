import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const userData = localStorage.getItem("user");
  
  // Safeguard: Check if data exists and is not the string "undefined"
  if (!userData || userData === "undefined") {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userData);
    return user ? children : <Navigate to="/login" replace />;
  } catch (error) {
    console.error("Auth Parse Error:", error);
    localStorage.removeItem("user"); // Corrupted data clear karein
    return <Navigate to="/login" replace />;
  }
}