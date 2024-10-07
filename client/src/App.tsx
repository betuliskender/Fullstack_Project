import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FrontPage from "./components/Frontpage";
import Character from "./components/Character";
import Register from "./components/Register";
import LogIn from "./components/LogIn";
import Navbar from "./components/Navbar";
import { AuthContext, AuthProvider } from "./utility/authContext";
import ProfilePage from "./components/ProfilePage";
import { useContext, useState } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import CharacterForm from "./components/CharacterForm";
import CampaignType from "./components/Campaign";
import CampaignForm from "./components/CampaignForm";
import CampaignDetails from "./components/CampaignDetails";

const client = new ApolloClient({
  uri: "http://localhost:5000/graphql", 
  cache: new InMemoryCache()
});

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
    <ApolloProvider client={client}>
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
            <Route path="/create-character" element={<CharacterForm isLoggedIn={isLoggedIn} />} />
            <Route path="/campaign" element={<CampaignType isLoggedIn={isLoggedIn} />} />
            <Route path="/campaign/:id" element={<CampaignDetails />} />
            <Route path="/create-campaign" element={<CampaignForm isLoggedIn={isLoggedIn} />} />
            <Route path="/register" element={<Register/>} />
            <Route path="/login" element={<LogIn onLogin={handleLogin}  />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ApolloProvider>
    
  );
};

export default App;