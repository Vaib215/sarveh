import { Button, Heading, Text } from "tamagui";
import Carousel from "../../components/carousel";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { BaseView } from "../../components/layout/BaseView";
import React from "react";

export default function OnboardingScreen({ navigation }: { navigation: any }) {
  const scale = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withSpring(1);

    return () => {
      scale.value = withSpring(0);
    };
  }, []);

  return (
    <BaseView>
      <Heading
        className="mx-auto mb-auto mt-4 uppercase font-normal"
        color={"purple"}
      >
        Sarveh
      </Heading>
      <Animated.View
        style={{
          transform: [
            {
              scale,
            },
          ],
          position: "absolute",
          top: 48,
        }}
      >
        <Carousel
          data={[
            { imageUrl: "https://picsum.photos/200/300" },
            { imageUrl: "https://picsum.photos/200/300" },
            { imageUrl: "https://picsum.photos/200/300" },
            { imageUrl: "https://picsum.photos/200/300" },
            { imageUrl: "https://picsum.photos/200/300" },
          ]}
        />
      </Animated.View>
      <Text color="purple" className="mb-16 text-center text-lg">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam tenetur
        maxime tempore optio quam veritatis maiores eum quod eos aspernatur?
      </Text>
      <Button
        className="text-lg h-14 font-bold bg-purple-700 text-white"
        onPress={() => navigation.navigate("SignUp")}
      >
        Create an account
      </Button>
      <Button
        className="text-lg h-14 font-bold bg-white text-purple-700"
        onPress={() => navigation.navigate("SignIn")}
      >
        Login to existing account
      </Button>
    </BaseView>
  );
}
