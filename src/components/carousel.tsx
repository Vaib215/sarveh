import * as React from "react";
import { Dimensions, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import RNCarousel from "react-native-reanimated-carousel";
import { withAnchorPoint } from "../hooks/anchor-point";

interface CarouselItem {
  imageUrl: string;
}

interface CarouselProps {
  data: CarouselItem[];
}

const Carousel: React.FC<CarouselProps> = ({ data }) => {
  const { width, height } = Dimensions.get("window");
  const baseOptions = {
    width,
    height: height / 2,
  } as const;

  return (
    <View style={{ flex: 1 }}>
      <RNCarousel
        {...baseOptions}
        loop
        autoPlay={true}
        style={{
          marginLeft: -12
        }}
        autoPlayInterval={1500}
        data={data}
        renderItem={({ index, animationValue }) => (
          <Card
            width={width}
            height={height}
            animationValue={animationValue}
            key={index}
            index={index}
            item={data[index]}
          />
        )}
      />
    </View>
  );
};

interface CardProps {
  index: number;
  width: number;
  height: number;
  animationValue: Animated.SharedValue<number>;
  item: CarouselItem;
}

const Card: React.FC<CardProps> = ({
  index,
  width,
  height,
  animationValue,
  item,
}) => {
  const WIDTH = width / 1.25;
  const HEIGHT = height / 2.5;

  const cardStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      animationValue.value,
      [-0.1, 0, 1],
      [0.95, 1, 1],
      Extrapolate.CLAMP
    );

    const translateX = interpolate(
      animationValue.value,
      [-1, -0.2, 0, 1],
      [0, WIDTH * 0.3, 0, 0]
    );

    const transform = {
      transform: [
        { scale },
        { translateX },
        { perspective: 200 },
        {
          rotateY: `${interpolate(
            animationValue.value,
            [-1, 0, 0.4, 1],
            [30, 0, -25, -25],
            Extrapolate.CLAMP
          )}deg`,
        },
      ],
    };

    return {
      ...withAnchorPoint(
        transform,
        { x: 0.5, y: 0.5 },
        { width: WIDTH, height: HEIGHT }
      ),
    };
  }, [index]);

  const blockStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [0, 10, 30]
    );

    const translateY = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [0, -10, -40]
    );

    const rotateZ = interpolate(animationValue.value, [-1, 0, 1], [0, 0, -25]);

    return {
      transform: [{ translateX }, { translateY }, { rotateZ: `${rotateZ}deg` }],
    };
  }, [index]);

  return (
    <Animated.View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.View
        style={[
          {
            backgroundColor: '#9038FF',
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
            width: WIDTH,
            height: HEIGHT,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 8,
            },
            shadowOpacity: 0.44,
            shadowRadius: 10.32,
            elevation: 16,
          },
          cardStyle,
        ]}
      >
        <Animated.Image
          source={{
            uri: item.imageUrl,
          }}
          style={[
            {
              width: "100%",
              height: "100%",
              borderRadius: 16,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999,
            },
            blockStyle,
          ]}
          resizeMode={"contain"}
        />
      </Animated.View>
    </Animated.View>
  );
};

export default Carousel;
