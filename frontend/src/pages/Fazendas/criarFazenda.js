import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';

export default function CriarFazenda() {

  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [agricultor, setAgricultor] = useState('');
  const [coordenadas, setCoordenadas] = useState('');
  const [hasCEP, setHasCEP] = useState(false);

  const agricultores = [
    { id: 1, nome: 'Agricultor 1' },
    { id: 2, nome: 'Agricultor 2' },
    { id: 3, nome: 'Agricultor 3' },
    { id: 4, nome: 'Agricultor 4' },
  ];

  const handleNextPage = () => {
    navigation.navigate('CriarFazendaCep');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstHalf}>
        <View>
          <View style={styles.firstHalfContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
              <Feather name="arrow-left" size={30} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.title}>Cadastro de fazenda</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.secondHalf}>
        <View style={styles.secondHalfInputs}>
          <Text style={styles.label}>Nome</Text>
          <TextInput style={[styles.input, { paddingLeft: 16 }]} 
          placeholder="Nome" onChangeText={(text) => setNome(text)} />

          <Text style={styles.label}>Agricultor</Text>
          <View style={styles.input}>
            <Picker
              selectedValue={agricultor}
              onValueChange={(itemValue, itemIndex) => setAgricultor(itemValue)}
            >
              <Picker.Item label="Escolha" value="" />
              {agricultores.map((agricultor) => (
                <Picker.Item key={agricultor.id} label={agricultor.nome} value={agricultor.nome} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Coordenadas da sede</Text>
          <TextInput style={[styles.input, { height: 100, paddingLeft: 16, textAlignVertical: 'top' }]}
            placeholder="[[Latitude, Longitude],[Latitude, Longitude]]"
            multiline={true} onChangeText={(text) => setCoordenadas(text)} />

          <Text style={styles.label}>A fazenda possuí um CEP?</Text>
          <View style={styles.input}>
            <Picker
              selectedValue={hasCEP}
              onValueChange={(itemValue, itemIndex) => setHasCEP(itemValue)}
            >
              <Picker.Item label="Sim" value={true} />
              <Picker.Item label="Não" value={false} />
            </Picker>
          </View>
        </View>

        <View style={styles.secondHalfButton}>
          {hasCEP ? (
            <TouchableOpacity style={styles.button} onPress={handleNextPage}>
              <Text style={styles.buttonText}>Próximo</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Salvar alterações</Text>
            </TouchableOpacity>
          )}
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
