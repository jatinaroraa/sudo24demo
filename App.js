import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';
import React, {useState} from 'react';
import axios from 'axios';
import {launchImageLibrary} from 'react-native-image-picker';

import Toast from 'react-native-toast-message';
export default function App() {
  const [photo, setPhoto] = useState();
  const [imgUri, setImageUri] = useState('');

  const createFormData = photo => {
    const data = new FormData();
    let body = {};
    data.append('image', {
      name: photo.fileName,
      type: photo.type,
      uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
    });

    return data;
  };
  const uploadImg = async () => {
    try {
      if (!photo) {
        // return error
        return Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Image not uploaded',
          position: 'bottom',
          visibilityTime: 3000,
        });
      }
      let imageData = createFormData(photo);

      let url = 'http://192.168.1.5:8000/api/v1/upload';
      let headers = {'Content-Type': 'multipart/form-data'};

      let res = await axios({
        url: url,
        data: imageData,
        headers: headers,
        method: 'POST',
      });
      console.log(res.data, 'response');
      if (res.data) {
        return Toast.show({
          type: 'success',
          text1: 'Uploaded',
          text2: `${res.data.message}`,
          // position: 'bottom',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      console.log(error, 'error in upload');
      return Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Image not uploaded`,
        // position: 'bottom',
        visibilityTime: 3000,
      });
    }
  };
  const handleChoosePhoto = () => {
    try {
      launchImageLibrary(
        {
          mediaType: 'photo',
          includeBase64: false,
          maxHeight: 200,
          maxWidth: 200,
        },
        response => {
          // console.log(response);
          if (response.assets) {
            console.log(response, 'uploaded');
            setPhoto(response?.assets[0]);
            setImageUri(response?.assets[0].uri);
          }
          //else show warning
        },
      );
    } catch (error) {
      console.log(error, 'error in chose photo');
    }
  };

  return (
    <View>
      <Text>Home</Text>
      <View>
        {/* <Button onPress={() => handleChoosePhoto}> select</Button> */}
        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={() => handleChoosePhoto()}>
          <Text
            style={{
              color: '#FFF',
              textAlign: 'center',
            }}>
            Upload Image
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submit} onPress={() => uploadImg()}>
          <Text
            style={{
              color: '#FFF',
              textAlign: 'center',
            }}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        {imgUri ? <Image style={styles.image} source={imgUri} /> : ''}
      </View>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 200,
    width: '100%',
    backgroundColor: 'grey',
  },
  uploadBtn: {
    backgroundColor: 'blue',
    width: 200,
    borderRadius: 10,
    paddingVertical: 10,
  },
  submit: {
    backgroundColor: 'green',
    width: 200,
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 10,
  },
});
