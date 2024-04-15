import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import axios from 'axios';

export default function Login() {

  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (email === '' || password === '') {
      setErrorMessage('Preencha todos os campos');
      return;
    } 
  
    try {
      await auth().signInWithEmailAndPassword(email, password);
  
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const usuarioId = currentUser.uid;
  
      try {
        const response = await axios.get(`http://10.0.2.2:3000/usuario/${usuarioId}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });
  
        const userData = response.data;

        if (!userData.aprovado) {
          setErrorMessage('Usuário não aprovado!');
          return;
        }
  
        if (userData.cliente) {
          navigation.navigate('Main', { screen: 'Fazendas' });
        } else {
          navigation.navigate('Main', { screen: 'Clientes' });
        }
  
      } catch (error) {
        console.log('Erro ao buscar usuário:', error);
      }
  
    } catch (error) {
      console.log(error);
      if (error.code === 'auth/invalid-login') {
        setErrorMessage('Email e/ou senha incorretos!');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('Email fora de formatação, é preciso ter @ e .');
      } else if (error.code === 'auth/network-request-failed') {
        setErrorMessage('Solicitação falhou, erro de rede!');
      } else if (error.code === 'auth/invalid-credential') {
        setErrorMessage('Essa conta não existe!');
      } else {
        setErrorMessage('');
      }
    }
  };

  const handleCadastro = () => {
    navigation.navigate('Cadastro');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstHalf}>
        <Image
          source={require('./logo.png')}
          style={styles.image}
        />
      </View>

      <View style={styles.secondHalf}>
        <Text style={styles.title}>Login</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCompleteType="email"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Sua senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCadastro}>
          <View style={styles.divCadastrar}>
            <Text style={styles.cadastrar}>Ainda não tem uma conta? </Text>
            <Text style={styles.cadastrarColorido}>Criar conta</Text>
          </View>
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
    flex: 4.7,
    zIndex: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    height: 350,
    width: 350,
    resizeMode: 'contain',
  },
  secondHalf: {
    flex: 5.3,
    backgroundColor: '#E9EEEB',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    // paddingTop: 20,
    zIndex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FF8C00',
    textAlign: 'center'
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
  errorMessage: {
    color: 'red',
    fontSize: 16,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#FF8C00',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginTop: 18,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divCadastrar: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    color: '#000',
  },
  cadastrar: {
    color: '#000',
    fontSize: 14,
  },
  cadastrarColorido: {
    color: '#FF8C00',
    fontWeight: 'bold',
    fontSize: 15,
  }
});