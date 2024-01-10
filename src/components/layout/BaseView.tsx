import { View } from "tamagui"

export const BaseView = ({children}) => {
  return (
    <View className="p-2 flex-1 bg-white">
      {children}
    </View>
  )
}