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

const Signin = ({navigation}) => {
  
  const [email,setEmail]=useState('');
  const [Password,setPassword]=useState('');
  const [isPasswordShown,setIsPasswordShown]=useState(false);
  const [isChecked,setIsChecked]=useState(false);
  function handleSubmit(){
    console.log(email,Password);
    const userData={
      email:email,
      password:Password
    }
    axios.post("http://192.168.141.90:5001/login-user",userData).then(res=>{console.log(res.data);
      if(res.data.status=="ok"){
        Alert.alert('Logged In successfull');
        navigation.navigate('ChatBot');
      }else{
        Alert.alert('Invalid User');
      }
    });

  }
  return (
    <SafeAreaView style={{flex:1,backgroundColor:Colors.white}}>
      <View style={{flex:1,marginHorizontal:22}}>
        <View style={{marginVertical:22}}>
        <Text style={{
          fontSize:22,
          fontWeight:'bold',
          marginVertical:12,
          color:Colors.black
        }}>
          Hey Welcome back !
        </Text>
        <Text style={{
          fontSize:16,
          color:Colors.black
        }}>Hello again you have been missed!</Text>
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
      <View style={{marginBottom:12}}>
          <Text style={{
            fontSize:16,
            fontWeight:400,
            marginVertical:8
          }}>Password</Text>
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
            placeholder='Enter your Password'
            placeholderTextColor={Colors.black}
            secureTextEntry={isPasswordShown}
            style={{
              width:"100%"
            }}
            onChange={e=>setPassword(e.nativeEvent.text)}/>
            <TouchableOpacity 
            onPress={()=>setIsPasswordShown(!isPasswordShown)}
            style={{
              position:'absolute',
              right:12,
            }}>
              {
                isPasswordShown==true?(
                  <Ionicons name='eye-off' size={24} color={Colors.black}/>
                ):(
                  <Ionicons name='eye' size={24} color={Colors.black}/>
                )
              }
              
            </TouchableOpacity>
        </View>
      </View>  
      <View style={{
        flexDirection:'row',
        justifyContent:'flex-end'
      }}>
        <Pressable 
          onPress={()=>navigation.navigate("forgotpassword")}>
            <Text style={{
              fontSize:15,
              color:Colors.primary,
              fontWeight:'bold',
              marginLeft:6,
            }}>Forgot your password?</Text>
          </Pressable>
      </View>
      <View style={{
        flexDirection:'row',
        marginVertical:6
      }} >
        <Checkbox style={{
          marginRight:8
        }} 
        value={isChecked}
        onValueChange={setIsChecked}
        color={isChecked ?Colors.primary : Colors.grey }/>
        <Text>Remember me</Text>
      </View>
      <Button title="Login"
        filled
        style={{
          marginTop:18,
          marginBottom:4,
        }}
        //  onPress={()=>{navigation.navigate("ChatBot")}}
        onPress={()=>{handleSubmit()}}
        />
        <View style={{flexDirection:'row',alignItems:'center',marginVertical:20}}>
          <View style={{
            flex:1,
            height:1,
            backgroundColor:'#808080',
            marginHorizontal:10
          }}/>
          <Text style={{fontSize:14}}>Or Login with</Text>
          <View style={{
            flex:1,
            height:1,
            backgroundColor:'#808080',
            marginHorizontal:10
          }}/>
        </View>
        <View style={{
          flexDirection:'row',
          justifyContent:'center'
        }}>
          <TouchableOpacity onPress={()=>console.log("Pressed")}
            style={{
              flex:1,
              alignItems:'center',
              justifyContent:'center',
              flexDirection:'row',
              height:52,
              borderWidth:1,
              borderColor:'#808080',
              marginRight:4,
              borderRadius:10

            }}
            >
              <Image
                  source={require("../assets/google.png")}
                  style={{
                    height:36,
                    width:36,
                    marginRight:8
                  }}
                  resizeMode='contain'
                  />
                  <Text >Continue with Google</Text>
          </TouchableOpacity>

        </View>
        <View style={{
          flexDirection:'row',
          justifyContent:'center',
          marginVertical:22
        }}>
          <Text style={{fontSize:16,color:Colors.black}}>Don't have an account?</Text>
          <Pressable 
          onPress={()=>navigation.navigate("signup")}>
            <Text style={{
              fontSize:16,
              color:Colors.primary,
              fontWeight:'bold',
              marginLeft:6,
            }}>Register</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Signin