import { Color, Stack } from "expo-router";
import { StackScreen } from "expo-router/build/layouts/stack-utils/StackScreen";

export default function RootLayout() {
  return (
    <Stack>
      <StackScreen name="index" options={{
         title: "Assalaam", 
         headerStyle: {backgroundColor: '#3464eb'},
         headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
         headerTintColor: '#fff'
         }} />
      <StackScreen name="input" options={{
         title: "Input Produk", 
         headerStyle: {backgroundColor: '#3464eb'},
         headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
         headerTintColor: '#fff'
         }} />
        <StackScreen name="tesimage" options={{title: "testing image"}}></StackScreen>
        <StackScreen name="detail" options={{
          title: "Detail Produk",
          headerStyle: {backgroundColor: '#3464eb'},
          headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
          headerTintColor: '#fff'
        }}></StackScreen>
        <StackScreen name="showimage" options={{
          title: "Gambar Produk",
          headerStyle: {backgroundColor: '#3464eb'},
          headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
          headerTintColor: '#fff'
        }}></StackScreen>
    </Stack>
  );
}