import { useLocalSearchParams } from "expo-router";
import { Image, View } from "react-native";
import s from "./style/styles";

export default function ShowImage() {
    const params = useLocalSearchParams<{image: string}>()

    return(
        <View style={[s.container, {justifyContent: 'center', alignItems: 'center', padding: 0}]}>
            <Image style={{width: '100%', height: '100%', resizeMode: "contain"}} source={{uri: params.image}}></Image>
        </View>
    )
}