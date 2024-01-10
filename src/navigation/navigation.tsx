import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import SignUpScreen from "../screens/auth/SignUpScreen";
import HomeScreen from "../screens";
import SignInScreen from "../screens/auth/SignInScreen";
import OnboardingScreen from "../screens/auth/OnboardingScreen";
import ProfileCompletion from "../screens/auth/ProfileCompletion";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

interface ILoginStatus {
  status: boolean | string;
}

const HomeStack = () => {
  const { isSignedIn } = useUser();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={"Home"}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="ProfileCompletion" component={ProfileCompletion} />
    </Stack.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      // initialRouteName="Onboarding"
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
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
        <AuthStack />
      </SignedOut>
    </NavigationContainer>
  );
}
