import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Switch, Alert } from 'react-native';
import { useUser } from '../context/UserContext';  // Importing the UserContext
import axios from 'axios';

const UserSettings = ({ isDarkTheme = true, toggleTheme }) => {
  const { user, token } = useUser(); // Accessing user and token from context
  const [userData, setUserData] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://192.168.51.90:5001/user-details', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status === 'ok') {
          setUserData(response.data.data); // Set the user data from API response
        } else {
          console.error('Failed to fetch user details:', response.data);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        Alert.alert('Error', 'Unable to fetch user details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, [token]);

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    // Optionally, update notification settings via API call
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, isDarkTheme && styles.darkBackground]}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={[styles.loadingText, isDarkTheme && styles.darkText]}>Loading...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={[styles.loadingContainer, isDarkTheme && styles.darkBackground]}>
        <Text style={[styles.loadingText, isDarkTheme && styles.darkText]}>User data unavailable</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkTheme && styles.darkBackground]}>
      {/* Account Section */}
      <Text style={[styles.sectionHeader, isDarkTheme && styles.primaryText]}>MY ACCOUNT</Text>
      <View style={styles.infoContainer}>
        <Text style={[styles.label, isDarkTheme && styles.darkText]}>Username</Text>
        <Text style={[styles.value, isDarkTheme && styles.secondaryText]}>{userData.name || 'N/A'}</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={[styles.label, isDarkTheme && styles.darkText]}>Email</Text>
        <Text style={[styles.value, isDarkTheme && styles.secondaryText]}>{userData.email || user.email}</Text>
      </View>

      {/* Notification Section */}
      <Text style={[styles.sectionHeader, isDarkTheme && styles.primaryText]}>NOTIFICATIONS</Text>
      <View style={styles.notificationContainer}>
        <Text style={[styles.label, isDarkTheme && styles.darkText]}>Allow Push Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
          thumbColor="#007BFF"
          trackColor={{ false: '#767577', true: '#A3D8FF' }}
        />
      </View>

      {/* Theme Toggle */}
      <Text style={[styles.sectionHeader, isDarkTheme && styles.primaryText]}>THEME</Text>
      <View style={styles.notificationContainer}>
        <Text style={[styles.label, isDarkTheme && styles.darkText]}>Enable Dark Theme</Text>
        <Switch
          value={isDarkTheme}
          onValueChange={toggleTheme}
          thumbColor="#007BFF"
          trackColor={{ false: '#767577', true: '#A3D8FF' }}
        />
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  notificationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
  },
  // Dark Theme Defaults
  darkBackground: {
    backgroundColor: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#AAAAAA',
  },
  primaryText: {
    color: '#007BFF',
  },
});

export default UserSettings;
