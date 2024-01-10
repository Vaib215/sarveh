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

      const isPhoneCodeFactor = (
        factor: SignInFirstFactor
      ): factor is PhoneCodeFactor => {
        return factor.strategy === "phone_code";
      };
      const phoneCodeFactor = supportedFirstFactors?.find(isPhoneCodeFactor);

      if (phoneCodeFactor) {
        const { phoneNumberId } = phoneCodeFactor;

        await signIn.prepareFirstFactor({
          strategy: "phone_code",
          phoneNumberId,
        });
        setPendingVerification(true);
      }
    } catch (err) {
      console.error("Error:", JSON.stringify(err, null, 2));
    }
  }

  async function onPressVerify() {
    if (!isLoaded && !signIn) return null;

    try {
      const completeSignIn = await signIn.attemptFirstFactor({
        strategy: "phone_code",
        code,
      });

      if (completeSignIn.status !== "complete") {
        console.error(JSON.stringify(completeSignIn, null, 2));
      }

      if (completeSignIn.status === "complete") {
        await setActive({ session: completeSignIn.createdSessionId });
      }
    } catch (err) {
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
