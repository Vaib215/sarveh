import { PhoneCodeFactor, SignInFirstFactor } from "@clerk/types";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Button, Heading, Input, Text } from "tamagui";
import { useSignIn } from "@clerk/clerk-expo";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import LottieView from "lottie-react-native";
import { BaseView } from "../../components/layout/BaseView";

export default function SignInScreen({ navigation }: { navigation: any }) {
  const [loading, setLoading] = React.useState(false);
  const { isLoaded, signIn, setActive } = useSignIn();
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [code, setCode] = React.useState("");

  async function onSignInPress() {
    if (!isLoaded && !signIn) return null;
    try {
      setLoading(true);
      const { supportedFirstFactors } = await signIn.create({
        identifier: "+91" + phoneNumber,
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
    } finally {
      setLoading(false);
    }
  }

  async function onPressVerify() {
    if (!isLoaded && !signIn) return null;

    try {
      setLoading(true);
      const completeSignIn = await signIn.attemptFirstFactor({
        strategy: "phone_code",
        code,
      });

      if (completeSignIn.status !== "complete") {
        console.error(JSON.stringify(completeSignIn, null, 2));
      }

      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err) {
      console.error("Error:", JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  }

  return (
    <BaseView>
      <Heading className="mx-auto mt-4 font-normal" color={"purple"}>
        Login to existing account
      </Heading>
      <LottieView
        style={{
          flex: 1,
          transform: [{ scale: 1.5 }],
        }}
        source={require("../../../assets/animations/guard.json")}
        autoPlay
        loop
      />
      {!pendingVerification && (
        <View className="mx-2">
          <Text className="text-lg text-center mb-4">
            Enter your phone number and we will send you a verification code.
          </Text>
          <Input
            value={phoneNumber}
            placeholder="Enter your phone number"
            onChangeText={(phone) => setPhoneNumber(phone)}
            autoComplete="tel"
            maxLength={10}
            keyboardType="phone-pad"
            className="text-lg h-14"
          />
          <Button
            className={`text-lg h-14 mt-4 font-bold text-white ${
              phoneNumber.length === 10 ? "bg-purple-700" : ""
            }`}
            onPress={onSignInPress}
            disabled={phoneNumber.length !== 10}
          >
            {loading ? <ActivityIndicator color="white" /> : "Send code"}
          </Button>
        </View>
      )}
      {pendingVerification && (
        <View className="mx-2">
          <Input
            value={code}
            placeholder="Enter your code"
            onChangeText={(code) => setCode(code)}
            autoComplete="sms-otp"
            keyboardType="number-pad"
            maxLength={6}
            className="text-lg h-14"
          />
          <Button
            className={`text-lg h-14 mt-4 font-bold bg-purple-700 text-white ${
              code.length === 6 ? "bg-purple-700" : ""
            }`}
            onPress={onPressVerify}
          >
            {loading ? <ActivityIndicator color="white" /> : "Verify"}
          </Button>
        </View>
      )}
      <Button
        className="text-lg h-14 font-bold bg-white text-purple-700"
        onPress={() => navigation.navigate("SignUp")}
      >
        Create an account
      </Button>
    </BaseView>
  );
}
