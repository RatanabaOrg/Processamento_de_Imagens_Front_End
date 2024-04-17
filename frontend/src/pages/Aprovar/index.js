import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import firebase from '@react-native-firebase/app';
import axios from 'axios';

export default function AprovarContas() {

  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      console.log(idToken)
      try {
        const response = await axios.get('http://10.0.2.2:3000/usuario', {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });

        const approvedUsuarios = response.data.filter(usuario => !usuario.aprovado);
      
        setUsuarios(response.data);
        setFilteredUsuarios(approvedUsuarios);
      } catch (error) {
        console.log('Erro ao buscar usuários:', error);
      }
    };

    fetchUsuarios();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUsuarios();
    });

    return unsubscribe;
  }, [navigation]);

  const handleClient = (usuarioId) => {
    navigation.navigate('VerConta', { usuarioId: usuarioId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstHalf}>
        <View style={styles.firstHalfContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
            <Feather name="arrow-left" size={30} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.title}>Aprovar contas</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.secondHalf}>
      <ScrollView contentContainerStyle={styles.clienteContainer}>
          {filteredUsuarios.map(usuario => (
            <TouchableOpacity key={usuario.id} style={styles.cliente} onPress={() => handleClient(usuario.id)}>
              <View style={styles.clienteContent}>
              <View style={styles.clienteCircle}>
                  {usuario.foto ? (
                    <Image source={{ uri: usuario.foto }} style={styles.clienteFoto} />
                  ) : (
                    <Feather name="user" size={24} color="white" />
                  )}
                </View>
                <Text style={styles.clienteNome}>{usuario.nome}</Text>
                <TouchableOpacity style={styles.arrowIcon} onPress={() => handleClient(usuario.id)}>
                  <Feather name="arrow-right" size={24} color="black" style={styles.searchIcon} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20
  },
  clienteContainer: {
    flexGrow: 1,
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
  clienteCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  clienteFoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  clienteNome: {
    marginLeft: 10,
  },
  arrowIcon: {
    marginLeft: 'auto',
  },
});
