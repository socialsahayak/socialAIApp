import { useState } from "react";
import { StyleSheet,Text,View } from "react-native";
import Colors from "../constants/colors";
import OTPinput from "../components/OTPFied";
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
const OTP=({navigation})=>{
  const [code,setCode]=useState("");
  const [pinReady,setpinReady]=useState("");
  const MAX_CODE_LENGTH=4;

  return(
    <SafeAreaView style={{flex:1,backgroundColor:Colors.white}}>
      <View style={styles.container}>
      <Text style={styles.text}>Enter the received OTP</Text>
      <OTPinput
      setpinReady={setpinReady}
      code={code}
      setCode={setCode}
      maxLength={MAX_CODE_LENGTH}/>
    </View>
    </SafeAreaView>
    
  );
}
export default OTP;
const styles=StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:Colors.white,
    alignItems:'center',
    justifyContent:'center'
  },
  text:{
    color:Colors.black,
    fontSize:15,

  }
});