import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import '../App.css'

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  console.log("Auth state:", { user, isAuthenticated });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className=" shadow-md fixed-top">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold tracking-wide">
           Access Management
        </Link>

        <div className="flex items-center gap-6">
          {isAuthenticated && (
            <div className="flex gap-4">
              <Link to="/dashboard" className="hover:underline">
                DASHBOARD
              </Link>

              {user?.role === "Admin" && (
                <>
                  <Link to="/create-software" className="hover:underline">
                    CREATE SOFTWARE
                  </Link>
                  <Link to="/all-requests" className="hover:underline">
                    ALL REQUESTS
                  </Link>
                  <Link to="/manage-users" className="hover:underline">
                    MANAGE USERS
                  </Link>
                </>
              )}

              {user?.role === "Employee" && (
                <Link to="/request-access" className="hover:underline">
                  REQUEST ACCESS
                </Link>
              )}

              {user?.role === "Manager" && (
                <Link to="/pending-requests" className="hover:underline">
                  PENDING REQUEST
                </Link>
              )}
            </div>
          )}

          {!isAuthenticated ? (
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link to="/login">LOGIN</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">SIGN UP</Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* <span className="text-white">
                {user?.username} ({user?.role})
              </span> */}

              <Button onClick={handleLogout} className="cursor-pointer">
                LOGOUT
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
