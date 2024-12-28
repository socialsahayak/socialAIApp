
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
const Stack=createNativeStackNavigator();
import Welcome from './screens/welcome'; // Ensure this path is correct
import Login from './screens/login'; // Check other imports too
import Signup from './screens/signup';
import Otpverifiy from './screens/otpverification';
import  ChatBot  from './screens/ChatBot';
import { ForgotPassword } from './screens';
import OTP from './screens/otpforfp';
import UserSettings from './screens/UserSettings';
import { UserProvider } from './context/UserContext';
export default function App() {
  return (
    <UserProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName='welcome'>
      <Stack.Screen name='welcome'
      component={Welcome}
      options={{
        headerShown:false
      }} 
      />
      <Stack.Screen
      name='login'
      component={Login}
      options={{
        headerShown:false
      }}     
      />
      <Stack.Screen
      name='signup'
      component={Signup}
      options={{
        headerShown:false
      }}     
      />
      <Stack.Screen
      name='otpverification'
      component={Otpverifiy}
      options={{
        headerShown:false
      }}     
      />
       <Stack.Screen
      name='ChatBot'
      component={ChatBot}
      options={{
        headerShown:false
      }}     
      />
      <Stack.Screen
      name='forgotpassword'
      component={ForgotPassword}
      options={{
        headerShown:false
      }}     
      />
      <Stack.Screen
      name="otpforfp"
      component={OTP}
      options={{ headerShown: false }}
      />
       <Stack.Screen
            name="UserSettings"
            component={UserSettings}
            options={{
              title: "Settings",
              headerStyle: { backgroundColor: "#1a1a1a" },
              headerTintColor: "#fff",
            }}
          />
      </Stack.Navigator>
    </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
