import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utility/authContext";
import { loginUser } from "../utility/apiservice";
import { User } from "../utility/types";


interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setLoggedIn, setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const data = await loginUser({ email, password });

      const token = data.jwtToken;
      const user: User = data.user; 
      console.log("JWT token:", token);

      // Store the token temporarily
      setToken(token)

      setUser(user); // Save user data in context

      console.log("Login successful");
      setLoggedIn(true);
      onLogin();
      navigate("/profile");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="email">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="password">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="submit">
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;