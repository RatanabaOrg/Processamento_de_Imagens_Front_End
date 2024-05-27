import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, PermissionsAndroid, Platform  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import firebase from '@react-native-firebase/app';
import axios from 'axios'; 
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CriarTalhao() {

  const navigation = useNavigation();
  const route = useRoute();
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [show, setShow] = useState(false);

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

  const handleDiscardArchive = () => {
    setShow(false);
  }

  const handleCadastrar = async () => {
    try {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const { fazendaId } = route.params;
      console.log(fazendaId)

      if (!geoJsonData) {
        Alert.alert('Alerta', 'Selecione o arquivo geojson!', [{ text: 'OK', style: 'cancel' }]);
        return;
      }

      const response = await axios.post(`http://10.0.2.2:3000/talhao/cadastro`, {
        geoJson: geoJsonData,
        fazendaId: fazendaId
    }, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });
      navigation.goBack();
    } catch (error) {
      console.log('Erro ao cadastrar talhão:', error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstHalf}>
        <View>
          <View style={styles.firstHalfContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
              <Feather name="arrow-left" size={30} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.title}>Criar talhão</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.secondHalf}>
        <ScrollView contentContainerStyle={styles.talhaoContainer}>
        <View style={styles.secondHalfInputs}>
         
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
          <TouchableOpacity style={styles.button} onPress={() => handleCadastrar()}>
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
  talhaoContainer: {
    height: "100%",
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

});
