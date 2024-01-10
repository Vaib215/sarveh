import { useAuth, useUser } from "@clerk/clerk-expo";
import React from "react";
import { View } from "react-native";
import { Button, Heading, Text } from "tamagui";
import { BaseView } from "../components/layout/BaseView";

const SignOut = () => {
  const { isLoaded, signOut } = useAuth();
  if (!isLoaded) {
    return null;
  }
  return (
    <View>
      <Button
        onPress={() => {
          signOut();
        }}
      >
        Sign Out
      </Button>
    </View>
  );
};

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const { user } = useUser();

  if (!user?.firstName) {
    return (
      <View
        onLayout={() => {
          navigation.navigate("ProfileCompletion");
        }}
      ></View>
    );
  }

  return (
    <BaseView>
      <Heading>
        Hello, {user?.firstName}
      </Heading>
      <SignOut />
    </BaseView>
  );
};

export default HomeScreen;
