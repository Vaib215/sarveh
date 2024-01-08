import { PhoneCodeFactor, SignInFirstFactor } from "@clerk/types";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Text } from "tamagui";
import { useSignIn } from "@clerk/clerk-expo";
import React from "react";
import { View } from "react-native";

export default function SignInScreen() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [code, setCode] = React.useState("");

  async function onSignInPress() {
    if (!isLoaded && !signIn) return null;
    try {
      const { supportedFirstFactors } = await signIn.create({
        identifier: phoneNumber,
      });

      // Filter the returned array to find the 'phone_code' entry
      const isPhoneCodeFactor = (
        factor: SignInFirstFactor
      ): factor is PhoneCodeFactor => {
        return factor.strategy === "phone_code";
      };
      const phoneCodeFactor = supportedFirstFactors?.find(isPhoneCodeFactor);

      if (phoneCodeFactor) {
        // Grab the phoneNumberId
        const { phoneNumberId } = phoneCodeFactor;

        // Send the OTP code to the user
        await signIn.prepareFirstFactor({
          strategy: "phone_code",
          phoneNumberId,
        });

        // Set 'verifying' true to display second form and capture the OTP code
        setPendingVerification(true);
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling for more on error handling
      console.error("Error:", JSON.stringify(err, null, 2));
    }
  }

  async function onPressVerify() {
    if (!isLoaded && !signIn) return null;

    try {
      // Use the code provided by the user and attempt verification
      const completeSignIn = await signIn.attemptFirstFactor({
        strategy: "phone_code",
        code,
      });

      // This mainly for debuggin while developing.
      // Once your Instance is setup this should not be required.
      if (completeSignIn.status !== "complete") {
        console.error(JSON.stringify(completeSignIn, null, 2));
      }

      // If verification was completed, create a session for the user
      if (completeSignIn.status === "complete") {
        await setActive({ session: completeSignIn.createdSessionId });

        // Redirect user
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling for more on error handling
      console.error("Error:", JSON.stringify(err, null, 2));
    }
  }

  return (
    <View>
      {!pendingVerification && (
        <View>
          <TextInput
            autoCapitalize="none"
            value={phoneNumber}
            placeholder="Phone..."
            onChangeText={(phone) => setPhoneNumber(phone)}
            autoComplete="tel"
          />
          <TouchableOpacity onPress={onSignInPress}>
            <Text>Send OTP</Text>
          </TouchableOpacity>
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
