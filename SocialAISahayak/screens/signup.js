import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import axios from 'axios';

const Colors = {
  primary: "#6200EE",
  black: "#000000",
  white: "#FFFFFF",
  grey: "#808080",
};

const Signup = ({ navigation }) => {
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleSubmit = async () => {
    if (!name || name.length < 2 || name.length > 32) {
      alert("Name must be between 2 and 32 characters.");
      return;
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!password || !passwordPattern.test(password)) {
      alert("Password must be at least 8 characters, including a letter, a number, and a special character.");
      return;
    }

    if (!isChecked) {
      alert("You must agree to the terms and conditions.");
      return;
    }

    const userData = { name, email, password };

    try {
      const res = await axios.post("http://192.168.141.90:5001/register", userData);
      console.log(res.data);
      alert("Account created successfully!");
      navigation.navigate("login");
    } catch (error) {
      console.error("Error during registration: ", error);
      alert("Failed to create an account. Please try again.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <View style={{ flex: 1, marginHorizontal: 22 }}>
        {/* Header */}
        <View style={{ marginVertical: 22 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginVertical: 12, color: Colors.black }}>
            Create Account
          </Text>
          <Text style={{ fontSize: 16, color: Colors.black }}>
            Have engagement like never before
          </Text>
        </View>

        {/* Form Fields */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, marginVertical: 8 }}>Name</Text>
          <TextInput
            placeholder="Enter your Name"
            placeholderTextColor={Colors.grey}
            style={{
              width: "100%",
              height: 48,
              borderColor: Colors.grey,
              borderWidth: 1,
              borderRadius: 8,
              paddingLeft: 12,
            }}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, marginVertical: 8 }}>Email Address</Text>
          <TextInput
            placeholder="Enter your Email Address"
            placeholderTextColor={Colors.grey}
            keyboardType="email-address"
            style={{
              width: "100%",
              height: 48,
              borderColor: Colors.grey,
              borderWidth: 1,
              borderRadius: 8,
              paddingLeft: 12,
            }}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, marginVertical: 8 }}>Password</Text>
          <View style={{ position: 'relative' }}>
            <TextInput
              placeholder="Enter your Password"
              placeholderTextColor={Colors.grey}
              secureTextEntry={!isPasswordShown}
              style={{
                width: "100%",
                height: 48,
                borderColor: Colors.grey,
                borderWidth: 1,
                borderRadius: 8,
                paddingLeft: 12,
                paddingRight: 40,
              }}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={{ position: 'absolute', right: 12, top: 12 }}
            >
              <Ionicons
                name={isPasswordShown ? 'eye-off' : 'eye'}
                size={24}
                color={Colors.grey}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 6 }}>
          <Checkbox
            value={isChecked}
            onValueChange={setIsChecked}
            color={isChecked ? Colors.primary : Colors.grey}
          />
          <Text style={{ marginLeft: 8 }}>I agree to the terms and conditions</Text>
        </View>

        <Button
          title="Sign Up"
          filled
          style={{
            marginTop: 18,
            marginBottom: 4,
          }}
          onPress={handleSubmit}
        />

        {/* Alternative Sign-Up Options */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: Colors.grey, marginHorizontal: 10 }} />
          <Text style={{ fontSize: 14 }}>Or sign up with</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: Colors.grey, marginHorizontal: 10 }} />
        </View>

        <TouchableOpacity
          onPress={() => console.log("Google sign-up pressed")}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 52,
            borderWidth: 1,
            borderColor: Colors.grey,
            borderRadius: 10,
          }}
        >
          <Image
            source={require("../assets/google.png")}
            style={{ height: 36, width: 36, marginRight: 8 }}
          />
          <Text>Continue with Google</Text>
        </TouchableOpacity>

        {/* Navigate to Login */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 22 }}>
          <Text style={{ fontSize: 16, color: Colors.black }}>Already have an account?</Text>
          <Pressable onPress={() => navigation.navigate("login")}>
            <Text style={{
              fontSize: 16,
              color: Colors.primary,
              fontWeight: 'bold',
              marginLeft: 6,
            }}>
              Login
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Signup;
