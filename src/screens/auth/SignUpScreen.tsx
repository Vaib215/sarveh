import { ActivityIndicator, TextInput, ToastAndroid } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Button, Text, View, Heading, Input } from "tamagui";
import { BaseView } from "../../components/layout/BaseView";
import LottieView from "lottie-react-native";
import React from "react";

export default function SignUpScreen({ navigation }) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [loading, setLoading] = React.useState(false);

  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const onSignUpPress = async () => {
    if (!isLoaded && !signUp) return null;

    try {
      setLoading(true);
      await signUp.create({
        phoneNumber: "+91" + phoneNumber,
        password: "+91" + phoneNumber,
      });

      await signUp.preparePhoneNumberVerification();

      setPendingVerification(true);
    } catch (err: any) {
      ToastAndroid.show(err.errors[0].message, ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      setLoading(true);
      const { status, createdSessionId } =
        await signUp.attemptPhoneNumberVerification({
          code,
        });
      if (status !== "complete") {
        throw new Error("Sign up failed.");
      }
      await setActive({ session: createdSessionId });
    } catch (err: any) {
      ToastAndroid.show(err.errors[0].message, ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseView>
      <Heading className="mx-auto mt-4 font-normal" color={"purple"}>
        Create an account
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
      {!pendingVerification ? (
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
            onPress={onSignUpPress}
            disabled={phoneNumber.length !== 10}
          >
            {loading ? <ActivityIndicator color="white" /> : "Send code"}
          </Button>
        </View>
      ) : (
        <View>
          <View>
            <Input
              value={code}
              placeholder="Enter your code"
              onChangeText={(code) => setCode(code)}
              autoComplete="sms-otp"
              keyboardType="number-pad"
              maxLength={6}
              className="text-lg h-14"
            />
          </View>
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
        onPress={() => navigation.navigate("SignIn")}
      >
        Login to existing account
      </Button>
    </BaseView>
  );
}
