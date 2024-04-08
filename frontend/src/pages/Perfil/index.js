import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function  Clientes() {

  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClientes, setFilteredClientes] = useState([]);

  const clientes = [
    { id: 1, nome: 'Cliente 1', foto: 'https://example.com/foto1.jpg' },
    { id: 2, nome: 'Cliente 2', foto: 'https://example.com/foto2.jpg' },
    { id: 3, nome: 'Cliente 3', foto: 'https://example.com/foto3.jpg' },
    { id: 4, nome: 'Cliente 1', foto: 'https://example.com/foto1.jpg' },
    { id: 5, nome: 'Cliente 2', foto: 'https://example.com/foto2.jpg' },
    { id: 6, nome: 'Cliente 3', foto: 'https://example.com/foto3.jpg' },
    { id: 7, nome: 'Cliente 1', foto: 'https://example.com/foto1.jpg' },
    { id: 8, nome: 'Cliente 2', foto: 'https://example.com/foto2.jpg' },
    { id: 9, nome: 'Cliente 3', foto: 'https://example.com/foto3.jpg' },
  ];

  const handleClient = (clienteId) => {
    navigation.navigate('EditarCliente', { clienteId: clienteId });
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
        <TextInput
          style={styles.input}
          placeholder="Pesquisar cliente"
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          value={searchQuery}
        />
        <ScrollView contentContainerStyle={styles.clienteContainer}>
          {filteredClientes.map(cliente => (
            <TouchableOpacity key={cliente.id} style={styles.cliente} onPress={() => handleClient(cliente.id)}>
              <View style={styles.clienteContent}>
                <Image source={{ uri: cliente.foto }} style={styles.cliFoto} />
                <Text style={styles.clienteNome}>{cliente.nome}</Text>
                <TouchableOpacity style={styles.arrowIcon} onPress={() => handleClientClick(cliente.id)}>
                  {/* Implementar ícone de seta */}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.button}>
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
  firstHalfContent:{
    marginTop: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
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
  input: {
    height: 40,
    backgroundColor: '#FFF',
    borderColor: '#FF8C00',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 25,
    marginTop: 25,
    paddingHorizontal: 10, 
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
