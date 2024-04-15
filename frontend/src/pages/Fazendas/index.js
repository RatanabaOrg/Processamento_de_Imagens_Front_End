import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from '@react-native-firebase/app';
import axios from 'axios';

export default function Fazendas() {

  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFazendas, setFilteredFazendas] = useState([]);
  const [fazendas, setFazendas] = useState([]);

  const handleFazenda = (fazendaId) => {
    navigation.navigate('VerFazenda', { fazendaId: fazendaId });
  };

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

      try {
        if (response.data.cliente) {
          const response = await axios.get(`http://10.0.2.2:3000/usuario/completo/${usuarioId}`, {
            headers: {
              'Authorization': `Bearer ${idToken}`,
              'Content-Type': 'application/json'
            }
          });
          setFazendas(response.data.fazendas);
          setFilteredFazendas(response.data.fazendas);
        } else {
          const response = await axios.get('http://10.0.2.2:3000/fazenda', {
            headers: {
              'Authorization': `Bearer ${idToken}`,
              'Content-Type': 'application/json'
            }
          });
          setFazendas(response.data);
          setFilteredFazendas(response.data);
        }
      } catch (error) {
        console.log('Erro ao buscar fazendas:', error);
      }
    };

    fetchFazendas();
  }, []);

  const handleCadastro = () => {
    navigation.navigate('CriarFazenda');
  };

  useEffect(() => {
    setFilteredFazendas(fazendas);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setFilteredFazendas(fazendas);
    } else {
      const filtered = fazendas.filter(fazenda => fazenda.nomeFazenda.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredFazendas(filtered);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstHalf}>
        <View style={styles.firstHalfContent}>
          <Text style={styles.title}>Fazendas</Text>
        </View>
      </View>

      <View style={styles.secondHalf}>
        <View style={styles.inputContainer}>
          <Ionicons name="search" size={24} color="#FF8C00" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Pesquisar fazenda"
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            value={searchQuery}
            placeholderTextColor="#FF8C00"
          />
        </View>

        <ScrollView contentContainerStyle={styles.fazendaContainer}>
          {filteredFazendas.map(fazenda => (
            <TouchableOpacity key={fazenda.id} style={styles.fazenda} onPress={() => handleFazenda(fazenda.id)}>
              <View style={styles.fazendaContent}>
                <View style={styles.fazendaFoto}>
                  <Text style={styles.fazendaInitials}>{getInitials(fazenda.nomeFazenda)}</Text>
                </View>

                <View>
                  <Text style={styles.fazendaNome}>{fazenda.nomeFazenda}</Text>
                  <Text style={styles.fazendaNomeAgri}>{fazenda.nomeUsuario}</Text>
                </View>

                <TouchableOpacity style={styles.arrowIcon} onPress={() => handleFazenda(fazenda.id)}>
                  <Feather name="arrow-right" size={24} color="black" style={styles.searchIcon} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.button} onPress={() => handleCadastro()}>
          <Text style={styles.buttonText}>Cadastrar fazenda</Text>
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
  fazenda: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 10,
  },
  fazendaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fazendaNomeAgri: {
    color: '#BAB4B4'
  },
  fazendaFoto: {
    width: 48,
    height: 48,
    borderRadius: 30,
    backgroundColor: '#60CC64',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  fazendaInitials: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  arrowIcon: {
    marginLeft: 'auto',
  },
  button: {
    backgroundColor: '#FF8C00',
    borderRadius: 10,
    padding: 12,
    marginTop: 18,
    marginBottom: 18,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});
