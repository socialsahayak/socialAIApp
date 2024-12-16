import { View, Text, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import {Ionicons} from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import Button from '../components/Button';
import { Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
const ForgotPassword = ({navigation}) => {
  const [email,setEmail]=useState('');
  function handleSubmit(){
    if(email.length==0){
      Alert.alert("Enter the Email");
      return;
    }
    const data={
      email:email,
    }
    axios.post("http://192.168.219.90:5001/otp",data).then((res)=>{
      console.log(res.data.message);
      
        Alert.alert("OTP send successfully");
        navigation.navigate('otpforfp',{email});
      }
    ).catch((err)=>{
      const status=err.response.status;
      if(status==400){
        Alert.alert('Account not yet created using this email');
      }else if (status==500) {
        Alert.alert("Failed to send OTP.Please try again");
      }
    })

  }
  return (
    <SafeAreaView style={{flex:1,backgroundColor:Colors.white}}>
      <View style={{flex:1,marginHorizontal:30}}>
        <View style={{marginVertical:22,
            
            flexDirection:'row',
            justifyContent:'center'
        }}>
        <Text style={{
          fontSize:22,
          fontWeight:'bold',
          marginVertical:12,
          color:Colors.black
        }}>
          Reset Your Password 
        </Text>
        </View>
        <View style={{
            flexDirection:'row',
            justifyContent:'center'
        }} >
            <Image source={require("../assets/forgotpass.jpg")}
            style={{
                height:300,
                width:300
            }}></Image>
        </View>
        <View style={{
            marginBottom:12,

        }}>
            <Text>Enter your Email address and we will send you OTP to Continue further</Text>
        </View>
      <View style={{marginBottom:12}}>
          <Text style={{
            fontSize:16,
            fontWeight:400,
            marginVertical:8
          }}>Email Address</Text>
          <View style={{
            width:"100%",
            height:48,
            borderColor:'#808080',
            borderWidth:1,
            borderRadius:8,
            alignItems:'center',
            justifyContent:'center',
            paddingLeft:22,

          }}>
            <TextInput 
            placeholder='Enter your Email Address'
            placeholderTextColor={Colors.black }
            keyboardType='email-address'
            style={{
              width:"100%"
            }}
            onChange={e=>setEmail(e.nativeEvent.text)}/>
        </View>
      </View>
      
      
      
      <Button title="Continue"
        filled
        style={{
          marginTop:18,
          marginBottom:4,
        }}
        onPress={handleSubmit}
        />
        
        <View style={{
          flexDirection:'row',
          justifyContent:'center',
          marginVertical:22
        }}>
          <Pressable 
          onPress={()=>navigation.navigate("welcome")}>
            <Text style={{
              fontSize:16,
              color:Colors.primary,
              fontWeight:'bold',
              marginLeft:6,
            }}>Back to Welcome page</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default ForgotPassword