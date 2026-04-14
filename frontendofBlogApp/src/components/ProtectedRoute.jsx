import { useAuth } from "../store/authStore";
import { Navigate } from "react-router";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

function ProtectedRoute({ children, allowedRoles }) {
  //get user login status from store
  const { loading, currentUser, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("Please login to continue", { id: "auth-redirect-toast" });
    }
  }, [loading, isAuthenticated]);

  //loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-[#0066cc] animate-pulse">Checking authentication...</p>
      </div>
    );
  }

  //if user not loggedin
  if (!isAuthenticated) {
    //redirect to Login
    return <Navigate to="/login" replace />;
  }

  //check roles
  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
    //redirect to unauthorized
    return <Navigate to="/unauthorized" replace state={{ redirectTo: "/" }} />;
  }

  return children;
}

export default ProtectedRoute;