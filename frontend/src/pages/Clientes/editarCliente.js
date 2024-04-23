import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import firebase from '@react-native-firebase/app';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';

export default function EditarCliente() {
  const navigation = useNavigation();
  const route = useRoute();
  const [usuario, setUsuario] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [idUser, setIdUser] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleNextPage = () => {
    navigation.navigate('EditarClienteEndereco', {
      usuarioId: idUser,
      nome: nome,
      email: email,
      telefone: telefone
    });
  };

  const deleteCliente = async () => {
    try {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const { usuarioId } = route.params;
      const response = await axios.delete(`http://10.0.2.2:3000/usuario/${usuarioId}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });
      navigation.navigate('Main', { screen: 'Clientes' });
    } catch (error) {
      console.log('Erro ao deletar usuario:', error);
    }
  };

  const handleNomeChange = (text) => {
    setNome(text);
  };

  const handleTelefoneChange = (text) => {
    setTelefone(text);
  };

  useEffect(() => {
    const fetchUsuario = async () => {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const { usuarioId } = route.params;
      setIdUser(usuarioId)
      try {
        const response = await axios.get(`http://10.0.2.2:3000/usuario/${usuarioId}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });
        setUsuario(response.data);
        setNome(response.data.nome);
        setEmail(response.data.email);
        setTelefone(response.data.telefone);
      } catch (error) {
        console.log('Erro ao buscar usuário:', error);
      }
    };

    fetchUsuario();
  }, [route.params]);

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
        
        const { usuarioId } = route.params;
        await firebase.firestore().collection('DadosUsuario').doc(usuarioId).set({ foto: imgUrl }, { merge: true });
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
        const { usuarioId } = route.params;
        await firebase.firestore().collection('DadosUsuario').doc(usuarioId).set({ foto: "" }, { merge: true });
        setUsuario(prevUsuario => ({ ...prevUsuario, foto: "" }));
      } catch (error) {
        console.log('Erro ao remover imagem:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstHalf}>
        <View>
          {usuario && (
            <View style={styles.firstHalfContent}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
                <Feather name="arrow-left" size={30} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.title}>Ver/Editar {usuario.nome}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.clienteCircle} 
                onPress={showFileOptions} onLongPress={removePhoto}>
                {usuario.foto ? (
                  <Image source={{ uri: usuario.foto }} style={styles.clienteFoto} />
                ) : (
                  <Feather name="user" size={24} color="white" />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <View style={styles.secondHalf}>
        <View style={styles.secondHalfInputs}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            value={nome}
            onChangeText={handleNomeChange}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            editable={false}
            placeholder="Seu email"
            value={email}
          />
          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu telefone"
            value={telefone}
            onChangeText={handleTelefoneChange}
          />
        </View>
        <View style={styles.secondHalfButtons}>
          <TouchableOpacity style={styles.buttonDeletar} onPress={deleteCliente}>
            <Text style={styles.buttonText}>Deletar cliente</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonProximo} onPress={handleNextPage}>
            <Text style={styles.buttonText}>Próximo</Text>
          </TouchableOpacity>
        </View>
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
  clienteCircle: {
    width: 58,
    height: 58,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    zIndex: 1,
    alignSelf: 'center'
  },
  clienteFoto: {
    width: 54,
    height: 54,
    borderRadius: 30,
    backgroundColor: '#fff'
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
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  secondHalfButtons: {
    flexDirection: 'row',
    marginTop: 18,
    justifyContent: 'space-between',
    height: 44,
  },
  buttonDeletar: {
    backgroundColor: '#DE1B00',
    borderRadius: 10,
    paddingHorizontal: 32,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonProximo: {
    backgroundColor: '#2C8C1D',
    borderRadius: 10,
    paddingHorizontal: 56,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
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