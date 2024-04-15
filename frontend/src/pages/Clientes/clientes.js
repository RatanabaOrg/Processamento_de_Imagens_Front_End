import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from '@react-native-firebase/app';
import axios from 'axios';

export default function Clientes() {

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
        setUsuarios(response.data);
        setFilteredUsuarios(response.data);
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
    navigation.navigate('EditarCliente', { usuarioId: usuarioId });
  };

  const handleApproval = () => {
    navigation.navigate('AprovarContas');
  };

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setFilteredUsuarios(usuarios);
    } else {
      const filtered = usuarios.filter(usuario => usuario.nome.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredUsuarios(filtered);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstHalf}>
        <View style={styles.firstHalfContent}>
          <Text style={styles.title}>Últimos clientes</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
            {usuarios.map((usuario, index) => (
              <TouchableOpacity key={index} style={styles.clienteCircle}>
                {usuario.foto ? (
                  <Image source={{ uri: usuario.foto }} style={styles.clienteFoto} />
                ) : (
                  <Text style={styles.clienteInitials}>{getInitials(usuario.nome)}</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <View style={styles.secondHalf}>
        <View style={styles.inputContainer}>
          <Ionicons name="search" size={24} color="#FF8C00" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Pesquisar cliente"
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            value={searchQuery}
            placeholderTextColor="#FF8C00"
          />
        </View>
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
        <TouchableOpacity style={styles.button} onPress={() => handleApproval()}>
          <Text style={styles.buttonText}>Aprovar contas</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const getInitials = (name) => {
  const words = name.split(' ');
  let initials = '';
  
  const filteredWords = words.filter(word => !['de', 'da', 'do'].includes(word.toLowerCase()));

  if (filteredWords.length > 3) {
    initials = filteredWords.slice(0, 3).reduce((acc, word) => acc + word.charAt(0), '');
  } else if (filteredWords.length > 1) {
    initials = filteredWords.reduce((acc, word) => acc + word.charAt(0), '');
  } else if (filteredWords.length === 1) {
    initials = filteredWords[0].charAt(0);
  }

  return initials.toUpperCase();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF8C00',
  },
  firstHalf: {
    flex: 2.5,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  firstHalfContent: {
    marginTop: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: "#fff"
  },
  carousel: {
    alignItems: 'center',
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
  clienteInitials: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondHalf: {
    flex: 7.5,
    backgroundColor: '#E9EEEB',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    backgroundColor: '#FFF',
    borderColor: '#FF8C00',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 25,
    marginTop: 25,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FF8C00',
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
    marginTop: 18,
    marginBottom: 18,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
