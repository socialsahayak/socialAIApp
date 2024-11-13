import { View, Text } from 'react-native'
import React from 'react'
import Colors from "../constants/colors";
import styled from 'styled-components';
export const OTPInputSection=styled.View`
  justify-content:center;
  align-items:center;
  margin-vertical:30px`;
export const HiddenTextInput=styled.TextInput`
  border-color:${Colors.secondary};
  border-width:2px;
  border-radius:5px;
  padding:12px;
  margin-top:15px;
  width:300px;
  color:${Colors.white}`;
const OTPinput = () => {
  return (
    <OTPInputSection>
        <HiddenTextInput/>
    </OTPInputSection>
  )
}

export default OTPinput;