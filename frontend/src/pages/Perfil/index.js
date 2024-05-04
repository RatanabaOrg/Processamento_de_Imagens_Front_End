import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import axios from 'axios';

import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
// import DocumentPicker from 'react-native-document-picker';

export default function Clientes() {

  const navigation = useNavigation();
  const [usuario, setUsuario] = useState(null);
  const [usuarioAtual, setUsuarioAtual] = useState(null);

  const [capturedImage, setCapturedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchUsuario = async () => {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const id = await currentUser.uid;
      setUsuarioAtual(currentUser.email)
      try {
        const response = await axios.get(`http://10.0.2.2:3000/usuario/${id}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });
        setUsuario(response.data);
      } catch (error) {
        console.log('Erro ao buscar usuários:', error);
      }
    };

    fetchUsuario();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUsuario();
    });

    return unsubscribe;
  }, [navigation]);

  const handleSignOut = () => {
    auth().signOut().then(() => { 
      navigation.navigate("Login") })
      .catch(() => { 
        console.log("Não há usuário logado") })
  }

  const handleProfile = () => {
    navigation.navigate("EditarPerfil")
  }

  const showFileOptions = () => {
    Alert.alert(
      `Foto de perfil`, "Deseja tirar foto agora ou pegar da galeria?",
      [{ text: "Cancelar", style: "cancel" },
      { text: "Tirar foto", onPress: () => { handleTakePhoto() } },
      { text: "Galeria", onPress: () => { handlePhotoGallery() } } ]
    );
  }

  const handleTakePhoto = () => {
    ImagePicker.openCamera({ cropping: false }).then( async image => {
      setCapturedImage(image);
      setModalVisible(true);
    }).catch(err => {
      console.log('Erro ao tirar foto da câmera:', err);
    });
  }

  const handlePhotoGallery = async () => {
    try {
      const image = await ImagePicker.openPicker({ mediaType: 'photo' });
      setCapturedImage(image);
      setModalVisible(true);
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
        const response = await storage().ref(`perfil/${newName}`).putFile(uri);
        const imgUrl = await storage().ref(`perfil/${newName}`).getDownloadURL();
        
        const currentUser = firebase.auth().currentUser;
        const id = await currentUser.uid;
        await firebase.firestore().collection('DadosUsuario').doc(id).set({ foto: imgUrl }, { merge: true });
        setUsuario(prevUsuario => ({ ...prevUsuario, foto: imgUrl }));
        setModalVisible(false);
      } catch (error) {
        console.log('Erro ao fazer upload da imagem:', error);
      }
    }
  };

  function handleDiscardImg() { setModalVisible(false); }

  const removePhoto = () => {
    Alert.alert(
      `Foto de perfil`, "Deseja remover a foto?",
      [{ text: "Confirmar", onPress: () => { handleRemovePhoto() } },
      { text: "Cancelar", style: "cancel" }]
    );
  }

  const handleRemovePhoto = async () => {
    if (usuario.foto) {
      try {
        const currentUser = firebase.auth().currentUser;
        const id = await currentUser.uid;
        await firebase.firestore().collection('DadosUsuario').doc(id).set({ foto: "" }, { merge: true });
        setUsuario(prevUsuario => ({ ...prevUsuario, foto: "" }));
      } catch (error) {
        console.log('Erro ao remover imagem:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstHalf}>
        <TouchableOpacity style={styles.firstHalfContent} onPress={() => handleSignOut()}>
          <Text style={styles.title}>Sair</Text>
          <Feather name="log-out" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.clienteCircle} 
      onPress={showFileOptions} onLongPress={removePhoto}>
        {usuario && usuario.foto ? (
          <Image source={{ uri: usuario.foto }} style={styles.clienteFoto} />
        ) : (
          <Feather name="user" size={44} color="black" />
        )}
      </TouchableOpacity>

      <View style={styles.secondHalf}>
        <View style={styles.secondHalfInputs}>
          <Text style={styles.label}>Nome</Text>
          <TextInput style={styles.input}
            placeholder="Seu nome" editable={false} value={usuario ? usuario.nome : ''} />
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input}
            placeholder="Seu email" editable={false} value={usuario ? usuarioAtual : ''} />
          <Text style={styles.label}>Telefone</Text>
          <TextInput style={styles.input}
            placeholder="Seu telefone" editable={false} value={usuario ? usuario.telefone : ''} />
        </View>

        <TouchableOpacity style={styles.button} onPress={() => handleProfile(usuario.id)}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => { setModalVisible(false); }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Deseja colocar em foto de perfil?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton1} onPress={handleDiscardImg} >
                <Text style={styles.modalButtonText}>Descartar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton2} onPress={handleSendImg} >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF8C00',
  },
  firstHalf: {
    flex: 1.5,
    paddingTop: 60,
  },
  firstHalfContent: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    gap: 8,
    paddingRight: 30
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  clienteCircle: {
    width: 154,
    height: 154,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    position: 'absolute',
    zIndex: 1,
    top: 180,
    alignSelf: 'center'
  },
  clienteFoto: {
    zIndex: 2,
    backgroundColor: '#E9EEEB',
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  secondHalf: {
    flex: 4,
    backgroundColor: '#E9EEEB',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  secondHalfInputs: {
    marginTop: 50,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000'
  },
  input: {
    height: 44,
    fontSize: 15,
    backgroundColor: '#ccc',
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 10,

  },
  cliente: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 10,
  },
  clienteContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  clienteNome: {
    marginLeft: 10,
  },
  cliFoto: {
    width: 48,
    height: 48,
    borderRadius: 30,
    backgroundColor: '#ccc'
  },
  arrowIcon: {
    marginLeft: 'auto',
  },
  button: {
    backgroundColor: '#FF8C00',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 18,
    marginBottom: 18,
    width: '30%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  //-----------------------------------------

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    marginBottom: 40,
    fontSize: 16,
    color: '#000',
  },
  modalButtons: {
    flexDirection: 'row',
  },
  modalButton1: {
    flex: 1,
    backgroundColor: '#DE1B00',
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButton2: {
    flex: 1,
    backgroundColor: '#2C8C1D',
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
