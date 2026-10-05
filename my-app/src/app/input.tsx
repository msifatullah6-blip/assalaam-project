import { setDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useState } from "react";
import { Text, View, TextInput, Alert, Image } from "react-native";
import db from "../../db/firebaseConfig";
import { Button } from "expo-router/build/react-navigation";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { File, UploadType } from 'expo-file-system';
import * as Crypto from 'expo-crypto';
import s from "./style/styles";

export default function Input() {
    const router = useRouter()
    const [ isLoading, setIsLoading ] = useState(false)
    const params = useLocalSearchParams<{id: string, name: string, price: string, desc: string}>()
    const [id, setId] = useState(params.id || Crypto.randomUUID())
    const [name, setName] = useState(params.name || '')
    const [price, setPrice] = useState(params.price || '')
    const [desc, setDesc] = useState(params.desc || '')
    const [preview, setPreview] = useState<string>()

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
            setPreview(result.assets[0].uri)}
    };

    const uploadImage = async () => {
        if (!preview) {
            Alert.alert('Error', 'Pilih gambar dulu!');
            return;
        }

        try {
            const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUD_NAME;
            const UPLOAD_PRESET: any= process.env.EXPO_PUBLIC_UPLOAD_PRESET;
            const ext = preview.split('.').pop()?.toLowerCase();
            const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
            const file = new File(preview);

            const task = file.createUploadTask(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                {
                uploadType: UploadType.MULTIPART,
                fieldName: 'file',
                mimeType: mimeType,
                parameters: {
                    upload_preset: UPLOAD_PRESET,
                    folder: `assalaam/${id}`, 
                },
                }
            );

            const r = await task.uploadAsync();
            const response = JSON.parse(r.body);
            if(!response.secure_url)
                throw new Error('Gagal upload Gambar.')
                
            if(params.id)
                await updateDoc(doc(db, 'prices', params.id), {name: name, price: price, desc: desc, image: arrayUnion(response.secure_url)})
            else
                await setDoc(doc(db, 'prices', id), {name: name, price: price, desc: desc, image: [response.secure_url]})
        } catch (err) {
            console.error('Upload gagal:', err);
            Alert.alert('Error', 'Upload gagal. Coba lagi.');
        }
    }

    return (
        <View style={[s.container, {gap: 12}]}>
            <View style={s.form}>
                <Text style={s.text}>Masukkan Nama Produk:</Text>
                <TextInput style={s.input} value={name} onChangeText={setName}></TextInput>
                <Text style={s.text}>Masukkan Harga Produk:</Text>
                <TextInput style={s.input} value={price} onChangeText={setPrice}></TextInput>
                <Text style={s.text}>Masukkan Deskripsi:</Text>
                <TextInput multiline numberOfLines={4} maxLength={100} style={s.input} value={desc} onChangeText={setDesc}></TextInput>
            </View>
            {preview && <Image style={s.image} source={{uri: preview}}></Image>}
            <Button onPress={pickImage}>Tambahkan Gambar</Button>
            <Button onPress={async () => {
                if(name.trim() === '' || price.trim() === '')
                    alert('Mohon Masukkan Nama dan Harga.')

                setIsLoading(true)
                try{
                    if(!preview)
                        if(params.id)
                            await updateDoc(doc(db, 'prices', params.id), {name: name, price: price, desc: desc})
                        else
                            await setDoc(doc(db, 'prices', id), {name: name, price: price, desc: desc, image: []})
                    else
                        await uploadImage()
                    Alert.alert('Konfirmasi', 'Berhasil Menyimpan!', [{text: 'Ok', onPress: () => console.log('Berhasil Menyimpan Data')}])
                    router.back()
                }catch(err){
                    console.log(err)
                    alert('Tidak Dapat Menambah Produk. Terjadi Kesalahan.')
                }finally{
                    setIsLoading(false)
                }
            }} disabled={isLoading}>{
                isLoading?'Menyimpan...':'Simpan'
            }</Button>
        </View>
    )
}