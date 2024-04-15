import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

export default function AprovarContas() {

  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClientes, setFilteredClientes] = useState([]);

  const clientes = [
    { id: 1, nome: 'Cliente 1', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRke-KojYq2QQ9p9nFqtgMUoRu9Jvvccw2vsoGtE7fIzQ&s' },
    { id: 2, nome: 'Cliente 2', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8eCsr2-dOzB8bGFCpv_4OY5c0a-eV5adytdPcKlTLBCPd8gWTWUkIxQR5MjABUtO6daU&usqp=CAU' },
    { id: 3, nome: 'Cliente 3', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh-C6XlLDyom3ZA-YU98RZsMIx50qwU8xzlmtiK261de3VveBy0QBgOsFNac3Yb69WsBU&usqp=CAU' },
    { id: 4, nome: 'Cliente 4', foto: 'https://cdn2.iconfinder.com/data/icons/avatar-181/48/avatar_face_man_boy_girl_female_male_woman_profile_smiley_happy_people-05-512.png' },
  ];

  const handleClient = (clienteId) => {
    navigation.navigate('VerConta', { clienteId: clienteId });
  };

  useEffect(() => {
    setFilteredClientes(clientes);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setFilteredClientes(clientes);
    } else {
      const filtered = clientes.filter(cliente => cliente.nome.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredClientes(filtered);
    }
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
          {filteredClientes.map(cliente => (
            <TouchableOpacity key={cliente.id} style={styles.cliente} onPress={() => handleClient(cliente.id)}>
              <View style={styles.clienteContent}>
                <Image source={{ uri: cliente.foto }} style={styles.cliFoto} />
                <Text style={styles.clienteNome}>{cliente.nome}</Text>
                <TouchableOpacity style={styles.arrowIcon} onPress={() => handleClient(cliente.id)}>
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
  cliFoto: {
    width: 48,
    height: 48,
    borderRadius: 30,
    backgroundColor: '#ccc'
  },
  clienteNome: {
    marginLeft: 10,
  },
  arrowIcon: {
    marginLeft: 'auto',
  },
});
