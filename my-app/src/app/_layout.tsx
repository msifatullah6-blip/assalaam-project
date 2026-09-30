import { Color, Stack } from "expo-router";
import { StackScreen } from "expo-router/build/layouts/stack-utils/StackScreen";

export default function RootLayout() {
  return (
    <Stack>
      <StackScreen name="index" options={{
         title: "Assalaam", 
         headerStyle: {backgroundColor: '#111'},
         headerTitleStyle: {fontWeight: 'bold', fontSize: 30},
         headerTintColor: '#fff'
         }} />
      <StackScreen name="input" options={{
         title: "Input Produk", 
         headerStyle: {backgroundColor: '#111'},
         headerTitleStyle: {fontWeight: 'bold', fontSize: 30},
         headerTintColor: '#fff'
         }} />
    </Stack>
  );
}
