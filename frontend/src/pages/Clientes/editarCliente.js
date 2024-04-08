import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

export default function EditarCliente() {
  const navigation = useNavigation();
  const route = useRoute();
  const [cliente, setCliente] = useState(null);

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

  const handleNextPage = (clienteId) => {
    navigation.navigate('EditarClienteEndereco', { clienteId: clienteId });
  };

  useEffect(() => {
    const { clienteId } = route.params;
    const clienteEncontrado = clientes.find(cliente => cliente.id === clienteId);
    setCliente(clienteEncontrado);
  }, [route.params]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstHalf}>
        <View>
          {cliente && (
            <View style={styles.firstHalfContent}>
              <Text style={styles.title}>Ver/Editar {cliente.nome}</Text>
              <Image source={{ uri: cliente.foto }} style={styles.clienteFoto} />
            </View>
          )}
        </View>
      </View>
      <View style={styles.secondHalf}>
      <View style={styles.secondHalfInputs}>
        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} placeholder="Seu nome"/>
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="Seu email"/>
        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} placeholder="Seu telefone"/>
      </View>
      <View style={styles.secondHalfButtons}>
        <TouchableOpacity style={styles.buttonDeletar}>
          <Text style={styles.buttonText}>Deletar Cliente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonProximo} onPress={() => handleNextPage(cliente.id)}>
          <Text style={styles.buttonText}>Próximo</Text>
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
  firstHalfContent:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#fff"
  },
  clienteFoto: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: '#ccc'
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
    marginTop: 50,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000'
  },
  input: {
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 10, 
  },
  secondHalfButtons: {
    flexDirection: 'row',
    marginTop: 18,
    justifyContent: 'space-between'
  },
  buttonDeletar: {
    backgroundColor: '#DE1B00',
    borderRadius: 10,
    paddingHorizontal: 32,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonProximo: {
    backgroundColor: '#2C8C1D',
    borderRadius: 10,
    paddingHorizontal: 56,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },

});
