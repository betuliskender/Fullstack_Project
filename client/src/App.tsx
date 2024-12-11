import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FrontPage from "./components/Frontpage";
import Character from "./components/Character";
import ProfilePage from "./components/ProfilePage";
import Navbar from "./components/Navbar";
import { AuthContext, AuthProvider } from "./utility/authContext";
import { Grid, GridItem } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import CampaignType from "./components/Campaign";
import CampaignDetails from "./components/CampaignDetails";

const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  cache: new InMemoryCache()
});

const App: React.FC = () => {
  const { setUser, setToken } = useContext(AuthContext);
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
          <Grid
            padding={4}
            templateAreas={{
              lg: `"nav nav"
                   "main main"`,
              base: `"nav" "main"`,
            }}
            templateColumns={{
              lg: "200px 1fr",
              base: "1fr",
            }}
          >
            <GridItem area={"nav"}>
              <Navbar isLoggedIn={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout} />
            </GridItem>
            
            <GridItem area={"main"}>
              <Routes>
                <Route path="/" element={<FrontPage />} />
                <Route
                  path="/profile"
                  element={<ProfilePage isLoggedIn={isLoggedIn}/>}
                />
                <Route
                  path="/character"
                  element={<Character isLoggedIn={isLoggedIn} />}/>
                <Route path="/campaign" element={<CampaignType isLoggedIn={isLoggedIn} />} />
                <Route path="/campaign/:id" element={<CampaignDetails isLoggedIn={isLoggedIn}/>} />
              </Routes>
            </GridItem>
          </Grid>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default App;
