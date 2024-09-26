import React, { useState, ChangeEvent } from "react";
import { registerUser } from "../utility/apiservice";
import { User } from "../utility/types";

const Register: React.FC = () => {
  const [user, setUser] = useState<User>({ firstName: "", lastName: "", userName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages

    // Simple form validation
    if (user.password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }
    if (!user.email || !user.firstName || !user.lastName || !user.userName) {
      return setError("All fields are required.");
    }

    setLoading(true); // Start loading

    try {
      const response = await registerUser(user); // Call registerUser API function
      setSuccessMessage(response.message); // Display success message
      setUser({ firstName: "", lastName: "", userName: "", email: "", password: "" }); // Clear form
    } catch (error) {
      setError("Error registering user. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error messages */}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>} {/* Display success message */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="userName"
            value={user.userName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
