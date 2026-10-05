import { Text, View, ScrollView, Image, Alert, Pressable } from "react-native";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import db from "../../db/firebaseConfig";
import { Button } from "expo-router/build/react-navigation";
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react";
import s from "./style/styles";

type Price = {
  name: string;
  price: string;
  desc: string;
  image: string[];
};

export default function Detail(){
    const param = useLocalSearchParams<{id: string}>()
    const router = useRouter()
    const [ data, setData ] = useState<Price>()

    useEffect(() => {
        const fetchPrices = async () => {
        try {
            const snapshot = await getDoc(doc(db, "prices", param.id));
            if (!snapshot.exists()) {
                console.warn("No such document!");
                return;
            }

            // 2. Now it's safe to read data + include the id
            const result = snapshot.data();
            const d: Price = {
                name: result.name,
                price: result.price,
                desc: result.desc,
                image: result.image,
            };
            setData(d)
        } catch (err) {
            console.error("Error fetching prices:", err);
        }
        };
        fetchPrices();
    }, [data])

    if (!data) {
        return (
            <View style={s.container}>
                <Text style={s.text}>Loading...</Text>
            </View>
        );
    }

    return(
        <View style={[s.container, {gap: 12}]}>
            <ScrollView>
            {
                !data.image[0]?<View style={s.image} />:<Image style={s.image} source={{uri: data.image[0]}}></Image>
            }
            <View style={[s.listContainer, {gap: 12}]}>
                <Text style={s.text}>Nama: {data.name}</Text>
                <Text style={s.text}>Harga: Rp. {data.price}</Text>
                <Text style={s.text}>Deskripsi:</Text>
                <Text style={[{backgroundColor: '#223', padding: 10, borderRadius: 12, color: '#fff8', fontSize: 16}]}>{data.desc}</Text>
                <Button onPress={async () => {
                    try{
                        Alert.alert('Konfirmasi', 'Anda Yakin Ingin Menghapus?', [
                            {text: 'Tidak', onPress: () => console.log('Batal Menghapus')},
                            {text: 'Ya', onPress: async () => {
                                await deleteDoc(doc(db, 'prices', param.id))
                                router.back()
                            }}
                        ])
                    }catch(err){
                        console.log(err)
                    }
                }}>Hapus</Button>
                <Button onPress={() => router.push({
                    pathname: '/input', params: {id: param.id, name: data.name, price: data.price, desc: data.desc}
                })}>Edit</Button>
            </View>
            {!data.image[0]?<></>:<ScrollView horizontal={true}>
                {
                    data.image.map((i, index) => 
                        <Pressable key={index} onPress={() => router.push({pathname: '/showimage', params: {image: i}})}>
                            <Image style={[s.image, {width: 250, marginRight: 10}]} source={{uri: i}}></Image>
                        </Pressable>
                    )
                }
            </ScrollView>}
        </ScrollView>
        </View>
    )
}
