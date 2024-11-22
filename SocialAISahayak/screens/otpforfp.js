import { useState } from "react";
import { StyleSheet,Text,View ,Pressable,Keyboard} from "react-native";
import Colors from "../constants/colors";
import OTPinput from "../components/OTPFied";
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "react-native-elements";
import Button from "../components/Button";
import { Image } from "react-native-elements";
import ChangePasswordModal from "../components/changePassword";
const OTP=({navigation})=>{
  const [code,setCode]=useState("");
  const [PinReady,setPinReady]=useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const MAX_CODE_LENGTH=4;
  const handleSubmit = () => {
    if (code.length === MAX_CODE_LENGTH) {
      // Simulate OTP verification success
      setIsModalVisible(true); // Open Change Password Modal
    } else {
      alert("Please enter the full OTP code.");
    }
  };

  return(
    <SafeAreaView style={{flex:1,backgroundColor:Colors.white}}>
      <Pressable style={styles.container} onPress={Keyboard.dismiss}>
      <View style={{
            flexDirection:'row',
            justifyContent:'center'
        }} >
            <Image source={require("../assets/verify.jpeg")}
            style={{
                height:300,
                width:300
            }}></Image>
        </View>
      <Text style={styles.text}>We've send you the verification code </Text>
      <OTPinput
      setPinReady={setPinReady}
      code={code}
      setCode={setCode}
      maxLength={MAX_CODE_LENGTH}/>
      <Button
          title="Change Password"
          filled
          style={{
            marginTop: 18,
            width: "80%",
          }}
          onPress={handleSubmit} // Show the modal
        />
       
        <View style={{
          flexDirection:'row',
          justifyContent:'center',
          marginVertical:22
        }}>
          <Text style={{fontSize:16,color:Colors.black}}>Didn't get code yet?</Text>
          <Pressable 
          onPress={()=>navigation.navigate("")}>
            <Text style={{
              fontSize:16,
              color:Colors.primary,
              fontWeight:'bold',
              marginLeft:6,
            }}>Resend OTP</Text>
          </Pressable>
        </View>
    </Pressable>
    <ChangePasswordModal
        modalVisible={isModalVisible}
        setModalVisible={setIsModalVisible}
      />
    </SafeAreaView>
    
  );
}
export default OTP;
const styles=StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:Colors.white,
    alignItems:'center',
    justifyContent:'flex-start',
    paddingTop:20

  },
  text:{
    color:Colors.black,
    fontSize:15,

  }
});