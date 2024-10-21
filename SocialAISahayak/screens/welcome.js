import { View, Text, Image, Pressable } from 'react-native';
import React from 'react';
import { LinearGradient } from "expo-linear-gradient"; 
import { Colors as newappcolors } from 'react-native/Libraries/NewAppScreen'; 
import Colors from '../constants/colors';
import Button from '../components/Button';

export default function Welcome({navigation}) {
  return (
    <LinearGradient 
      style={{
        flex: 1
      }}
      colors={[Colors.black,Colors.black]}
    >   
      <View style={{ flex: 1,marginTop:50}}>
        <View>
          <Image 
            source={require("../assets/img1.jpg")}
            style={{
              height: 100,
              width: 100,
              borderRadius: 20,
              position:'absolute',
              top:40,
              transform:[
                {translateX:20},
                {translateY:50},
                {rotate:"-15deg"}
              ]

            }}
          />
          <Image 
            source={require("../assets/img4.webp")}
            style={{
              height: 100,
              width: 100,
              borderRadius: 20,
              position:'absolute',
              top:-20,
              left:100,
              transform:[
                {translateX:50},
                {translateY:50},
                {rotate:"-5deg"}
              ]

            }}
          />
          <Image 
            source={require("../assets/img3.jpg")}
            style={{
              height: 100,
              width: 100,
              borderRadius: 20,
              position:'absolute',
              top:160,
              left:-50,
              transform:[
                {translateX:50},
                {translateY:50},
                {rotate:"15deg"}
              ]

            }}
          />
          <Image 
            source={require("../assets/img5.webp")}
            style={{
              height: 200,
              width: 200,
              borderRadius: 20,
              position:'absolute',
              top:110,
              left:100,
              transform:[
                {translateX:50},
                {translateY:50},
                {rotate:"-15deg"}
              ]

            }}
          />
        </View>
        <View style={{
            paddingHorizontal:22,
            position:"absolute",
            top:400,
            width:"100%",

        }}>
            <Text style={{
                fontSize:50,
                fontWeight:800,
                color:Colors.white
            }}>Let's Get</Text>
            <Text style={{
                fontSize:46,
                fontWeight:800,
                color:Colors.white
            }}>Started</Text>
            <View style={{
                marginVertical:22
            }}>
                <Text style={{
                    fontSize:16,
                    color:Colors.white,
                    marginVertical:4
                }}>Suggestions for your youtube posts</Text>
                <Text style={{
                    fontSize:16,
                    color:Colors.white,
                    
                }}>Nice to meet you</Text>
            </View>
            <Button onPress={()=>navigation.navigate("signup")} title="Join Now" style={{marginTop:30,
                width:"100%"
            }}></Button>
            <View style={{
                flexDirection:'row',
                marginTop:20,
                justifyContent:'center'
            }}>
                <Text style={{fontSize:16,
                    color:Colors.white,

                }}>Already have an account?</Text>
                <Pressable onPress={()=>navigation.navigate("login")}>
                    <Text style={{fontSize:16,
                        color:Colors.white,
                        fontWeight:'bold',
                        marginLeft:4
                    }}>Login</Text>
                </Pressable>
            </View>
        </View>
      </View>
    </LinearGradient>
  );
}
