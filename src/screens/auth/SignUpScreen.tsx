import * as React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Button } from "tamagui";

export default function SignUpScreen({navigation}) {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  // start the sign up process.
  const onSignUpPress = async () => {
    if (!isLoaded && !signUp) return null

    try {
      await signUp.create({
        phoneNumber,
        password: phoneNumber,
      });

      // send the email.
      await signUp.preparePhoneNumberVerification();

      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // This verifies the user using email code that is delivered.
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const {status, createdSessionId} = await signUp.attemptPhoneNumberVerification({
        code,
      });
      if(status!=="complete") {
        throw new Error("Sign up failed.")
      }
      await setActive({ session: createdSessionId });
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View>
      <Text>Signup</Text>
      {!pendingVerification && (
        <View>
          <TextInput
            autoCapitalize="none"
            value={phoneNumber}
            placeholder="Phone..."
            onChangeText={(phone) => setPhoneNumber(phone)}
            autoComplete="tel"
          />
          <TouchableOpacity onPress={onSignUpPress}>
            <Text>Send OTP</Text>
          </TouchableOpacity>
          <Button onPress={() => navigation.navigate("SignIn")}>Sign In Instead</Button>
        </View>
      )}
      {pendingVerification && (
        <View>
          <View>
            <TextInput
              value={code}
              placeholder="Code..."
              onChangeText={(code) => setCode(code)}
            />
          </View>
          <TouchableOpacity onPress={onPressVerify}>
            <Text>Verify OTP</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
