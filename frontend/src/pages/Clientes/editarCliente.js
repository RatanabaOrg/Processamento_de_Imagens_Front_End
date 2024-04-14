import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import firebase from '@react-native-firebase/app';
import axios from 'axios'; 

export default function EditarCliente() {
  const navigation = useNavigation();
  const route = useRoute();
  const [usuario, setUsuario] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [idUser, setIdUser] = useState(null)

  const handleNextPage = () => {
    navigation.navigate('EditarClienteEndereco', { 
      usuarioId: idUser,
      nome: nome,
      email: email,
      telefone: telefone
    });
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
      navigation.navigate('Main', {screen: 'Clientes'});
    } catch (error) {
      console.error('Erro ao deletar usuario:', error);
    }
  };
  
  const handleNomeChange = (text) => {
    setNome(text);
  };

  const handleTelefoneChange = (text) => {
    setTelefone(text);
  };

  useEffect(() => {
    const fetchUsuario = async () => {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const { usuarioId } = route.params;
      setIdUser(usuarioId)
      try {
        const response = await axios.get(`http://10.0.2.2:3000/usuario/${usuarioId}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });
        setUsuario(response.data);
        setNome(response.data.nome);
        setEmail(response.data.email);
        setTelefone(response.data.telefone);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
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
                <Text style={styles.title}>Ver/Editar {usuario.nome}</Text>
              </TouchableOpacity>
              <Image source={{ uri: usuario.foto }} style={styles.clienteFoto} />
            </View>
          )}
        </View>
      </View>
      <View style={styles.secondHalf}>
        <View style={styles.secondHalfInputs}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            value={nome}
            onChangeText={handleNomeChange}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            editable={false}
            placeholder="Seu email"
            value={email}
          />
          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu telefone"
            value={telefone}
            onChangeText={handleTelefoneChange}
          />
        </View>
        <View style={styles.secondHalfButtons}>
          <TouchableOpacity style={styles.buttonDeletar} onPress={deleteCliente}>
            <Text style={styles.buttonText}>Deletar cliente</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonProximo} onPress={handleNextPage}>
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
  secondHalfButtons: {
    flexDirection: 'row',
    marginTop: 18,
    justifyContent: 'space-between',
    height: 44,
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