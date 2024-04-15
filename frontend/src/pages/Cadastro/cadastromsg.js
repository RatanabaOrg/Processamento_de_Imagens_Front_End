import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CadastroMsg() {

  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate('Login');
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
        <Text style={styles.title}>Cadastro</Text>

        <Text style={styles.label}>Seu cadastro foi concluído com sucesso!</Text>
        <Text style={styles.label}>Agora está em análise para aprovação. Por favor, tente fazer o login novamente em breve.</Text>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Ir para login</Text>
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
    zIndex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#FF8C00',
    textAlign: 'center'
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000'
  },
  button: {
    backgroundColor: '#FF8C00',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});