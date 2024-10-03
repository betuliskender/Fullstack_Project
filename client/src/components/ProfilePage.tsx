import React, { useContext } from "react";
import { AuthContext } from "../utility/authContext";

interface ProfilePageProps {
  isLoggedIn: boolean;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ isLoggedIn }) => {
    const { user } = useContext(AuthContext);

  return (
    <React.Fragment>
      {isLoggedIn ? (
        <div>
          <h2>Profile Page</h2>
          <h2>Welcome, {user?.firstName}</h2>
        </div>
      ) : (
        <div>
          <h2>You need to login to see this page</h2>
        </div>
      )}
    </React.Fragment>
  );
};

export default ProfilePage;