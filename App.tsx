import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, { useState } from 'react';
import * as Yup from 'yup';

const UPPER_CASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER_CASE = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '1234567890';
const SYMBOLS = '@#$&.!'

const PasswordSchema = Yup.object().shape({
  passwordLength: Yup.number()
    .min(4, 'Should be of min 4 characters')
    .max(16, 'Should be of max 16 characters')
    .required('Password Length is required.'),
});

export default function App() {
  const [password, setPassword] = useState("")
  const [hasLowerCase, setHasLowerCase] = useState(false)
  const [hasUpperCase, setHasUpperCase] = useState(false)
  const [hasDigit, setHasDigit] = useState(false)
  const [hasSymbols, setHasSymbols] = useState(false)
  const [isPasswordGenerated, setIsPasswordGenerated] = useState(false)


  const createPassword = (characters: string, passwordLength: number) => {
    let result = ""
    for(let i=0;i<passwordLength;i++){
      const randomCharacterIndex = Math.round(Math.random() * characters.length)
      result += characters.charAt(randomCharacterIndex)
    }
    return result
  }

  const generatePasswordString = (passwordLength: number) => {
    let characters = ""
    if(hasLowerCase) {
      characters += LOWER_CASE
    }
    if(hasUpperCase) {
      characters += UPPER_CASE
    }
    if(hasDigit) {
      characters += DIGITS
    }
    if(hasSymbols) {
      characters += SYMBOLS
    }
    const password = createPassword(characters, passwordLength)
    setIsPasswordGenerated(true)
    return password
  }

  const resetPasswordState = () => {
    setPassword("")
    setHasDigit(false)
    setHasUpperCase(false)
    setHasLowerCase(false)
    setHasSymbols(false)
    setIsPasswordGenerated(false)
  }

  return (
    <SafeAreaView>
      <ScrollView style={styles.parentContainer}>
        <View>
          <Text style={styles.headingText}>Password Generator</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  parentContainer: {
    backgroundColor: '#414141',
    height: '100%',
  },
  headingText: {
    fontSize: 27,
    lineHeight: 31,
    color: '#fff',
    padding: 10,
  },
});
