import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import firebase from '@react-native-firebase/app';
import axios from 'axios';

export default function VerConta() {
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

  const handleCliente = async () => {
    try {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const { usuarioId } = route.params;
      await axios.put(`http://10.0.2.2:3000/usuario/${usuarioId}`, {
        nome: nome,
        cep: cep,
        logradouro: logradouro,
        numero: numero,
        cidade: cidade,
        uf: uf,
        complemento: complemento,
        bairro: bairro,
        telefone: telefone,
        aprovado: true
      }, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
    }
  };

  const deleteCliente = async () => {
    try {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const { usuarioId } = route.params;
      const response = await axios.delete(`http://10.0.2.2:3000/usuario/${usuarioId}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });
      navigation.goBack();
    } catch (error) {
      console.log('Erro ao deletar usuario:', error);
    }
  };

  useEffect(() => {
    const fetchUsuario = async () => {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const { usuarioId } = route.params;

      try {
        const response = await axios.get(`http://10.0.2.2:3000/usuario/completo/${usuarioId}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });
        setUsuario(response.data);
        setNome(response.data.nome)
        setEmail(response.data.email)
        setTelefone(response.data.telefone)
        setCep(response.data.endereco.cep);
        setLogradouro(response.data.endereco.logradouro);
        setNumero(response.data.endereco.numero)
        setBairro(response.data.endereco.bairro);
        setCidade(response.data.endereco.cidade)
        setUf(response.data.endereco.uf)
        setComplemento(response.data.endereco.complemento);
      } catch (error) {
        console.log('Erro ao buscar usuário:', error);
      }
    };

    fetchUsuario();
  }, [route.params]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstHalf}>
        <View>
          {usuario && (
            <View style={styles.firstHalfContent}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
                <Feather name="arrow-left" size={30} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.title}>Ver conta</Text>
              </TouchableOpacity>
              <View style={styles.clienteCircle}>
                {usuario.foto ? (
                  <Image source={{ uri: usuario.foto }} style={styles.clienteFoto} />
                ) : (
                  <Feather name="user" size={24} color="white" />
                )}
              </View>
            </View>
          )}
        </View>
      </View>

      <View style={styles.secondHalf}>
        <ScrollView contentContainerStyle={styles.clienteContainer}>
          <View style={styles.secondHalfInputs}>
            <Text style={styles.label}>Nome</Text>
            <TextInput style={styles.input} placeholder={usuario ? usuario.nome : ''} editable={false} value={nome} />
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} placeholder={usuario ? usuario.email : ''} editable={false} value={email} />
            <Text style={styles.label}>Telefone</Text>
            <TextInput style={styles.input} placeholder={usuario ? usuario.telefone : ''} editable={false} value={telefone} />
            <Text style={styles.label}>CEP</Text>
            <TextInput style={styles.input} placeholder={usuario ? usuario.cep : ''} editable={false} value={cep} />
            <Text style={styles.label}>Logradouro</Text>
            <TextInput style={styles.input} placeholder={usuario ? usuario.logradouro : ''} editable={false} value={logradouro} />
            <Text style={styles.label}>Número</Text>
            <TextInput style={styles.input} placeholder={usuario ? usuario.numero : ''} editable={false} value={numero} />
            <Text style={styles.label}>Bairro</Text>
            <TextInput style={styles.input} placeholder={usuario ? usuario.bairro : ''} editable={false} value={bairro} />
            <View style={styles.cidadeEUF}>
              <View>
                <Text style={styles.label}>Cidade</Text>
                <TextInput style={styles.inputCidade} placeholder={usuario ? usuario.cidade : ''} editable={false} value={cidade} />
              </View>
              <View>
                <Text style={styles.label}>UF</Text>
                <TextInput style={styles.inputUF} placeholder={usuario ? usuario.uf : ''} editable={false} value={uf} />
              </View>
            </View>
            <Text style={styles.label}>Complemento</Text>
            <TextInput style={styles.input} placeholder={usuario ? usuario.complemento : ''} editable={false} value={complemento} />
          </View>
        </ScrollView>

        <View style={styles.secondHalfButtons}>
          <TouchableOpacity style={styles.buttonDeletar} onPress={deleteCliente}>
            <Text style={styles.buttonText}>Deletar cliente</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonAprovar} onPress={handleCliente}>
            <Text style={styles.buttonText}>Aprovar</Text>
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
  secondHalfButtons: {
    flexDirection: 'row',
    marginTop: 18,
    marginBottom: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 88,
  },
  buttonDeletar: {
    backgroundColor: '#DE1B00',
    borderRadius: 10,
    paddingHorizontal: 32,
    paddingVertical: 12,
    alignItems: 'center',
    width: '48%',
    height: 44,
  },
  buttonAprovar: {
    backgroundColor: '#2C8C1D',
    borderRadius: 10,
    paddingHorizontal: 56,
    paddingVertical: 12,
    alignItems: 'center',
    width: '48%',
    height: 44,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },

});
