import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Clientes() {

  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClientes, setFilteredClientes] = useState([]);

  const clientes = [
    { id: 1, nome: 'Cliente 1', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRke-KojYq2QQ9p9nFqtgMUoRu9Jvvccw2vsoGtE7fIzQ&s' },
    { id: 2, nome: 'Cliente 2', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8eCsr2-dOzB8bGFCpv_4OY5c0a-eV5adytdPcKlTLBCPd8gWTWUkIxQR5MjABUtO6daU&usqp=CAU' },
    { id: 3, nome: 'Cliente 3', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh-C6XlLDyom3ZA-YU98RZsMIx50qwU8xzlmtiK261de3VveBy0QBgOsFNac3Yb69WsBU&usqp=CAU' },
    { id: 4, nome: 'Cliente 4', foto: 'https://cdn2.iconfinder.com/data/icons/avatar-181/48/avatar_face_man_boy_girl_female_male_woman_profile_smiley_happy_people-05-512.png' },
    { id: 5, nome: 'Cliente 5', foto: 'https://w7.pngwing.com/pngs/900/441/png-transparent-avatar-face-man-boy-male-profile-smiley-avatar-icon.png' },
    { id: 6, nome: 'Cliente 6', foto: 'https://cdn.icon-icons.com/icons2/2859/PNG/512/avatar_face_man_boy_male_profile_smiley_happy_people_icon_181657.png' },
    { id: 7, nome: 'Cliente 7', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZnWCJBWFXoxMKXQ_cAWgPOq8tEtJgUsRQp3er_BZG6_bQ_65iUHVIJs6pHeEeJFu1B3Q&usqp=CAU' },
    { id: 8, nome: 'Cliente 8', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG88OHoEqetgy0Th0sFXZ0lAoq_JcTSaMJnADe7PlvZg&s' },
    { id: 9, nome: 'Cliente 9', foto: 'https://example.com/foto1.jpg' },
  ];

  const handleClient = (clienteId) => {
    navigation.navigate('EditarCliente', { clienteId: clienteId });
  };

  const handleApproval = () => {
    navigation.navigate('AprovarContas');
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
          <Text style={styles.title}>Últimos clientes</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>

            {clientes.map((cliente, index) => (
              <TouchableOpacity key={index} style={styles.clienteCircle}>
                <Image source={{ uri: cliente.foto }} style={styles.clienteFoto} />
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
        <TouchableOpacity style={styles.button} onPress={() => handleApproval()}>
          <Text style={styles.buttonText}>Aprovar contas</Text>
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
