import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import firebase from '@react-native-firebase/app';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VerTalhao() {
  const navigation = useNavigation();
  const route = useRoute();
  const [idtalhao, setIdTalhao] = useState(null);
  const [talhao, setTalhao] = useState(null);
  const [filteredArmadilhas, setFilteredArmadilhas] = useState([]);

  const [nome, setNome] = useState('');
  const [tipoPlantacao, setTipoPlantacao] = useState('');

  const handleSeeMore = (talhaoId) => {
    navigation.navigate('EditarTalhao', { talhaoId: talhaoId });
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

  const handleCadastro = () => {
    AsyncStorage.clear();
    navigation.navigate('CriarArmadilha', { talhaoId: idtalhao });
  };

  useEffect(() => {
    const fetchTalhao = async () => {
      await AsyncStorage.clear();
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const { talhaoId } = route.params;
      setIdTalhao(talhaoId)
      try {
        const response = await axios.get(`http://10.0.2.2:3000/talhao/completo/${talhaoId}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });
        setTalhao(response.data);
        await AsyncStorage.setItem('poligno', JSON.stringify(response.data.coordenadas));
      } catch (error) {
        console.log('Erro ao buscar talhao: ', error);
      }
    };

    fetchTalhao();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTalhao();
    });

    return unsubscribe;
  }, [navigation, route.params]);


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstHalf}>
        <View>
          {talhao && (
            <View style={styles.firstHalfContent}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
                <Feather name="arrow-left" size={30} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.title}>Ver/Editar {talhao.nomeTalhao}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={styles.secondHalf}>
        <View style={styles.secondHalfInputs}>

          <Text style={styles.label}>Plantação</Text>
          <TextInput style={styles.input}
            placeholder={talhao ? talhao.tipoPlantacao : ''} editable={false} />

          <View>
            <TouchableOpacity activeOpacity={0.7} onPress={() => handleSeeMore(talhao.id)}>
              <Text style={styles.seeMore}>Ver mais...</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.armadilhas}>Armadilhas</Text>

        <ScrollView>
          {talhao && talhao.armadilha && talhao.armadilha.length > 0 ? (
            talhao.armadilha.map(armadilha => (
              <TouchableOpacity key={armadilha.id} style={styles.armadilha} onPress={() => handleArmadilha(armadilha.id)}>
                <View style={styles.armadilhaContent}>
                  <View style={styles.armadilhaCircle} />

                  <View>
                    <Text>{armadilha.nomeArmadilha}</Text>
                  </View>

                  <TouchableOpacity style={styles.arrowIcon} onPress={() => handleArmadilha(armadilha.id)}>
                    <Feather name="arrow-right" size={32} color="black" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))) : <Text> Não há armadilhas neste talhão.</Text>
          }
        </ScrollView>

        <TouchableOpacity style={styles.button} onPress={() => handleCadastro()}>
          <Text style={styles.buttonText}>Criar armadilha</Text>
        </TouchableOpacity>
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
  armadilha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 14,
  },
  armadilhaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  armadilhaCircle: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#FCFF51',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  arrowIcon: {
    marginLeft: 'auto',
  },

  button: {
    backgroundColor: '#FF8C00',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 18,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },

});
