import { View, Text } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import Colors from "../constants/colors";
import styled from 'styled-components';

export const OTPInputSection = styled.View`
  justify-content: center;
  align-items: center;
  margin-vertical: 30px;
`;

export const HiddenTextInput = styled.TextInput`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
`;

export const OTPInputContainer = styled.Pressable`
  width: 70%;
  flex-direction: row;
  justify-content: space-around;
`;

export const OTPInput = styled.View`
  border-color: ${Colors.secondary};
  min-width: 15%;
  border-width: 2px;
  border-radius: 5px;
  padding: 12px;
`;

export const OTPInputText = styled.Text`
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  color: ${Colors.black};
`;

export const OTPInputFocused = styled(OTPInput)`
  background-color: ${Colors.primary};
`;

const OTPinput = ({ setPinReady, code, setCode, maxLength }) => {
  const codeDigitsArray = new Array(maxLength).fill(0);
  const textInputRef = useRef(null);
  const [inputContainerIsFocused, setInputContainerIsFocused] = useState(false);

  const handleOnPress = () => {
    setInputContainerIsFocused(true);
    textInputRef?.current?.focus();
  };

  const handleOnBlur = () => {
    setInputContainerIsFocused(false);
  };

  useEffect(() => {
    setPinReady(code.length === maxLength);
    return () => setPinReady(false);
  }, [code]);

  const renderDigitInput = (_value, index) => {
    const emptyInputChar = " ";
    const digit = code[index] || emptyInputChar;
    const isCurrentDigit = index === code.length;
    const isLastDigit = index === maxLength - 1;
    const isCodeFull = code.length === maxLength;
    const isDigitFocused = isCurrentDigit || (isLastDigit && isCodeFull);
    const StyledOTPInput = inputContainerIsFocused && isDigitFocused ? OTPInputFocused : OTPInput;

    return (
      <StyledOTPInput key={index}>
        <OTPInputText>{digit}</OTPInputText>
      </StyledOTPInput>
    );
  };

  return (
    <OTPInputSection>
      <OTPInputContainer onPress={handleOnPress}>
        {codeDigitsArray.map(renderDigitInput)}
      </OTPInputContainer>
      <HiddenTextInput
        ref={textInputRef}
        value={code}
        onChangeText={setCode}
        maxLength={maxLength}
        keyboardType="number-pad"
        returnKeyType="done"
        textContentType="oneTimeCode"
        onBlur={handleOnBlur}
      />
    </OTPInputSection>
  );
};

export default OTPinput;
