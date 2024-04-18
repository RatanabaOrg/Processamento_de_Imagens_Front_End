import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import firebase from '@react-native-firebase/app';
import axios from 'axios';

export default function EditarPerfil() {
  const navigation = useNavigation();
  const route = useRoute();
  const [usuario, setUsuario] = useState(null);
  const [enderecoId, setEnderecoId] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [complemento, setComplemento] = useState('');

  const fetchAddressByCEP = async (cep) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const { logradouro, bairro, localidade, uf } = response.data;
      setLogradouro(logradouro);
      setBairro(bairro);
      setCidade(localidade);
      setUf(uf);
    } catch (error) {
      console.error('Erro ao buscar endereço pelo CEP:', error);
    }
  };

  const endereco = {
    cep: cep,
    logradouro: logradouro,
    numero: numero,
    cidade: cidade,
    bairro: bairro,
    uf: uf,
    complemento: complemento
  }

  useEffect(() => {
    const fetchUsuario = async () => {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const id = await currentUser.uid;
      try {
        const response = await axios.get(`http://10.0.2.2:3000/usuario/completo/${id}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });
        console.log(response.data);
        setUsuario(response.data);
        setNome(response.data.nome);
        setTelefone(response.data.telefone);
        setCep(response.data.endereco.cep);
        setLogradouro(response.data.endereco.logradouro);
        setNumero(response.data.endereco.numero)
        setBairro(response.data.endereco.bairro);
        setCidade(response.data.endereco.cidade)
        setUf(response.data.endereco.uf)
        setComplemento(response.data.endereco.complemento);
        setEnderecoId(response.data.enderecoId)
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsuario();
  }, []);

  const handleCliente = async () => {
    try {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const id = await currentUser.uid;
      const response = await axios.put(`http://10.0.2.2:3000/usuario/${id}`, {
        nome: nome,
        cep: cep,
        logradouro: logradouro,
        numero: numero,
        cidade: cidade,
        uf: uf,
        complemento: complemento,
        bairro: bairro,
        telefone: telefone,
        aprovado: true,
        enderecoId: enderecoId
      }, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });
      navigation.navigate('Main', { screen: 'Perfil' });
    } catch (error) {
      console.log('Erro ao salvar alterações:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstHalf}>
        <View>
          {usuario && (
            <View style={styles.firstHalfContent}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
                <Feather name="arrow-left" size={30} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.title}>Perfil</Text>
              </TouchableOpacity>
              {usuario.foto ? (
                <Image source={{ uri: usuario.foto }} style={styles.clienteFoto} />
              ) : (
                <Feather name="user" size={24} color="white" />
              )}
            </View>
          )}
        </View>
      </View>

      <View style={styles.secondHalf}>
        <ScrollView contentContainerStyle={styles.clienteContainer}>
          <View style={styles.secondHalfInputs}>
            <Text style={styles.label}>Nome</Text>
            <TextInput style={styles.input} placeholder={usuario ? usuario.nome : ''} value={nome} onChangeText={(text) => setNome(text)} />
            <Text style={styles.label}>Telefone</Text>
            <TextInput style={styles.input} placeholder={usuario ? usuario.telefone : ''} value={telefone} onChangeText={(text) => setTelefone(text)} />
            <Text style={styles.label}>CEP</Text>
            <TextInput style={styles.input} placeholder={usuario ? usuario.cep : ''} value={cep} onChangeText={(text) => setCep(text)} onBlur={() => fetchAddressByCEP(cep)} />
            <Text style={styles.label}>Logradouro</Text>
            <TextInput style={styles.input} placeholder={usuario ? usuario.logradouro : ''} value={logradouro} onChangeText={(text) => setLogradouro(text)} />
            <Text style={styles.label}>Número</Text>
            <TextInput style={styles.input} placeholder={usuario ? usuario.numero : ''} value={numero} onChangeText={(text) => setNumero(text)} />
            <Text style={styles.label}>Bairro</Text>
            <TextInput style={styles.input} placeholder={usuario ? usuario.bairro : ''} value={bairro} onChangeText={(text) => setBairro(text)} />
            <View style={styles.cidadeEUF}>
              <View>
                <Text style={styles.label}>Cidade</Text>
                <TextInput style={styles.inputCidade} placeholder={usuario ? usuario.cidade : ''} value={cidade} onChangeText={(text) => setCidade(text)} />
              </View>
              <View>
                <Text style={styles.label}>UF</Text>
                <TextInput style={styles.inputUF} placeholder={usuario ? usuario.uf : ''} value={uf} onChangeText={(text) => setUf(text)} />
              </View>
            </View>
            <Text style={styles.label}>Complemento</Text>
            <TextInput style={styles.input} placeholder={usuario ? usuario.complemento : ''} value={complemento} onChangeText={(text) => setComplemento(text)} />
          </View>
        </ScrollView>

        <View style={styles.secondHalfButton}>
          <TouchableOpacity style={styles.button} onPress={handleCliente}>
            <Text style={styles.buttonText}>Salvar alterações</Text>
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
    height: 44,
    fontSize: 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  cidadeEUF: {
    flexDirection: 'row'
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
  secondHalfButton: {
    flexDirection: 'row',
    marginTop: 18,
    marginBottom: 18,
    alignItems: 'center',
    height: 48,
  },
  button: {
    backgroundColor: '#2C8C1D',
    borderRadius: 10,
    paddingHorizontal: 56,
    paddingVertical: 12,
    alignItems: 'center',
    width: '100%',
    height: 44,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },

});
