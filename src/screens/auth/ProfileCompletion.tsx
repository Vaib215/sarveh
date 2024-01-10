import { Button, Input, Label, Text } from "tamagui";
import { BaseView } from "../../components/layout/BaseView";
import React from "react";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Calendar } from "@tamagui/lucide-icons";
export default function ProfileCompletion() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [dob, setDob] = React.useState<Date | null>(null);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDob(currentDate);
  };

  const show = () => {
    DateTimePickerAndroid.open({
      value: dob ?? new Date(),
      onChange,
      mode: "date",
    });
  };
  return (
    <BaseView>
      <Text>Can we know you?</Text>

      <Label>What should we call you?</Label>
      <Input placeholder="Name" />

      <Label>What's your email?</Label>
      <Input placeholder="Email" />

      <Label>When were you born?</Label>
      <Button icon={Calendar} onPress={show}>
        {dob ? <Text>{dob.toDateString()}</Text> : "Pick a date"}
      </Button>
    </BaseView>
  );
}
