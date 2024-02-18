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
import * as z from 'zod';
import {
  Control,
  Controller,
  Path,
  SubmitHandler,
  useController,
  useForm,
} from 'react-hook-form';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {zodResolver} from '@hookform/resolvers/zod';

const UPPER_CASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER_CASE = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '1234567890';
const SYMBOLS = '@#$&.!';

const createPassword = (characters: string, passwordLength: number) => {
  let result = '';
  for (let i = 0; i < passwordLength; i++) {
    const randomCharacterIndex = Math.round(Math.random() * characters.length);
    result += characters.charAt(randomCharacterIndex);
  }
  return result;
};

const generatePasswordString = (data: GeneratedPassword) => {
  let characters = '';
  if (data.hasLowerCase) {
    characters += LOWER_CASE;
  }
  if (data.hasUpperCase) {
    characters += UPPER_CASE;
  }
  if (data.hasDigit) {
    characters += DIGITS;
  }
  if (data.hasSymbol) {
    characters += SYMBOLS;
  }
  return createPassword(characters, data.passwordLength);
};

const passwordSchema = z.object({
  passwordLength: z
    .number({
      required_error: 'Password Length is required.',
      invalid_type_error: 'Password length must be number.',
    })
    .gte(4, {message: 'Should be greater than or equal to 4'})
    .lte(16, {message: 'Should be less than or equal to 16'}),
  hasLowerCase: z.boolean().optional(),
  hasUpperCase: z.boolean().optional(),
  hasDigit: z.boolean().optional(),
  hasSymbol: z.boolean().optional(),
});

type GeneratedPassword = z.infer<typeof passwordSchema>;

export default function App() {
  const [password, setPassword] = useState('');
  const [isPasswordGenerated, setIsPasswordGenerated] = useState(false);

  const {
    control,
    reset,
    handleSubmit,
    formState: {errors},
  } = useForm<GeneratedPassword>({
    defaultValues: {
      passwordLength: 4,
      hasLowerCase: false,
      hasUpperCase: false,
      hasDigit: false,
      hasSymbol: false,
    },
    resolver: zodResolver(passwordSchema),
  });

  const onGeneratePasswordHandler: SubmitHandler<GeneratedPassword> = data => {
    const password = generatePasswordString(data);
    setIsPasswordGenerated(true);
    setPassword(password);
  };

  return (
    <SafeAreaView>
      <ScrollView
        style={styles.parentContainer}
        keyboardShouldPersistTaps="handled">
        <View>
          <Text style={styles.headingText}>Password Generator</Text>
          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputLabelWithErrorContainer}>
                <Text style={styles.inputLabel}>Password Length: </Text>
                {errors.passwordLength?.message && (
                  <Text style={styles.error}>
                    {errors.passwordLength.message}
                  </Text>
                )}
              </View>
              <Input control={control} name="passwordLength" />
            </View>

            <View style={[styles.inputWrapper, styles.checkboxContainer]}>
              <Text style={styles.inputLabel}>Inlcude lowercase : </Text>
              <View style={styles.bouncyCheckboxWrapper}>
                <ControlledBouncyCheckbox
                  control={control}
                  name="hasLowerCase"
                  fillColor="#29AB87"
                />
              </View>
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Inlcude uppercase : </Text>
              <View style={styles.bouncyCheckboxWrapper}>
                <ControlledBouncyCheckbox
                  control={control}
                  name="hasUpperCase"
                  fillColor="#FED85D"
                />
              </View>
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Inlcude digits : </Text>
              <View style={styles.bouncyCheckboxWrapper}>
                <ControlledBouncyCheckbox
                  control={control}
                  name="hasDigit"
                  fillColor="#C9A0DC"
                />
              </View>
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Inlcude symbols : </Text>
              <View style={styles.bouncyCheckboxWrapper}>
                <ControlledBouncyCheckbox
                  control={control}
                  name="hasSymbol"
                  fillColor="#FC80A5"
                />
              </View>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={[styles.btn, styles.generatePasswordBtn]}
                onPress={handleSubmit(onGeneratePasswordHandler)}>
                <Text style={styles.btnText}>Generate Password</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.resetBtn]}
                onPress={() => {
                  reset();
                  setIsPasswordGenerated(false);
                  setPassword('');
                }}>
                <Text style={styles.btnText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
          {isPasswordGenerated && (
            <View style={styles.generatedPasswordContainer}>
              <Text style={styles.title}>Generated Password: </Text>
              <Text style={styles.description}>Long press to copy</Text>
              <Text selectable style={styles.password}>
                {password}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ControlledBouncyCheckbox = ({
  control,
  name,
  fillColor,
}: {
  control: Control<GeneratedPassword>;
  name: Path<GeneratedPassword>;
  fillColor?: string;
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({field: {value, onChange}}) => {
        return (
          <BouncyCheckbox
            disableBuiltInState
            isChecked={typeof value === 'boolean' ? value : false}
            onPress={() => onChange(!value)}
            fillColor={fillColor}
            style={styles.bouncyCheckbox}
          />
        );
      }}
    />
  );
};

const Input = ({
  control,
  name,
}: {
  control: Control<GeneratedPassword>;
  name: Path<GeneratedPassword>;
}) => {
  const {
    field: {onChange, value},
  } = useController({
    control,
    name: name,
  });
  return (
    <Controller
      control={control}
      name={name}
      render={({field: {value, onChange}}) => {
        return (
          <TextInput
            placeholder="Ex - 8"
            placeholderTextColor="#fff"
            value={typeof value === 'number' ? `${value}` : ''}
            onChangeText={text => onChange(Number(text))}
            inputMode="numeric"
            style={styles.input}
          />
        );
      }}
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
  inputLabelWithErrorContainer: {
    flex: 1,
    gap: 4,
  },
  error: {
    fontSize: 14,
    color: '#E8290B',
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
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'center',
    marginTop: 30,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  generatePasswordBtn: {
    backgroundColor: '#2F363F',
  },
  resetBtn: {
    backgroundColor: '#47535E',
    paddingHorizontal: 30,
  },
  btnText: {
    color: '#fff',
    fontSize: 17,
    lineHeight: 19,
    fontWeight: '500',
  },
  generatedPasswordContainer: {
    marginTop: 30,
    flex: 1,
    gap: 2,
    borderRadius: 6,
    marginHorizontal: 30,
    backgroundColor: '#2B2B52',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  title: {
    color: '#fff',
    fontSize: 17,
  },
  description: {
    color: '#fff',
    fontSize: 16,
  },
  password: {
    fontSize: 22,
    lineHeight: 25,
    color: '#fff',
    fontWeight: '500',
    marginTop: 15,
  },
});
