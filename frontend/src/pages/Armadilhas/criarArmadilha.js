import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import firebase from '@react-native-firebase/app';
import axios from 'axios';
import MapaArmadilha from '../Mapa/mapaArmadilha';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CriarArmadilha() {

  const navigation = useNavigation();
  const route = useRoute();
  const [nome, setNome] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [usuarioAtual, setUsuarioAtual] = useState(null);

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
        console.log(response.data);
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


  const handleCadastrar = async () => {
    try {
      const coordenadas = await AsyncStorage.getItem('poligno');
      const coordenadasObjeto = JSON.parse(coordenadas);
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const { talhaoId } = route.params;

      if (!nome) {
        Alert.alert('Alerta', 'Preencha o nome da armadilha!', [{ text: 'OK', style: 'cancel' }]);
        return;
      }
      if (!coordenadasObjeto) {
        Alert.alert('Alerta', 'Marque as coordenadas!', [{ text: 'OK', style: 'cancel' }]);
        return;
      }

      const response = await axios.post(`http://10.0.2.2:3000/armadilha/cadastro`, {
        nomeArmadilha: nome,
        coordenada: coordenadasObjeto,
        talhaoId: talhaoId,
        telefone: usuario.telefone
      }, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstHalf}>
        <View>
          <View style={styles.firstHalfContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
              <Feather name="arrow-left" size={30} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.title}>Criar armadilha</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.secondHalf}>
        <ScrollView contentContainerStyle={styles.armadilhaContainer}>
        <View style={styles.secondHalfInputs}>
          <Text style={styles.label}>Nome</Text>
          <TextInput style={[styles.input, { paddingLeft: 16 }]}
            placeholder="Nome" onChangeText={(text) => setNome(text)} />

          <Text style={styles.label}>Localização</Text>
          <MapaArmadilha />

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
  armadilhaContainer: {
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
