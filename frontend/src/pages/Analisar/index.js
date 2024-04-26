import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import firebase from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

export default function Analisar() {
  const navigation = useNavigation();
  const [fazendas, setFazendas] = useState([]);
  const [cliente, setCliente] = useState(false);
  const [fazendaSelecionada, setFazendaSelecionada] = useState('');
  const [fazenda, setFazenda] = useState('');
  const [talhao, setTalhao] = useState('');
  const [talhaoSelecionado, setTalhaoSelecionado] = useState('');
  const [armadilhaSelecionada, setArmadilhaSelecionada] = useState('');

  const [capturedImage, setCapturedImage] = useState(null);
  const [showSendButton, setShowSendButton] = useState(false);

  useEffect(() => {
    const fetchFazendas = async () => {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const usuarioId = currentUser.uid;

      const response = await axios.get(`http://10.0.2.2:3000/usuario/${usuarioId}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });
      setCliente(response.data.cliente);

      try {
        if (response.data.cliente) {
          const response = await axios.get(`http://10.0.2.2:3000/usuario/completo/${usuarioId}`, {
            headers: {
              'Authorization': `Bearer ${idToken}`,
              'Content-Type': 'application/json'
            }
          });
          setFazendas(response.data.fazendas);

        } else {
          const response = await axios.get('http://10.0.2.2:3000/fazenda', {
            headers: {
              'Authorization': `Bearer ${idToken}`,
              'Content-Type': 'application/json'
            }
          });

          const fazendas = response.data;

          const requests = fazendas.map(async (fazenda) => {
            const response = await axios.get(`http://10.0.2.2:3000/fazenda/completo/${fazenda.id}`, {
              headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
              }
            });
            return response.data;
          });

          const fazendasCompleto = await Promise.all(requests);

          setFazendas(fazendasCompleto);
        }
      } catch (error) {
        console.log('Erro ao buscar fazendas:', error);
      }
    };

    const fetchTalhoes = async () => {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      if (fazendaSelecionada) {
        try {
          const response = await axios.get(`http://10.0.2.2:3000/fazenda/completo/${fazendaSelecionada}`, {
            headers: {
              'Authorization': `Bearer ${idToken}`,
              'Content-Type': 'application/json'
            }
          });
          setFazenda(response.data);
        } catch (error) {
          console.log('Erro ao buscar talhões:', error);
        }
      }
    };

    const fetchArmadilhas = async () => {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      if (talhaoSelecionado) {
        try {
          const response = await axios.get(`http://10.0.2.2:3000/talhao/completo/${talhaoSelecionado}`, {
            headers: {
              'Authorization': `Bearer ${idToken}`,
              'Content-Type': 'application/json'
            }
          });
          setTalhao(response.data);
        } catch (error) {
          console.log('Erro ao buscar armadilhas:', error);
        }
      }
    };

    fetchFazendas();
    fetchTalhoes();
    fetchArmadilhas();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchFazendas();
    });

    return unsubscribe;
  }, [navigation, fazendaSelecionada, talhaoSelecionado, armadilhaSelecionada]);

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
    if (talhaoSelecionado == '') {
      Alert.alert(`Alerta`, "Preencha de qual armadilha é essa imagem!",
        [{ text: "OK", style: "cancel" },]);
      return;
    }

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
        // await firebase.firestore().collection('DadosUsuario').doc(id).set({ foto: imgUrl }, { merge: true });
        setShowSendButton(false);
        setFazendaSelecionada('');
      } catch (error) {
        console.log('Erro ao fazer upload da imagem:', error);
      }
    }
  };

  function handleDiscardImg() { setShowSendButton(false); setFazendaSelecionada(''); }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstHalf}>
        <View style={styles.firstHalfContent}>
          <Text style={styles.title}>Analisar</Text>
        </View>
      </View>

      <View style={styles.secondHalf}>
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

        <View style={styles.secondHalfInputs}>
          <Text style={styles.label}>Fazenda</Text>
          <View style={styles.input}>
            <Picker
              selectedValue={fazendaSelecionada}
              onValueChange={(itemValue, itemIndex) => {
                setFazendaSelecionada(itemValue);
                setTalhaoSelecionado('');
              }}
            >
              <Picker.Item label="Escolha" value="" />
              {fazendas.map((fazenda) => (
                <Picker.Item key={fazenda.id} label={fazenda.nomeFazenda} value={fazenda.id} />
              ))}
            </Picker>
          </View>

          {fazendaSelecionada && fazenda && fazenda.talhoes.length > 0 ? (
            <>
              <Text style={styles.label}>Talhão</Text>
              <View style={styles.input}>
                <Picker
                  selectedValue={talhaoSelecionado}
                  onValueChange={(itemValue, itemIndex) => {
                    setTalhaoSelecionado(itemValue)
                    setArmadilhaSelecionada('');
                  }}
                >
                  <Picker.Item label="Escolha" value="" />
                  {fazenda.talhoes.map((talhao) => (
                    <Picker.Item key={talhao.id} label={talhao.nomeTalhao} value={talhao.id} />
                  ))}
                </Picker>
              </View>
              {talhaoSelecionado && talhao && talhao.armadilha.length > 0 ? (
                <>
                  <Text style={styles.label}>Armadilha</Text>
                  <View style={styles.input}>
                    <Picker
                      selectedValue={armadilhaSelecionada}
                      onValueChange={(itemValue, itemIndex) => setArmadilhaSelecionada(itemValue)}
                    >
                      <Picker.Item label="Escolha" value="" />
                      {talhao.armadilha.map((armadilha) => (
                        <Picker.Item key={armadilha.id} label={armadilha.nomeArmadilha} value={armadilha.id} />
                      ))}
                    </Picker>
                  </View>
                </>
              ) : (
                <>
                {talhaoSelecionado &&(
                <Text>Este talhão não possui armadilhas.</Text>
                )}
                </>
              )}
            </>
          ) : (
            <>
            {fazendaSelecionada &&(
              <Text>Esta fazenda não possui talhões.</Text>
            )}
            </>
          )}

        </View>

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
    marginTop: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#fff"
  },

  secondHalf: {
    flex: 8.3,
    backgroundColor: '#E9EEEB',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
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
    height: 200,
  },
  uploadBtn: {
    borderWidth: 2.5,
    borderStyle: 'dashed',
    borderRadius: 12,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  importText: {
    fontSize: 16,
    textAlign: 'center',
    color: "#000",
    padding: 12,
  },

  secondHalfInputs: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000'
  },
  input: {
    height: 44,
    fontSize: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#2C8C1D',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 18,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },

});
