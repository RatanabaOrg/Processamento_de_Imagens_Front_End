import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

export default function CriarArmadilha() {

  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleCadastrar = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstHalf}>
        <View>
          <View style={styles.firstHalfContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
              <Feather name="arrow-left" size={30} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.title}>Criar armadilha</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.secondHalf}>
        <View style={styles.secondHalfInputs}>
          <Text style={styles.label}>Nome</Text>
          <TextInput style={[styles.input, { paddingLeft: 16 }]}
            placeholder="Nome" onChangeText={(text) => setNome(text)} />

          <Text style={styles.label}>Latitude</Text>
          <TextInput style={[styles.input, { paddingLeft: 16 }]}
            placeholder="Latitude" onChangeText={(text) => setLatitude(text)} />

          <Text style={styles.label}>Longitude</Text>
          <TextInput style={[styles.input, { height: 100, paddingLeft: 16, textAlignVertical: 'top' }]}
            placeholder="Longitude"
            multiline={true} onChangeText={(text) => setLongitude(text)} />
        </View>

        <View style={styles.secondHalfButton}>
          <TouchableOpacity style={styles.button} onPress={() => handleCadastrar()}>
            <Text style={styles.buttonText}>Enviar cadastro</Text>
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
