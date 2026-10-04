import { setDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useState } from "react";
import { Text, View, StyleSheet, TextInput, Alert, Image } from "react-native";
import db from "../../db/firebaseConfig";
import { Button } from "expo-router/build/react-navigation";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { File, UploadType } from 'expo-file-system';
import * as Crypto from 'expo-crypto';

export default function Input() {
    const router = useRouter()
    const params = useLocalSearchParams<{id: string, name: string, price: string}>()
    const [id, setId] = useState(params.id || Crypto.randomUUID())
    const [name, setName] = useState(params.name || '')
    const [price, setPrice] = useState(params.price || '')
    const [image, setImage] = useState<string>()

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (!permissionResult.granted) {
          Alert.alert('Permission required', 'Permission to access the media library is required.');
          return;
        }
    
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images', 'videos'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled) {
          try {
            const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUD_NAME;
            const UPLOAD_PRESET: any= process.env.EXPO_PUBLIC_UPLOAD_PRESET;
            const file = new File(result.assets[0].uri);

            const task = file.createUploadTask(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                {
                uploadType: UploadType.MULTIPART,
                fieldName: 'file',
                mimeType: 'image/jpeg',
                parameters: {
                    upload_preset: UPLOAD_PRESET,
                    folder: `assalaam/${id}`, 
                },
                }
            );

            const r = await task.uploadAsync();
            const response = JSON.parse(r.body);
            setImage(response.secure_url)
            } catch (err) {
            console.error('Upload gagal:', err);
            Alert.alert('Error', 'Upload gagal. Coba lagi.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.text}>Masukkan Nama Produk:</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName}></TextInput>
                <Text style={styles.text}>Masukkan Harga Produk:</Text>
                <TextInput style={styles.input} value={price} onChangeText={setPrice}></TextInput>
            </View>
            {image && <Image style={styles.image} source={{uri: image}}></Image>}
            <Button onPress={pickImage}>Tambahkan Gambar</Button>
            <Button onPress={async () => {
                try{
                    if(name === '' && price === '')
                        alert('Mohon Masukkan Nama dan Harga.')
                    else{
                        if(params.id)
                            if(image)
                                await updateDoc(doc(db, 'prices', params.id), {name: name, price: price, image: arrayUnion(image)})
                            else
                                await updateDoc(doc(db, 'prices', params.id), {name: name, price: price})
                        else
                            await setDoc(doc(db, 'prices', id), {name: name, price: price, image: image?[image]:[]})
                        Alert.alert('Konfirmasi', 'Berhasil Menyimpan!', [{text: 'Ok', onPress: () => console.log('Berhasil Menyimpan Data')}])
                        router.back()
                    }
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
    image: {
        height: 250,
        backgroundColor: '#333',
        borderRadius: 12,
        marginBottom: 10,
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
        padding: 12
    }
})