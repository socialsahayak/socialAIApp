import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create the UserContext
const UserContext = createContext();

// UserProvider component to wrap the app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Holds user details
  const [token, setToken] = useState(null); // Holds the authentication token
  const [loading, setLoading] = useState(true); // Loading state for checking token

  // Load token and user data from AsyncStorage when the app starts
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("authToken");
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Error loading token from AsyncStorage:", error);
      } finally {
        setLoading(false); // Loading complete
      }
    };

    loadToken();
  }, []);

  // Function to log in the user and save token
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    AsyncStorage.setItem("authToken", authToken) // Persist token in AsyncStorage
      .catch((error) => console.error("Error saving token:", error));
  };

  // Function to log out the user and clear token
  const logout = () => {
    setUser(null);
    setToken(null);
    AsyncStorage.removeItem("authToken") // Remove token from AsyncStorage
      .catch((error) => console.error("Error removing token:", error));
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);