import { ClerkProvider } from "@clerk/clerk-expo";
import { useFonts } from "@expo-google-fonts/inter";
import { config } from "@tamagui/config/v2";
import Constants from "expo-constants";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { TamaguiProvider, Theme, createTamagui } from "tamagui";
import store from "./src/state/store";
import Home from "./src/navigation/navigation";
import * as SecureStore from "expo-secure-store";

const tamaguiConfig = createTamagui(config);
type Conf = typeof tamaguiConfig;
declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}

SplashScreen.preventAutoHideAsync();

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      onLayout={() => {
        SplashScreen.hideAsync().catch(() => {});
      }}
    >
      <Provider store={store}>
        <StatusBar style="auto" />
        <GestureHandlerRootView style={{ flex: 1 }}>
          <TamaguiProvider config={tamaguiConfig}>
            <Theme name="purple">
              <ClerkProvider
                publishableKey={Constants.expoConfig.extra.clerkPublishableKey}
                tokenCache={tokenCache}
              >
                <Home />
              </ClerkProvider>
            </Theme>
          </TamaguiProvider>
        </GestureHandlerRootView>
      </Provider>
    </SafeAreaView>
  );
}
