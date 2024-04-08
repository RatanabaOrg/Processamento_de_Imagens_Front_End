import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function  VerFazendas() {

  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFazendas, setFilteredFazendas] = useState([]);

  const fazendas = [
    { id: 1, nome: 'Fazenda 1', agricultor: 'Luiz Silva', cor: 'blue' },
    { id: 2, nome: 'Fazenda 2', agricultor: 'Luiz Silva', cor: 'blue' },
    { id: 3, nome: 'Fazenda 3', agricultor: 'Luiz Silva', cor: 'blue' },
    { id: 4, nome: 'Fazenda 4', agricultor: 'Luiz Silva', cor: 'blue' },
    { id: 5, nome: 'Fazenda 5', agricultor: 'Luiz Silva', cor: 'blue' },
    { id: 6, nome: 'Fazenda 6', agricultor: 'Luiz Silva', cor: 'blue' },
    { id: 7, nome: 'Fazenda 7', agricultor: 'Luiz Silva', cor: 'blue' },
    { id: 8, nome: 'Fazenda 8', agricultor: 'Luiz Silva', cor: 'blue' },
    { id: 9, nome: 'Fazenda 9', agricultor: 'Luiz Silva', cor: 'blue' },
  ];

  const handleFazenda = (fazendaId) => {
    navigation.navigate('EditarFazenda', { fazendaId: fazendaId });
  };

  useEffect(() => {
    setFilteredFazendas(fazendas);
  }, []);
  
  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setFilteredFazendas(fazendas);
    } else {
      const filtered = fazendas.filter(fazenda => fazenda.nome.toLowerCase().includes(searchQuery.toLowerCase()));
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
        <TextInput
          style={styles.input}
          placeholder="Pesquisar fazenda"
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          value={searchQuery}
        />
        <ScrollView contentContainerStyle={styles.clienteContainer}>
          {filteredFazendas.map(fazenda => (
            <TouchableOpacity key={fazenda.id} style={styles.cliente} onPress={() => handleFazenda(fazenda.id)}>
              <View style={styles.clienteContent}>
                <Image source={{ uri: fazenda.cor }} style={styles.cliFoto} />
                <Text style={styles.clienteNome}>{fazenda.nome}</Text>
                <TouchableOpacity style={styles.arrowIcon} onPress={() => handleClientClick(cliente.id)}>
                  {/* Implementar ícone de seta */}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.button} >
          <Text style={styles.buttonText}>Adicionar fazenda</Text>
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
  firstHalfContent:{
    marginTop: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
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
    flex: 8.3,
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
