import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import * as Yup from 'yup';
import {
  Control,
  Path,
  SubmitHandler,
  useController,
  useForm,
} from 'react-hook-form';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const UPPER_CASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER_CASE = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '1234567890';
const SYMBOLS = '@#$&.!';

const PasswordSchema = Yup.object().shape({
  passwordLength: Yup.string()
    .min(4, 'Should be of min 4 characters')
    .max(16, 'Should be of max 16 characters')
    .required('Password Length is required.'),
});

type Password = {
  passwordLength: string;
};

export default function App() {
  const [password, setPassword] = useState('');
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasDigit, setHasDigit] = useState(false);
  const [hasSymbols, setHasSymbols] = useState(false);
  const [isPasswordGenerated, setIsPasswordGenerated] = useState(false);

  const {control, reset, handleSubmit} = useForm({
    defaultValues: {
      passwordLength: '',
    },
  });

  const createPassword = (characters: string, passwordLength: number) => {
    let result = '';
    for (let i = 0; i < passwordLength; i++) {
      const randomCharacterIndex = Math.round(
        Math.random() * characters.length,
      );
      result += characters.charAt(randomCharacterIndex);
    }
    return result;
  };

  const generatePasswordString = (passwordLength: number) => {
    let characters = '';
    if (hasLowerCase) {
      characters += LOWER_CASE;
    }
    if (hasUpperCase) {
      characters += UPPER_CASE;
    }
    if (hasDigit) {
      characters += DIGITS;
    }
    if (hasSymbols) {
      characters += SYMBOLS;
    }
    return  createPassword(characters, passwordLength);
  };

  const resetPasswordState = () => {
    setPassword('');
    setHasDigit(false);
    setHasUpperCase(false);
    setHasLowerCase(false);
    setHasSymbols(false);
    setIsPasswordGenerated(false);
  };

  const onGeneratePasswordHandler: SubmitHandler<Password> = (data) => {
    const password = generatePasswordString(+data.passwordLength)
    setIsPasswordGenerated(true);
    setPassword(password)
  }

  return (
    <SafeAreaView>
      <ScrollView style={styles.parentContainer} keyboardShouldPersistTaps="handled" >
        <View>
          <Text style={styles.headingText}>Password Generator</Text>
          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password Length: </Text>
              <Input control={control} name="passwordLength" />
            </View>
            <View style={[styles.inputWrapper, styles.checkboxContainer]}>
              <Text style={styles.inputLabel}>Inlcude lowercase : </Text>
              <View style={styles.bouncyCheckboxWrapper}>
                <BouncyCheckbox
                  disableBuiltInState
                  isChecked={hasLowerCase}
                  onPress={() => setHasLowerCase(!hasLowerCase)}
                  fillColor="#29AB87"
                  style={styles.bouncyCheckbox}
                />
              </View>
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Inlcude uppercase : </Text>
              <View style={styles.bouncyCheckboxWrapper}>
                <BouncyCheckbox
                  disableBuiltInState
                  isChecked={hasUpperCase}
                  onPress={() => setHasUpperCase(!hasUpperCase)}
                  fillColor="#FED85D"
                  style={styles.bouncyCheckbox}
                />
              </View>
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Inlcude digits : </Text>
              <View style={styles.bouncyCheckboxWrapper}>
                <BouncyCheckbox
                  disableBuiltInState
                  isChecked={hasDigit}
                  onPress={() => setHasDigit(!hasDigit)}
                  fillColor="#C9A0DC"
                  style={styles.bouncyCheckbox}
                />
              </View>
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Inlcude symbols : </Text>
              <View style={styles.bouncyCheckboxWrapper}>
                <BouncyCheckbox
                  disableBuiltInState
                  isChecked={hasSymbols}
                  onPress={() => setHasSymbols(!hasSymbols)}
                  fillColor="#FC80A5"
                  style={styles.bouncyCheckbox}
                />
              </View>
            </View>
            <View style={styles.btnContainer} >
              <TouchableOpacity style={[styles.btn, styles.generatePasswordBtn]} onPress={handleSubmit(onGeneratePasswordHandler)} >
                <Text style={styles.btnText} >Generate Password</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.resetBtn]} onPress={() => {
                resetPasswordState()
                reset()

              }} >
                <Text style={styles.btnText} >Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
          {
            isPasswordGenerated && (
              <View style={styles.generatedPasswordContainer} >
                <Text style={styles.title} >Generated Password: </Text>
                <Text style={styles.description} >Long press to copy</Text>
                <Text selectable style={styles.password} >{password}</Text>
              </View>
            )
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Input = ({
  control,
  name,
}: {
  control: Control<Password>;
  name: Path<Password>;
}) => {
  const {
    field: {onChange, value},
  } = useController({
    control,
    name: name,
  });
  return (
    <TextInput
      placeholder="Ex - 8"
      placeholderTextColor="#fff"
      value={value}
      onChangeText={onChange}
      inputMode="numeric"
      style={styles.input}
    />
  );
};

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
  formContainer: {
    paddingHorizontal: 10,
    flex: 1,
    gap: 10,
  },
  checkboxContainer: {
    marginTop: 15,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    color: '#fff',
    fontSize: 19,
    lineHeight: 21,
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    width: 100,
    color: '#fff',
  },
  bouncyCheckboxWrapper: {
    width: 100,
  },
  bouncyCheckbox: {
    height: 30,
    width: 30,
  },
  btnContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 15,
    justifyContent: "center",
    marginTop: 30
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 6
  },
  generatePasswordBtn: {
    backgroundColor: "#2F363F",
  },
  resetBtn: {
    backgroundColor: "#47535E",
    paddingHorizontal: 30
  },
  btnText: {
    color: "#fff",
    fontSize: 17,
    lineHeight: 19,
    fontWeight: "500"
  },
  generatedPasswordContainer: {
    marginTop: 30,
    flex: 1,
    gap: 2,
    borderRadius: 6,
    marginHorizontal: 30,
    backgroundColor: "#2B2B52",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15
  },
  title: {
    color: "#fff",
    fontSize: 17
  },
  description: {
    color: "#fff",
    fontSize: 16
  },
  password: {
    fontSize: 22,
    lineHeight: 25,
    color: "#fff",
    fontWeight: "500",
    marginTop: 15
  }
});
