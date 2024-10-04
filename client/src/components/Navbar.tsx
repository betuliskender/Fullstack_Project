import React from "react";
import { useContext } from "react";
import "../styles/navbar.css";
import {Link} from "react-router-dom"
import { AuthContext } from "../utility/authContext";
/**
 * Props interface for Navbar component
 */
interface NavbarProps {
  isLoggedIn: boolean; // Indicates wether a user is logged in or not
  onLogout: () => void; // Callback function to handle logout event
}

/**
 * Functional component representing the navigation bar
 * @param {NavbarProps} param Props for the Navbar component 
 * @returns TSX element representing the navigation bar
 */
const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLogout }) => {
  const { user } = useContext(AuthContext); // Get user from context

  const handleLogin = () => {
    /**
     * Redirects the user to the login page
     */
    window.location.href = "/login";
  };

  /**
   * Redirects the user to the register page
   */
  const handleRegister = () => {
    // Redirect to register page
    window.location.href = "/register";
  };

  return (
    <nav>
      <div className="navbar-left">
        <Link className="home" to="/">
          Home
        </Link>
        {isLoggedIn && (
          <>
            <Link to="/character">Character</Link>
            <Link to="/campaign">Campaign</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}
      </div>
      <div className="navbar-right">
        {isLoggedIn ? (
          <>
            <span>{user?.firstName} {user?.lastName}</span>
            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <div className="login-container">
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleRegister}>Register</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;