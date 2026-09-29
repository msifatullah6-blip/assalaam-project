import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import db from "../../db/firebaseConfig";
import { Button } from "expo-router/build/react-navigation";
import { useLocalSearchParams } from "expo-router";

export default function Input() {
    const params = useLocalSearchParams<{id?: string, name?: string, price?: string}>()
    const [name, setName] = useState(params.name || '')
    const [price, setPrice] = useState(params.price || '')

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.text}>Masukkan Nama Produk:</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName}></TextInput>
                <Text style={styles.text}>Masukkan Harga Produk:</Text>
                <TextInput style={styles.input} value={price} onChangeText={setPrice}></TextInput>
            </View>
            <Button onPress={async () => {
                try{
                    if(params.id)
                        await updateDoc(doc(db, 'prices', params.id), {name: name, price: price})
                    else
                        await addDoc(collection(db, 'prices'), {name: name, price: price})
                    alert('Berhasil Menyimpan.')
                }catch(err){
                    console.log(err)
                    alert('Tidak Dapat Menambah Produk. Terjadi Kesalahan.')
                }
            }}>Simpan</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        padding: 20, 
        backgroundColor: '#222',
        gap: 12
    },
    form: {
        backgroundColor: '#111',
        padding: 20,
        borderRadius: 12,
        gap: 12,
        paddingBottom: 50
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20
    },
    input: {
        backgroundColor: '#333',
        borderRadius: 12,
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
        padding: 12
    }
})