import { Text, View, StyleSheet, ScrollView, Image, Alert } from "react-native";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import db from "../../db/firebaseConfig";
import { Button } from "expo-router/build/react-navigation";
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react";

type Price = {
  name: string;
  price: string;
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
            <View style={styles.container}>
                <Text style={styles.text}>Loading...</Text>
            </View>
        );
    }

    return(
        <View style={styles.container}>
            <ScrollView>
            {
                !data.image[0]?<View style={styles.image} />:<Image style={styles.image} source={{uri: data.image[0]}}></Image>
            }
            <View style={styles.listContainer}>
                <Text style={styles.text}>Nama: {data.name}</Text>
                <Text style={styles.text}>Harga: Rp. {data.price}</Text>
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
                    pathname: '/input', params: {id: param.id, name: data.name, price: data.price}
                })}>Edit</Button>
            </View>
            {!data.image[0]?<></>:<ScrollView horizontal={true}>
                {
                    data.image.map((i, index) => 
                        <Image key={index} style={[styles.image, {width: 250, marginRight: 10}]} source={{uri: i}}></Image>
                    )
                }
            </ScrollView>}
        </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 20, 
    backgroundColor: '#222'
    },
  header: {
    justifyContent: 'space-between', 
    paddingBottom: 20,
    flexDirection:'row',
    gap: 10
  },
  image: {
    height: 250,
    backgroundColor: '#333',
    borderRadius: 12,
    marginBottom: 10,
  },
  listContainer: { 
    backgroundColor: '#111',
    justifyContent: 'space-between',
    borderRadius: 12,
    marginBottom: 10,
    padding: 10,
    gap: 12,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18
  },
  input: {
        backgroundColor: '#333',
        borderRadius: 12,
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
        padding: 12,
        flex: 1
    }
});