import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, PermissionsAndroid, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
import firebase from '@react-native-firebase/app';
import axios from 'axios';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FazendaGeoJson() {

  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [agricultor, setAgricultor] = useState('');
  const [agricultores, setAgricultores] = useState([]);
  const [coordenadas, setCoordenadas] = useState('');
  const [cliente, setCliente] = useState(true);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchUsuarios = async () => {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const id = await currentUser.uid;

      // setAgricultor(id);

      try {
        const response = await axios.get(`http://10.0.2.2:3000/usuario/${id}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });

        setCliente(response.data.cliente);

        if (response.data.cliente === false) {
          const responseUsuarios = await axios.get('http://10.0.2.2:3000/usuario', {
            headers: {
              'Authorization': `Bearer ${idToken}`,
              'Content-Type': 'application/json'
            }
          });

          const afterAgricultores = responseUsuarios.data.map(item => {
            if (id !== item.id) {
              return {
                id: item.id,
                nome: item.nome
              };
            }
            return null;
          }).filter(item => item !== null);

          setAgricultores(afterAgricultores);
        }
      } catch (error) {
        console.log('Erro ao buscar usuários:', error);
      }
    };

    fetchUsuarios();
  }, []);

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to read files',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const pickDocument = async () => {
    if (Platform.OS === 'android' && !(await requestStoragePermission())) {
      return;
    }

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      
      if  (res && res[0] && res[0].name && res[0].name.endsWith('.geojson')) {
        const path = await RNFetchBlob.fs.stat(res[0].uri);
        const fileContent = await RNFS.readFile(path.path, 'utf8');
        setGeoJsonData(JSON.parse(fileContent));
        setShow(true);
      } else {
        Alert.alert('Erro', 'Por favor, selecione um arquivo GeoJSON.');
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
      } else {
        console.error('Erro ao selecionar arquivo:', error);
        Alert.alert('Erro', 'Erro ao selecionar arquivo.');
      }
    }
  };


  const handleSubmit = async () => {
    if (show === false) {
      Alert.alert('Alerta', 'Selecione o arquivo geojson!', [{ text: 'OK', style: 'cancel' }]);
      return;
    }

    if (!agricultor) {
      Alert.alert('Alerta', 'Escolha um agricultor!', [{ text: 'OK', style: 'cancel' }]);
      return;
    }

    try {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();

      const response = await axios.post(
        'http://10.0.2.2:3000/fazenda/cadastro',
        {
          geojson: geoJsonData,
          usuarioId: agricultor
        },
        {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      navigation.navigate('Main', { screen: 'Fazendas' });
    } catch (error) {
      Alert.alert('Alerta', 'Erro ao cadastrar fazenda', [{ text: 'OK', style: 'cancel' }]);
      console.log('Erro ao cadastrar fazenda:', error);
    }
  };

  const handleDiscardArchive = () => {
    setShow(false);
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.firstHalf}>
        <View>
          <View style={styles.firstHalfContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
              <Feather name="arrow-left" size={30} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.title}>Cadastro de fazenda</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.secondHalf}>
        <ScrollView contentContainerStyle={styles.fazendaContainer}>
          <View style={styles.secondHalfInputs}>
            {agricultores.length > 0 ? (
              <>
                <Text style={styles.label}>Agricultor</Text>
                <View style={styles.input}>
                  <Picker
                    selectedValue={agricultor}
                    onValueChange={(itemValue, itemIndex) => setAgricultor(itemValue)}
                  >
                    <Picker.Item label="Escolha" value="" />
                    {agricultores.map((agricultor) => (
                      <Picker.Item key={agricultor.id} label={agricultor.nome} value={agricultor.id} />
                    ))}
                  </Picker>
                </View>
              </>
            ) : null}

            <View style={styles.containerImport}>
              {show ? (
                <>
                  <Feather style={{ marginLeft: 'auto' }} onPress={handleDiscardArchive}
                    name="x" size={44} color="black" />
                  <View style={styles.archiveSend}>
                    <Feather name="check-square" size={44} color="#2C8C1D" />
                    <Text style={styles.importText}>Geojson selecionado!</Text>
                  </View>
                </>
              ) : (
                <TouchableOpacity onPress={pickDocument} style={styles.uploadBtn}>
                  <Feather name="upload" size={44} color="black" />
                  <Text style={styles.importText}>Selecione o arquivo geojson</Text>
                </TouchableOpacity>
              )}
            </View>

          </View>
        </ScrollView>

        <View style={styles.secondHalfButton}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Enviar cadastro</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'center',
  },
  secondHalfButton: {
    flexDirection: 'row',
    marginTop: 18,
    marginBottom: 18,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2C8C1D',
    borderRadius: 10,
    paddingHorizontal: 56,
    paddingVertical: 12,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },

  containerImport: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    marginTop: 24,
    width: '100%',
  },
  archiveSend: {
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

});
