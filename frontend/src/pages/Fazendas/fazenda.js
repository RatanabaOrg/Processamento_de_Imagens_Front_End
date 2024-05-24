import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import firebase from '@react-native-firebase/app';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VerFazenda() {
  const navigation = useNavigation();
  const route = useRoute();
  const [cliente, setCliente] = useState(false);
  const [fazenda, setFazenda] = useState(null);
  const [talhoes, setTalhoes] = useState([]);
  const [idFazenda, setIdFazenda] = useState(null);
  const [nome, setNome] = useState('');
  const [coordenadas, setCoordenadas] = useState('');
  const [pragas, setPragas] = useState();

  const handleSeeMore = () => {
    navigation.navigate('EditarFazenda', { fazendaId: idFazenda });
  };

  const handleTalhao = (talhaoId) => {
    navigation.navigate('VerTalhao', { talhaoId: talhaoId });
  };

  const handleCadastro = (idFazenda) => {
    AsyncStorage.clear();
    navigation.navigate('CriarTalhao', { fazendaId: idFazenda });
  };

  useEffect(() => {

  }, []);

  useEffect(() => {
    const fetchFazenda = async () => {
      await AsyncStorage.clear();
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const { fazendaId } = route.params;
      setIdFazenda(fazendaId)

      const usuarioId = currentUser.uid;

      const response = await axios.get(`http://10.0.2.2:3000/usuario/${usuarioId}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });
      setCliente(response.data.cliente);

      try {
        const response = await axios.get(`http://10.0.2.2:3000/fazenda/completo/${fazendaId}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });
        setFazenda(response.data);
        console.log(response.data.talhoes);

        var somaPragas = 0;
        var talhoes = response.data.talhoes

        for (let t = 0; t < talhoes.length; t++) {
          var armadilhas = talhoes[t].armadilha;
          for (let a = 0; a < armadilhas.length; a++) {
            if (armadilhas[a].pragas != undefined) {
              somaPragas += armadilhas[a].pragas
            }
          }

        }
        setPragas(somaPragas);

        await AsyncStorage.setItem('poligno', JSON.stringify(response.data.coordenadaSede));
      } catch (error) {
        console.log('Erro ao buscar fazenda: ', error);
      }
    };

    fetchFazenda();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchFazenda();
    });

    return unsubscribe;
  }, [navigation, route.params]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstHalf}>
        <View>
          {fazenda && (
            <View style={styles.firstHalfContent}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
                <Feather name="arrow-left" size={30} color="white" style={{ marginRight: 8 }} />
                <View>
                  <Text style={styles.title}>{fazenda.nomeFazenda}</Text>
                  <Text style={styles.titleAgri}>Agricultor: {fazenda.nomeUsuario}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={styles.secondHalf}>
        <View style={styles.secondHalfInputs}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => handleSeeMore()}>
            <Text style={styles.seeMore}>Ver/Editar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.talhoes}>Talhões</Text>

        <Text style={styles.soma}>Soma das pragas: {pragas}</Text>

        <ScrollView>
          {fazenda && fazenda.talhoes && fazenda.talhoes.length > 0 ? (
            fazenda.talhoes.map(talhao => (
              <TouchableOpacity key={talhao.id} style={styles.talhao} onPress={() => handleTalhao(talhao.id)}>
                <View style={styles.talhaoContent}>
                  <View style={styles.talhaoCircle} />

                  <View>
                    <Text>{talhao.nomeTalhao}</Text>
                  </View>

                  <TouchableOpacity style={styles.arrowIcon} onPress={() => handleTalhao(talhao.id)}>
                    <Feather name="arrow-right" size={32} color="black" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))) : <Text>Não há talhões nesta fazenda</Text>
          }
        </ScrollView>

        {!cliente ?
          <TouchableOpacity style={styles.button} onPress={() => handleCadastro(idFazenda)}>
            <Text style={styles.buttonText}>Criar talhão</Text>
          </TouchableOpacity>
          : null}
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

  soma: {
    color: '#000',
    fontSize: 16,
    marginBottom: 16,
  },
  talhoes: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  talhao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 14,
  },
  talhaoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  talhaoCircle: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#8194D8',
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
