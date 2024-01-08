import React from 'react';
import { Text as RNText, TextProps } from 'react-native';

interface Props {
  children: React.ReactNode;
  style?: TextProps["style"];
  className?: string;
  thickness?: "light" | "normal" | "medium" | "bold" | "extra-bold";
}

const Text: React.FC<Props> = ({ children, style, className, thickness }) => {
  
  let fontFamily = "";

  switch (thickness) {
    case "light":
      fontFamily = "Inter_300Light";
      break;
    case "normal":
      fontFamily = "Inter_400Regular";
      break;
    case "medium":
      fontFamily = "Inter_500Medium";
      break;
    case "bold":
      fontFamily = "Inter_700Bold";
      break;
    case "extra-bold":
      fontFamily = "Inter_800ExtraBold";
      break;
    default:
      fontFamily = "Inter_400Regular";
      break;
  }

  return (
    <RNText style={[{ fontFamily }, style]} className={className}>
      {children}
    </RNText>
  );
};

export default Text;