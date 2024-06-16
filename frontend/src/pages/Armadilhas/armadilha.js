import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import firebase from '@react-native-firebase/app';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import { Picker } from '@react-native-picker/picker';
import NetInfo from '@react-native-community/netinfo';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

export default function VerArmadilha() {
  const navigation = useNavigation();
  const route = useRoute();
  const [idArmadilha, setIdArmadilha] = useState(null);
  const [armadilha, setArmadilha] = useState(null);
  const [nome, setNome] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showSendButton, setShowSendButton] = useState(false);
  const [showSendButtonImgs, setShowSendButtonImgs] = useState(false);
  const [pragas, setPragas] = useState(0);
  const [hasImg, setHasImg] = useState(false)
  const [isConnected, setIsConnected] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [data2, setData] = useState([]);
  const [media, setMedia] = useState([]);

  const screenWidth = Dimensions.get("window").width;

  const handleSeeMore = (armadilhaId) => {
    navigation.navigate('EditarArmadilha', { armadilhaId: armadilhaId });
  };

  const saveData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      console.log('Dados salvos com sucesso!');
    } catch (e) {
      console.error('Erro ao salvar dados', e);
    }
  };

  const data = {
    labels: ["Dec/23", "Jan/24", "Feb/24", "Mar/24", "Apr/24", "May/24", "Jun/24", "Jul/24"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 20, 28],
      }
    ]
  };

  const chartConfig = {
    backgroundGradientFrom: "#E9EEEB",
    backgroundGradientTo: "#E9EEEB",
    color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgb(0, 0, 0)`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726"
    },
    barPercentage: 0.8,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    fillShadowGradient: `rgba(0, 0, 255, 1)`,
    fillShadowGradientOpacity: 1,
    fillColor: `rgba(0, 0, 255, 1)`,
  };

  const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Erro ao recuperar dados', e);
    }
  };

  const handleArmadilha = (armadilhaId) => {
    const fetchArmadilha = async () => {
      AsyncStorage.removeItem("poligno");
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
      setShowSendButtonImgs(false);
    }).catch(err => {
      console.log('Erro ao tirar foto da câmera:', err);
    });
  }

  const handlePhotoGallery = async () => {
    try {
      const image = await ImagePicker.openPicker({ mediaType: 'photo' });
      setCapturedImage(image);
      setShowSendButton(true);
      setShowSendButtonImgs(false);
    } catch (error) {
      console.log('Erro ao escolher imagem da galeria:', error);
    }
  };

  const handleSendImg = async () => {
    if (isConnected) {
      if (capturedImage) {
        if (hasImg) {
          let data = await getData("1319")
          data.push(capturedImage.path)
          // console.log(data.length);
          for (let d = 0; d < data.length; d++) {

            const uri = data[d]
            const imgName = uri.substring(uri.lastIndexOf('/') + 1);
            const exit = imgName.split('.').pop();
            const newName = `${imgName.split('.')[0]}${Date.now()}.${exit}`;
            try {
              const response = await storage().ref(`armadilha/${newName}`).putFile(uri);
              const imgUrl = await storage().ref(`armadilha/${newName}`).getDownloadURL();

              await firebase.firestore().collection('Armadilha').doc(idArmadilha).update({
                fotos: firebase.firestore.FieldValue.arrayUnion(imgUrl)
              });
              setShowSendButton(false);
              setShowSendButtonImgs(false);

              var { armadilhaId } = route.params;

              await axios.get(`http://10.0.2.2:5000/image/${armadilhaId}`);

              setRefresh(prev => !prev);
            } catch (error) {
              console.log('Erro ao fazer upload da imagem:', error);
            }

          }

          await AsyncStorage.removeItem("1319")

          setHasImg(false)

        } else {
          const uri = capturedImage.path;
          const imgName = uri.substring(uri.lastIndexOf('/') + 1);
          const exit = imgName.split('.').pop();
          const newName = `${imgName.split('.')[0]}${Date.now()}.${exit}`;
          try {
            const response = await storage().ref(`armadilha/${newName}`).putFile(uri);
            const imgUrl = await storage().ref(`armadilha/${newName}`).getDownloadURL();

            await firebase.firestore().collection('Armadilha').doc(idArmadilha).update({
              fotos: firebase.firestore.FieldValue.arrayUnion(imgUrl)
            });
            setShowSendButton(false);

            var { armadilhaId } = route.params;

            console.log(armadilha.telefone);

            await axios.get(`http://10.0.2.2:5000/image/${armadilhaId}/${armadilha.telefone}`);

            setRefresh(prev => !prev);
          } catch (error) {
            console.log('Erro ao fazer upload da imagem:', error);
          }
        }
      }
    } else {
      if (!hasImg) {
        await saveData("1319", [capturedImage.path])
      } else {
        let data = await getData("1319")
        data.push(capturedImage.path)
        await saveData("1319", data)
      }
      setShowSendButtonImgs(true);
      setRefresh(prev => !prev);
    }
    setShowSendButton(false);
    setRefresh(prev => !prev);

  };

  function handleDiscardImg() { setShowSendButton(false); setShowSendButtonImgs(false) }

  useEffect(() => {
    const fetchArmadilha = async () => {
      // console.log(await getData("1319"));
      await AsyncStorage.removeItem("poligno");
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
        const numPragas = response.data.pragas
        let soma = 0;
        if (numPragas != undefined) {
          for (let p of numPragas) {
            soma += p.quantidade 
          }
          console.log(soma)
          setPragas(soma)
        }
      } catch (error) {
        console.log('Erro ao buscar armadilha: ', error);
      }

      if (await getData("1319") != null) {
        setHasImg(true)
      } else {
        setHasImg(false)
      }
    };

    fetchArmadilha();
    // const unsubscribe = navigation.addListener('focus', () => {
    //   fetchArmadilha();
    // });

    // return unsubscribe;


    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, [navigation, route.params, refresh]);

  useEffect(() => {
   fetchData(selectedMonth);
   fetchMedia(selectedMonth)
  }, [selectedMonth]);

  const fetchData = async (month) => {
    try {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const { armadilhaId } = route.params;
      console.log(armadilhaId)
      const response = await axios.get(`http://10.0.2.2:3000/armadilha/${armadilhaId}/${month}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });
      setData(response.data);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchMedia = async (month) => {
    try {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const { armadilhaId } = route.params;
      const response = await axios.get(`http://10.0.2.2:3000/armadilha/${armadilhaId}/media/${month}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });
          
      setMedia(response.data.mediaFormatada);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const baseWidth = screenWidth - 60;
  const additionalWidthPerColumn = 50;
  
  const dynamicWidth = (data2 && data2.labels && data2.labels.length > 5) 
    ? baseWidth + (data2.labels.length - 5) * additionalWidthPerColumn
    : baseWidth;


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstHalf}>
        <View>
          {armadilha && (
            <View style={styles.firstHalfContent}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
                <Feather name="arrow-left" size={30} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.title}>{armadilha.nomeArmadilha}</Text>
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

        <Text style={styles.pragas}>Soma das pragas: {pragas? pragas: ""}</Text>
        <Text>
          {isConnected ? 'Você está conectado à internet!' : 'Você está offline!'}
        </Text>
        <Text>
          {hasImg ? 'Imagens não inviadas por falta de internet!' : null}
        </Text>

        <ScrollView>
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

        {!showSendButton && (
          <>
          <Text style={styles.pragas}>Média de pragas: {media? media : ""}</Text>

          <View style={styles.grafico}>
            <View style={styles.graficoTop}>
              <Text style={styles.graficoTitle}>Total de pragas</Text>
              <Picker
                selectedValue={selectedMonth}
                style={{ height: 50, width: 150 }}
                onValueChange={(itemValue, itemIndex) => {
                  setSelectedMonth(itemValue);
                } }
              >
                <Picker.Item label="Todos" value={0} />
                <Picker.Item label="Janeiro" value={1} />
                <Picker.Item label="Fevereiro" value={2} />
                <Picker.Item label="Março" value={3} />
                <Picker.Item label="Abril" value={4} />
                <Picker.Item label="Maio" value={5} />
                <Picker.Item label="Junho" value={6} />
                <Picker.Item label="Julho" value={7} />
                <Picker.Item label="Agosto" value={8} />
                <Picker.Item label="Setembro" value={9} />
                <Picker.Item label="Outubro" value={10} />
                <Picker.Item label="Novembro" value={11} />
                <Picker.Item label="Dezembro" value={12} />
              </Picker>
            </View>
              <ScrollView horizontal>
                {data2 && data2.datasets && data2.datasets[0] && data2.datasets[0].data.length > 0 ?
                <BarChart
                  style={styles.chart}
                  data={data2}
                  width={dynamicWidth}
                  height={220}
                  chartConfig={chartConfig}
                  verticalLabelRotation={0}
                  showValuesOnTopOfBars={true}
                  withHorizontalLabels={true}
                  fromZero={true}
      yAxisLabel=""
      yAxisSuffix=""
      segments={5} 
      yLabelsOffset={50}/>
                : <Text>Não há dados nesse período</Text>}
              </ScrollView>  
            </View></>
        )}

        {showSendButton && (
          <TouchableOpacity style={styles.button} onPress={handleSendImg}>
            <Feather name="upload" size={16} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Enviar imagem</Text>
          </TouchableOpacity>
        )}
        {
          showSendButtonImgs && isConnected ? (
            <TouchableOpacity style={styles.button} onPress={handleSendImg}>
              <Feather name="upload" size={16} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Enviar imagens</Text>
            </TouchableOpacity>
          ) : null
        }
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
  seeMore: {
    color: '#FF8C00',
    fontSize: 16,
    textAlign: 'right',
    fontWeight: '500',
  },
  pragas: {
    color: '#000',
    fontSize: 16,
    marginBottom: 16,
  },

  containerImport: {
    flex: 1,
    marginTop: 20,
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
  grafico: {
    flex: 8,
  },
  graficoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  graficoTitle: {
    fontSize: 20,
    textAlign: 'center',
    color: "#000",
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
