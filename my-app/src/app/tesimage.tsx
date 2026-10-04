import { useState } from 'react';
import { Alert, Button, Image, View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { File, UploadType } from 'expo-file-system';

export default function ImagePickerExample() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library.
    // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
    // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
    // so the app users aren't surprised by a system dialog after picking a video.
    // See "Invoke permissions for videos" sub section for more details.
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

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // Camera access always requires the user's permission.
    // Taking a photo also requires a device with a camera. The iOS Simulator
    // does not have one, so use a physical device to test this button.
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the camera is required.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert('Error', 'Pilih gambar dulu!');
      return;
    }

    try {
      const CLOUD_NAME = 'zweknrjp';
      const UPLOAD_PRESET = 'testing';

      // 1. Buat objek File dari URI hasil ImagePicker
      const file = new File(image);

      // 2. Buat upload task dengan UploadType.MULTIPART (bukan FileSystemUploadType)
      const task = file.createUploadTask(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          uploadType: UploadType.MULTIPART,   // ← INI KUNCINYA
          fieldName: 'file',
          mimeType: 'image/jpeg',
          parameters: {
            upload_preset: UPLOAD_PRESET,
            folder: `assalaam/test`, 
          },
          onProgress: ({ bytesSent, totalBytes }) => {
            console.log(`Upload: ${bytesSent}/${totalBytes} bytes`);
          },
        }
      );

      // 3. Jalankan upload
      const result = await task.uploadAsync();
      const response = JSON.parse(result.body);
      console.log('Upload berhasil:', response.secure_url);

      return response.secure_url;
    } catch (err) {
      console.error('Upload gagal:', err);
      Alert.alert('Error', 'Upload gagal. Coba lagi.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <Button title="Take a photo" onPress={takePhoto} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title='Upload Image' onPress={uploadImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});
