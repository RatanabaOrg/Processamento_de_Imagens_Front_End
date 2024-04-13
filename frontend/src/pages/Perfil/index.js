import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import firebase from '@react-native-firebase/app';
import axios from 'axios'; // Adicionei a importação do axios

export default function Clientes() {

  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [usuarioAtual, setUsuarioAtual] = useState(null);


  useEffect(() => {
    const fetchUsuario = async () => {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const id = await currentUser.uid;
      setUsuarioAtual(currentUser.email)
      console.log(idToken)
      
      try {
        const response = await axios.get(`http://10.0.2.2:3000/usuario/${id}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });
        setUsuario(response.data); 
        console.log(response.data)
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsuario();
  }, []);

  const handleSignOut = () => {
    auth().signOut().then(() => {
      navigation.navigate("Login") // Troquei useNavigation por navigation
    })
    .catch(() => {
      console.log("Não há usuário logado")
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstHalf}>
        <TouchableOpacity style={styles.firstHalfContent} onPress={() => handleSignOut()}>
          <Text style={styles.title}>Sair</Text>
          <Feather name="log-out" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.clienteCircle}>
        <Image source={{ nome: usuario ? usuario.nome : ''}} style={styles.clienteFoto} />
      </TouchableOpacity>

      <View style={styles.secondHalf}>
        <View style={styles.secondHalfInputs}>
          <Text style={styles.label}>Nome completo</Text>
          <TextInput style={styles.input} 
            placeholder="Seu nome" editable={false} value={usuario ? usuario.nome : ''} />
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} 
            placeholder="Seu email" editable={false} value={usuario ?  usuarioAtual : ''} />
          <Text style={styles.label}>Telefone</Text>
          <TextInput style={styles.input} 
            placeholder="Seu telefone" editable={false} value={usuario ? usuario.telefone : ''} />
        </View>

        <TouchableOpacity style={styles.button} onPress={() => handleProfile(clientes[0].id)}>
          <Text style={styles.buttonText}>Editar</Text>
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
    flex: 1.5,
    paddingTop: 60,
  },
  firstHalfContent: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    gap: 8,
    paddingRight: 30
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  clienteCircle: {
    width: 154,
    height: 154,
    borderRadius: 75,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    position: 'absolute',
    zIndex: 1,
    top: 180,
    alignSelf: 'center'
  },
  clienteFoto: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  secondHalf: {
    flex: 4,
    backgroundColor: '#E9EEEB',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    justifyContent: 'center',
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
    backgroundColor: '#ccc',
    borderRadius: 12,
    marginBottom: 8,
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
    alignSelf: 'center',
    marginTop: 18,
    marginBottom: 18,
    width: '30%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
