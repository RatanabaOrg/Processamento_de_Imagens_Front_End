import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import firebase from '@react-native-firebase/app';
import axios from 'axios';

export default function EditarClienteEndereco() {
  const navigation = useNavigation();
  const route = useRoute();

  const [usuario, setUsuario] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [complemento, setComplemento] = useState('');
  const [enderecoId, setEnderecoId] = useState('');

  const fetchAddressByCEP = async (cep) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const { logradouro, bairro, localidade, uf } = response.data;
      setLogradouro(logradouro);
      setBairro(bairro);
      setCidade(localidade);
      setUf(uf);
    } catch (error) {
      console.log('Erro ao buscar endereço pelo CEP:', error);
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

  const handleCliente = async () => {
    try {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const { usuarioId } = route.params;
      const response = await axios.put(`http://10.0.2.2:3000/usuario/${usuarioId}`, {
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
      navigation.navigate('Main', { screen: 'Clientes' });
    } catch (error) {
      console.log('Erro ao salvar alterações:', error);
    }
  };

  useEffect(() => {
    const fetchUsuario = async () => {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const { usuarioId, nome, email, telefone } = route.params;
      setNome(nome)
      setEmail(email)
      setTelefone(telefone)

      try {
        const response = await axios.get(`http://10.0.2.2:3000/usuario/completo/${usuarioId}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });
        setUsuario(response.data);
        setCep(response.data.endereco.cep);
        setLogradouro(response.data.endereco.logradouro);
        setNumero(response.data.endereco.numero)
        setBairro(response.data.endereco.bairro);
        setCidade(response.data.endereco.cidade)
        setUf(response.data.endereco.uf)
        setComplemento(response.data.endereco.complemento);
        setEnderecoId(response.data.enderecoId)
      } catch (error) {
        console.log('Erro ao buscar usuário:', error);
      }
    };

    fetchUsuario();
  }, [route.params]);

  const removePhoto = () => {
    Alert.alert(
      `Foto de perfil`, "Deseja remover a foto? \n \nCaso queira, adicionar uma foto, volte para a página anterior!",
      [{ text: "Remover", onPress: () => { handleRemovePhoto() } },
      { text: "Cancelar", style: "cancel" }]
    );
  }

  const handleRemovePhoto = async () => {
    if (usuario.foto) {
      try {
        const { usuarioId } = route.params;
        await firebase.firestore().collection('DadosUsuario').doc(usuarioId).set({ foto: "" }, { merge: true });
        setUsuario(prevUsuario => ({ ...prevUsuario, foto: "" }));
      } catch (error) {
        console.log('Erro ao remover imagem:', error);
      }
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
                <Text style={styles.title}>Ver/Editar {usuario.nome}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.clienteCircle} 
                onPress={removePhoto}>
                {usuario && usuario.foto ? (
                  <Image source={{ uri: usuario.foto }} style={styles.clienteFoto} />
                ) : (
                  <Feather name="user" size={24} color="white" />
                )}
            </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <View style={styles.secondHalf}>
        <View style={styles.secondHalfInputs}>
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
        <TouchableOpacity style={styles.button} onPress={handleCliente}>
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
  clienteCircle: {
    width: 58,
    height: 58,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    zIndex: 1,
    alignSelf: 'center'
  },
  clienteFoto: {
    width: 54,
    height: 54,
    borderRadius: 30,
    backgroundColor: '#fff'
  },
  secondHalf: {
    flex: 8.0,
    backgroundColor: '#E9EEEB',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    justifyContent: 'flex-start',
  },
  secondHalfInputs: {
    marginTop: 50,
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
    padding: 10,
    alignItems: 'center',
    marginTop: 8,
    height: 44,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },

});
