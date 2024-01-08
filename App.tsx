import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/inter";
import { config } from "@tamagui/config/v2";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { TamaguiProvider, createTamagui, Theme } from "tamagui";
import Home from "./src/screens";
import store from "./src/state/store";
import { SafeAreaView } from "react-native-safe-area-context";

const tamaguiConfig = createTamagui(config);
type Conf = typeof tamaguiConfig;
declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    Inter_800ExtraBold,
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
              <Home />
            </Theme>
          </TamaguiProvider>
        </GestureHandlerRootView>
      </Provider>
    </SafeAreaView>
  );
}
