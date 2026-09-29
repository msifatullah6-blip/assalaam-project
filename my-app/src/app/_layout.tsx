import { Stack } from "expo-router";
import { StackScreen } from "expo-router/build/layouts/stack-utils/StackScreen";

export default function RootLayout() {
  return (
    <Stack>
      <StackScreen name="index" options={{ title: "Assalaam" }} />
      <StackScreen name="input" options={{ title: "Input Produk" }} />
    </Stack>
  );
}
