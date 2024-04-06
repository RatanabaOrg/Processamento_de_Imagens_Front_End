import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
export default function Login() {

  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate('Clientes');
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
          />
        <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Sua senha"
            secureTextEntry
          />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity>
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
    fontSize: 28,
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
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 10, 
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
  },
  divCadastrar: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    color:  '#000'
  },
  cadastrar: {
    color: '#000'
  },
  cadastrarColorido: {
    color: '#FF8C00',
    fontWeight: 'bold'
  }
});