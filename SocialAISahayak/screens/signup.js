import { View, Text, TextInput, TouchableOpacity, Pressable } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import {Ionicons} from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import Button from '../components/Button';
import { Image } from 'react-native';
import Foect from 'foect';
const Signup = ({navigation}) => {
  const [isPasswordShown,setIsPasswordShown]=useState(false);
  const [isChecked,setIsChecked]=useState(false);
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
          Create Account
        </Text>
        <Text style={{
          fontSize:16,
          color:Colors.black
        }}>Have engagement like never before</Text>
        </View>
        <Foect.Form>{form=><View>
          <View style={{marginBottom:12}}>
          <Text style={{
            fontSize:16,
            fontWeight:400,
            marginVertical:8
          }}>Name</Text>
            <Foect.Control name='fullName' required minLength={2} maxLength={32}>
  {control => (
    <View style={{ width: "100%", marginBottom: 5 }}>
      <View
        style={{
          width: "100%",
          height: 48,
          borderColor: '#808080',
          borderWidth: 1,
          borderRadius: 8,
          justifyContent: 'center',
          paddingLeft: 22,
        }}
      >
        <TextInput 
          placeholder='Enter your Name'
          placeholderTextColor={Colors.black}
          keyboardType='default'
          style={{
            width: "100%",
          }}
          onBlur={control.markAsTouched}
          onChangeText={(text) => control.onChange(text)}
          value={control.value}
        />
      </View>

      {control.isInvalid && control.errors.required && (
        <Text style={{ color: 'red', marginTop: 5 }}>
          Name is required
        </Text>
      )}
      {control.isInvalid &&!control.errors.required&& control.errors.minLength && (
        <Text style={{ color: 'red', marginTop: 5 }}>
          Name atLeast two characters long
        </Text>
      )}
      {control.isInvalid && !control.errors.required&&control.errors.maxLength && (
        <Text style={{ color: 'red', marginTop: 5 }}>
          Name maximum 32 characters long
        </Text>
      )}
    </View>
  )}
</Foect.Control>

      </View>
      
      <View style={{marginBottom:12}}>
          <Text style={{
            fontSize:16,
            fontWeight:400,
            marginVertical:8
          }}>Email Address</Text>
          
            <Foect.Control name='email' required email>{control=>(<View style={{ width: "100%", marginBottom: 5 }}>
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
            onBlur={control.markAsTouched}
          onChangeText={(text) => control.onChange(text)}
          value={control.value}
          />
        </View>
        {control.isInvalid && control.errors.required && (
        <Text style={{ color: 'red', marginTop: 5 }}>
          Email is required
        </Text>
      )}
              {control.isInvalid && !control.errors.required&& control.errors.email && (
        <Text style={{ color: 'red', marginTop: 5 }}>
          Email is NotValid
        </Text>
      )}
            </View>)}</Foect.Control>
            
      </View>
      <View style={{marginBottom:12}}>
          <Text style={{
            fontSize:16,
            fontWeight:400,
            marginVertical:8
          }}>Password</Text>
          
            <Foect.Control name='password' required pattern={/"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"/}>{control=>(<View style={{width:'100%',marginBottom:5}}>
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
            onBlur={control.markAsTouched}
            onChangeText={(text) => control.onChange(text)}
            value={control.value}
            />
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
        {
          control.isInvalid&&control.errors.required&&( <Text style={{marginTop:5,marginStart:5,color:'red'}}>
            Password is required
          </Text>)
        }
        {
          control.isInvalid&&!control.errors.required &&control.errors.pattern&&( <Text style={{marginTop:5,marginStart:5,color:'red'}}>
            Minimum eight characters, at least one letter, one number and one special character
          </Text>)
        }
            </View>)}</Foect.Control>
            
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
        <Text>I agree to the terms and conditions</Text>
      </View>
      <Button title="sign up"
        filled
        style={{
          marginTop:18,
          marginBottom:4,
        }}
        onPress={()=>form.submit()}/>
          </View>}</Foect.Form>
        
        <View style={{flexDirection:'row',alignItems:'center',marginVertical:20}}>
          <View style={{
            flex:1,
            height:1,
            backgroundColor:'#808080',
            marginHorizontal:10
          }}/>
          <Text style={{fontSize:14}}>Or sign up with</Text>
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
          <Text style={{fontSize:16,color:Colors.black}}>Already have an account?</Text>
          <Pressable 
          onPress={()=>navigation.navigate("login")}>
            <Text style={{
              fontSize:16,
              color:Colors.primary,
              fontWeight:'bold',
              marginLeft:6,
            }}>Login</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Signup