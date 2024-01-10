import { Button, Heading, Input, Label, Text } from "tamagui";
import { BaseView } from "../../components/layout/BaseView";
import React from "react";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useUser } from "@clerk/clerk-expo";
import dayjs from "dayjs";
export default function ProfileCompletion({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [dob, setDob] = React.useState<Date | null>(null);
  const { user, isSignedIn } = useUser();

  const onChange = (_: any, selectedDate: Date) => {
    const currentDate = selectedDate;
    setDob(currentDate);
  };

  const show = () => {
    DateTimePickerAndroid.open({
      value: dob ?? new Date(),
      onChange,
      maximumDate: dayjs().subtract(8, "years").toDate(),
      mode: "date",
    });
  };

  const handleProfileCompletion = async () => {
    try {
      if (isSignedIn) {
        await user.update({
          firstName,
          lastName,
          unsafeMetadata: {
            dob: dayjs(dob).format("YYYY-MM-DD"),
          },
        });
      }
    } catch (err: any) {
      console.error({ err });
    } finally {
      navigation.navigate("Home");
    }
  };

  return (
    <BaseView>
      <Heading>Complete your profile</Heading>
      <Text>
        We need a few more details to get you started with your account
      </Text>

      <Label>What should we call you?</Label>
      <Input
        placeholder="First Name"
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        onChangeText={setFirstName}
      />

      <Input
        placeholder="Last Name"
        autoCapitalize="words"
        autoComplete="name"
        className="mt-2"
        textContentType="name"
        onChangeText={setLastName}
      />

      <Label>When were you born?</Label>
      <Button onPress={show}>
        {dob ? <Text>{dob.toDateString()}</Text> : "Pick a date"}
      </Button>

      <Button
        className={`text-lg h-14 mt-4 font-bold text-white ${
          firstName.length > 0 && lastName.length && dob
            ? "bg-purple-700"
            : "hidden"
        }`}
        onPress={handleProfileCompletion}
      >
        Continue
      </Button>
    </BaseView>
  );
}
