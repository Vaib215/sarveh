import { useAuth } from "@clerk/clerk-expo";
import { View } from "react-native";
import { Button } from "tamagui";

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

const HomeScreen = () => {
  return (
    <View className="">
      <Button> Hello</Button>
      <SignOut />
    </View>
  );
};

export default HomeScreen;
