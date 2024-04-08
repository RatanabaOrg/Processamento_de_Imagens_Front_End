import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

export default function EditarClienteEndereco() {
  const navigation = useNavigation();
  const route = useRoute();
  const [cliente, setCliente] = useState(null);

  const clientes = [
    { id: 1, nome: 'Cliente 1', foto: 'https://example.com/foto1.jpg', cep: 12230240 },
    { id: 2, nome: 'Cliente 2', foto: 'https://example.com/foto2.jpg', cep: 22230240},
    { id: 3, nome: 'Cliente 3', foto: 'https://example.com/foto3.jpg', cep: 32230240},
    { id: 4, nome: 'Cliente 1', foto: 'https://example.com/foto1.jpg', cep: 42230240},
    { id: 5, nome: 'Cliente 2', foto: 'https://example.com/foto2.jpg', cep: 52230240},
    { id: 6, nome: 'Cliente 3', foto: 'https://example.com/foto3.jpg', cep: 62230240},
    { id: 7, nome: 'Cliente 1', foto: 'https://example.com/foto1.jpg', cep: 72230240},
    { id: 8, nome: 'Cliente 2', foto: 'https://example.com/foto2.jpg', cep: 82230240},
    { id: 9, nome: 'Cliente 3', foto: 'https://example.com/foto3.jpg', cep: 92230240},
  ];

  const handleClientes = () => {
      navigation.navigate('Main', {screen: 'Clientes'});
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
        <Text style={styles.label}>CEP</Text>
        <TextInput style={styles.input} placeholder="Seu cep"/>
        <Text style={styles.label}>Logradouro</Text>
        <TextInput style={styles.input} placeholder="Seu logradouro"/>
        <Text style={styles.label}>Numero</Text>
        <TextInput style={styles.input} placeholder="Seu numero"/>
        <Text style={styles.label}>Bairro</Text>
        <TextInput style={styles.input} placeholder="Seu bairro"/>
        <View style={styles.cidadeEUF}>
          <View>
          <Text style={styles.label}>Cidade</Text>
          <TextInput style={styles.inputCidade} placeholder="Sua cidade"/>
          </View>
          <View>
          <Text style={styles.label}>UF</Text>
          <TextInput style={styles.inputUF} placeholder="UF"/>
          </View>
        </View>
        <Text style={styles.label}>Complemento</Text>
        <TextInput style={styles.input} placeholder="Seu complemento"/>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleClientes}>
        <Text style={styles.buttonText}>Salvar alterações</Text>
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
    marginTop: 30,
  },
  cidadeEUF: {
    flexDirection: 'row'
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
  inputCidade: {
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 10, 
    minWidth: 280,
    marginRight: 8,
  },
  inputUF: {
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 10, 
    minWidth: 61
  },
  button: {
    backgroundColor: '#2C8C1D',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },

});
