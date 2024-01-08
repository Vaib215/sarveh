import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSelector } from "react-redux";
import { useLoginStatus  } from "../hooks";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

interface ILoginStatus {
  status: boolean | string;
}

const HomeStack = () => {
  const { status } = useLoginStatus();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status !== "") {
      setIsLoading(false);
    }
  }, [status]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Home"
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default function Home() {
  return (
    <NavigationContainer>
      <HomeStack />
    </NavigationContainer>
  );
}
