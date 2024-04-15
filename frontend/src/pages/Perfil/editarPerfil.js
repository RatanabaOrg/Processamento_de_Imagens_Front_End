import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

export default function EditarPerfil() {
  const navigation = useNavigation();
  const route = useRoute();
  const [usuario, setUsuario] = useState(null);
  const [usuarioAtual, setUsuarioAtual] = useState(null);

  const clientes = [
    { id: 1, nome: 'Cliente 1', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRke-KojYq2QQ9p9nFqtgMUoRu9Jvvccw2vsoGtE7fIzQ&s' },
  ];

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
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsuario();
  }, []);

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
              {/* <Image source={{ uri: cliente.foto }} style={styles.clienteFoto} /> */}
            </View>
          )}
        </View>
      </View>

      <View style={styles.secondHalf}>
        <ScrollView contentContainerStyle={styles.clienteContainer}>
          <View style={styles.secondHalfInputs}>
            <Text style={styles.label}>Nome</Text>
            <TextInput style={styles.input} placeholder="Seu nome" />
            <Text style={styles.label}>Telefone</Text>
            <TextInput style={styles.input} placeholder="Seu telefone" />
            <Text style={styles.label}>CEP</Text>
            <TextInput style={styles.input} placeholder="Seu cep" />
            <Text style={styles.label}>Logradouro</Text>
            <TextInput style={styles.input} placeholder="Seu logradouro" />
            <Text style={styles.label}>Número</Text>
            <TextInput style={styles.input} placeholder="Seu número" />
            <Text style={styles.label}>Bairro</Text>
            <TextInput style={styles.input} placeholder="Seu bairro" />
            <View style={styles.cidadeEUF}>
              <View>
                <Text style={styles.label}>Cidade</Text>
                <TextInput style={styles.inputCidade} placeholder="Sua cidade" />
              </View>
              <View>
                <Text style={styles.label}>UF</Text>
                <TextInput style={styles.inputUF} placeholder="UF" />
              </View>
            </View>
            <Text style={styles.label}>Complemento</Text>
            <TextInput style={styles.input} placeholder="Seu complemento" />
          </View>
        </ScrollView>

        <View style={styles.secondHalfButton}>
          <TouchableOpacity style={styles.button}>
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
    height: 88,
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
