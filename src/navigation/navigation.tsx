import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import SignUpScreen from "../screens/auth/SignUpScreen";
import HomeScreen from "../screens";
import SignInScreen from "../screens/auth/SignInScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

interface ILoginStatus {
  status: boolean | string;
}

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Home"
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
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
      <SignedIn>
        <HomeStack />
      </SignedIn>
      <SignedOut>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="SignUp"
        >
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </SignedOut>
    </NavigationContainer>
  );
}
