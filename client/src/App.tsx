import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FrontPage from "./components/Frontpage";
import Character from "./components/Character";
import Register from "./components/Register";
import LogIn from "./components/LogIn";
import Navbar from "./components/Navbar";
import { AuthContext, AuthProvider } from "./utility/authContext";
import ProfilePage from "./components/ProfilePage";
import { useContext, useState } from "react";

const App: React.FC = () => {
  const { setUser, setToken } = useContext(AuthContext); // Get setUser from context

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null); // Remove user data on logout
    setToken(null); // Remove token on logout
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <AuthProvider>
      <Router>
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route
              path="/profile"
              element={<ProfilePage isLoggedIn={isLoggedIn} />}
            />
          <Route path="/character" element={<Character isLoggedIn={isLoggedIn}/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<LogIn onLogin={handleLogin}  />} />
        </Routes>
      </Router>
    </AuthProvider>
    
  );
};

export default App;