import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import firebase from '@react-native-firebase/app';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';

export default function VerArmadilha() {
  const navigation = useNavigation();
  const route = useRoute();
  const [idArmadilha, setIdArmadilha] = useState(null);
  const [armadilha, setArmadilha] = useState(null);

  const [nome, setNome] = useState('');
  
  const [capturedImage, setCapturedImage] = useState(null);
  const [showSendButton, setShowSendButton] = useState(false);

  const handleSeeMore = (armadilhaId) => {
    navigation.navigate('EditarArmadilha', { armadilhaId: armadilhaId });
  };

  const handleArmadilha = (armadilhaId) => {
    const fetchArmadilha = async () => {
      AsyncStorage.clear();
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      try {
        const response = await axios.get(`http://10.0.2.2:3000/armadilha/${armadilhaId}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });
        await AsyncStorage.setItem('poligno', JSON.stringify(response.data.coordenada));
      } catch (error) {
        console.log('Erro ao buscar armadilha:', error);
      }
    };

    navigation.navigate('EditarArmadilha', { armadilhaId: armadilhaId });
    fetchArmadilha();
  };

  const showFileOptions = () => {
    Alert.alert(
      `Foto de perfil`, "Deseja tirar foto agora ou pegar da galeria?",
      [{ text: "Cancelar", style: "cancel" },
      { text: "Tirar foto", onPress: () => { handleTakePhoto() } },
      { text: "Galeria", onPress: () => { handlePhotoGallery() } }]
    );
  }

  const handleTakePhoto = () => {
    ImagePicker.openCamera({ cropping: false }).then(async image => {
      setCapturedImage(image);
      setShowSendButton(true);
    }).catch(err => {
      console.log('Erro ao tirar foto da câmera:', err);
    });
  }

  const handlePhotoGallery = async () => {
    try {
      const image = await ImagePicker.openPicker({ mediaType: 'photo' });
      setCapturedImage(image);
      setShowSendButton(true);
    } catch (error) {
      console.log('Erro ao escolher imagem da galeria:', error);
    }
  };

  const handleSendImg = async () => {
    if (capturedImage) {
      const uri = capturedImage.path;
      const imgName = uri.substring(uri.lastIndexOf('/') + 1);
      const exit = imgName.split('.').pop();
      const newName = `${imgName.split('.')[0]}${Date.now()}.${exit}`;
      try {
        const response = await storage().ref(`armadilha/${newName}`).putFile(uri);
        const imgUrl = await storage().ref(`armadilha/${newName}`).getDownloadURL();

        const currentUser = firebase.auth().currentUser;
        const id = await currentUser.uid;
        
        await firebase.firestore().collection('Armadilha').doc(idArmadilha).update({
          fotos: firebase.firestore.FieldValue.arrayUnion({ url: imgUrl, analisado: false })
      });
        setShowSendButton(false);
      } catch (error) {
        console.log('Erro ao fazer upload da imagem:', error);
      }
    }
  };

  function handleDiscardImg() { setShowSendButton(false); }

  useEffect(() => {
    const fetchArmadilha = async () => {
      await AsyncStorage.clear();
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const { armadilhaId } = route.params;
      setIdArmadilha(armadilhaId)
      try {
        const response = await axios.get(`http://10.0.2.2:3000/armadilha/${armadilhaId}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });
        setArmadilha(response.data);
        // await AsyncStorage.setItem('poligno', JSON.stringify(response.data.coordenadas));
      } catch (error) {
        console.log('Erro ao buscar armadilha: ', error);
      }
    };

    fetchArmadilha();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchArmadilha();
    });

    return unsubscribe;
  }, [navigation, route.params]);


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstHalf}>
        <View>
          {armadilha && (
            <View style={styles.firstHalfContent}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
                <Feather name="arrow-left" size={30} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.title}>Ver/Editar {armadilha.nomeArmadilha}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={styles.secondHalf}>
        <View style={styles.secondHalfInputs}>
          <View>
            <TouchableOpacity activeOpacity={0.7} onPress={() => handleSeeMore(idArmadilha)}>
              <Text style={styles.seeMore}>Ver/Editar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.armadilhas}>Dashboard</Text>

        <ScrollView>

          <View style={styles.thirdHalf}>
            <Text>card</Text>
            <Text>card</Text>
            <Text>card</Text>
          </View>

          <View style={styles.forthHalf}>
          <View style={styles.containerImport}>
          {showSendButton ? (
            <>
              <Feather style={{ marginLeft: 'auto' }} onPress={handleDiscardImg}
                name="x" size={44} color="black" />
              <View style={styles.photoSend}>
                <Feather name="check-square" size={44} color="#2C8C1D" />
                <Text style={styles.importText}>Imagem da armadilha importada</Text>
              </View>
            </>
          ) : (
            <TouchableOpacity onPress={showFileOptions} style={styles.uploadBtn}>
              <Feather name="upload" size={44} color="black" />
              <Text style={styles.importText}>Importe a imagem de sua armadilha</Text>
            </TouchableOpacity>
          )}
        </View>
          </View>
        </ScrollView>

        {showSendButton && (
          <TouchableOpacity style={styles.button} onPress={handleSendImg}>
            <Feather name="upload" size={16} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Enviar imagem</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF8C00',
  },
  firstHalf: {
    flex: 1.7,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  firstHalfContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goBackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#fff"
  },
  titleAgri: {
    fontSize: 14,
    fontWeight: '500',
    color: "#fff"
  },
  secondHalf: {
    flex: 8.3,
    backgroundColor: '#E9EEEB',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    justifyContent: 'flex-start',
  },
  secondHalfInputs: {
    marginTop: 45,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000'
  },
  input: {
    height: 44,
    fontSize: 15,
    backgroundColor: '#ddd',
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  seeMore: {
    color: '#FF8C00',
    fontSize: 16,
    textAlign: 'right',
    fontWeight: '500',
  },
  armadilhas: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  }, 
  
  containerImport: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    marginTop: 50,
    width: '100%',
  },
  photoSend: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 160,
  },
  uploadBtn: {
    borderWidth: 2.5,
    borderStyle: 'dashed',
    borderRadius: 12,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    height: 160,
  },
  importText: {
    fontSize: 16,
    textAlign: 'center',
    color: "#000",
    padding: 12,
  },

  button: {
    backgroundColor: '#2C8C1D',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },

});
