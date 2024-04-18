import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import firebase from '@react-native-firebase/app';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

export default function CriarFazendaCep() {
  const navigation = useNavigation();
  const route = useRoute();
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUF] = useState('');
  const [complemento, setComplemento] = useState('');

  const CriarFazendaCep = route.params;
  console.log(CriarFazendaCep);

  const handleFazendas = async () => {
    try {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const response = await axios.post(`http://10.0.2.2:3000/fazenda/cadastro`, {
        nomeFazenda: CriarFazendaCep.nome,
        coordenadaSede: CriarFazendaCep.cordenadasSede,
        usuarioId: CriarFazendaCep.usuarioId,
        endereco: {
          cep: cep,
          logradouro: logradouro,
          numero: numero,
          cidade: cidade,
          uf: uf,
          complemento: complemento,
          bairro: bairro
        }
      }, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });
      navigation.navigate('Main', { screen: 'Fazenda' });
    } catch (error) {
      console.error('Erro ao cadastrar fazenda:', error);
    }
    // aparecer mensagem de erro e perguntar se quer voltar para pagina anterior ou tentar de novo
    navigation.navigate('Main', { screen: 'Fazenda' });
  };

  const fetchAddressByCEP = async (cep) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const { logradouro, bairro, localidade, uf } = response.data;
      setLogradouro(logradouro);
      setBairro(bairro);
      setCidade(localidade);
      setUF(uf);
    } catch (error) {
      console.error('Erro ao buscar endereço pelo CEP:', error);
    }
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

          <Text style={styles.label}>CEP</Text>
          <TextInput style={styles.input} placeholder="00000-000"
            value={cep} onChangeText={(text) => setCep(text)} onBlur={() => fetchAddressByCEP(cep)} />

          <Text style={styles.label}>Logradouro</Text>
          <TextInput style={styles.input} placeholder="Logradouro"
            value={logradouro} onChangeText={(text) => setLogradouro(text)} />

          <Text style={styles.label}>Número</Text>
          <TextInput style={styles.input} placeholder="0000"
            value={numero} onChangeText={(text) => setNumero(text)} />

          <Text style={styles.label}>Bairro</Text>
          <TextInput style={styles.input} placeholder="Bairro"
            value={bairro} onChangeText={(text) => setBairro(text)} />

          <View style={styles.cidadeEUF}>
            <View>
              <Text style={styles.label}>Cidade</Text>
              <TextInput style={styles.inputCidade} placeholder="Cidade"
                value={cidade} onChangeText={(text) => setCidade(text)} />
            </View>

            <View>
              <Text style={styles.label}>UF</Text>
              <TextInput style={styles.inputUF} placeholder="UF"
                value={uf} onChangeText={(text) => setUF(text)} />
            </View>
          </View>

          <Text style={styles.label}>Complemento</Text>
          <TextInput style={styles.input} placeholder="Complemento"
            value={complemento} onChangeText={(text) => setComplemento(text)} />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleFazendas}>
          <Text style={styles.buttonText}>Salvar alterações</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const checkCEP = (text) => {
  console.log('entreii')
  fetch(`https://viacep.com.br/ws/${text}/json/`)
    .then((res) => res.json())
    .then((data) => {
      setLogradouro(data.logradouro);
      setBairro(data.bairro);
      setCidade(data.localidade);
      setUF(data.uf);
      setDisabled(true);
    })
    .catch((err) => {
      Alert.alert('Erro ao buscar o endereço');
      setDisabled(false);
      setLogradouro('');
      setBairro('');
      setCidade('');
      setUF('');
    });
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
    height: 44,
    fontSize: 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  inputCidade: {
    height: 44,
    fontSize: 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 10,
    minWidth: 280,
    marginRight: 8,
  },
  inputUF: {
    height: 44,
    fontSize: 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 10,
    minWidth: 61
  },
  button: {
    backgroundColor: '#2C8C1D',
    borderRadius: 10,
    paddingHorizontal: 56,
    paddingVertical: 12,
    marginTop: 18,
    marginBottom: 18,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },

});
