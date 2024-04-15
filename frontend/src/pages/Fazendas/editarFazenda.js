import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import firebase from '@react-native-firebase/app';
import axios from 'axios'; 

export default function EditarFazenda() {
  const navigation = useNavigation();
  const route = useRoute();
  const [fazenda, setFazenda] = useState(null);
  const [nomeFazenda, setNomeFazenda] = useState('');
  const [coordenadaSede, setCoordenadaSede] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [complemento, setComplemento] = useState('');

  const handleDeletar = () => {
    Alert.alert(
          `Deletar fazenda`,
          "Você realmente deseja deletar essa fazenda? \n \nEssa ação é irreversível e irá apagar todos os dados relacionados a fazenda!",
          [{
            text: "Confirmar",
            onPress: () => { 
              const deleteFazenda = async () => {
                try {
                  const currentUser = firebase.auth().currentUser;
                  const idToken = await currentUser.getIdToken();
                  const { fazendaId } = route.params;
                  const response = await axios.delete(`http://10.0.2.2:3000/fazenda/${fazendaId}`, {
                    headers: {
                      'Authorization': `Bearer ${idToken}`,
                      'Content-Type': 'application/json'
                    }
                  });
                 
                  navigation.goBack();  
                  navigation.goBack();
                } catch (error) {
                  console.log('deletar fazenda');
                }
              };
              deleteFazenda() }
          },
          {
            text: "Cancelar",
            style: "cancel"
          }]
        );
  };

  const handleSalvar = async () => {
    try {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const { fazendaId } = route.params;
      const response = await axios.put(`http://10.0.2.2:3000/fazenda/${fazendaId}`, {
        nomeFazenda: nomeFazenda,
        coordenadaSede: coordenadaSede,
        cep: cep,
        logradouro: logradouro,
        numero: numero,
        cidade: cidade,
        bairro: bairro,
        uf: uf,
        complemento: complemento
      }, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });
      navigation.navigate('Main', {screen: 'Fazendas'});
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
    }
  };

  useEffect(() => {
    const fetchFazenda = async () => {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const { fazendaId } = route.params;
      console.log(fazendaId)
      try {
        const response = await axios.get(`http://10.0.2.2:3000/fazenda/completo/${fazendaId}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });
        setFazenda(response.data);
        setNomeFazenda(response.data.nomeFazenda);
        setCoordenadaSede(response.data.coordenadaSede);
        setCep(response.data.endereco.cep);
        setLogradouro(response.data.endereco.logradouro);
        setNumero(response.data.endereco.numero)
        setBairro(response.data.endereco.bairro);
        setCidade(response.data.endereco.cidade)
        setUf(response.data.endereco.uf)
        setComplemento(response.data.endereco.complemento);
      } catch (error) {
        console.error('Erro ao buscar fazenda:', error);
      }
    };

    fetchFazenda();
  }, [route.params]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstHalf}>
        <View>
          {fazenda && (
            <View style={styles.firstHalfContent}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
                <Feather name="arrow-left" size={30} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.title}>Ver/Editar {fazenda.nomeFazenda}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={styles.secondHalf}>
        <ScrollView contentContainerStyle={styles.fazendaContainer}>
        <View style={styles.secondHalfInputs}>
          <Text style={styles.label}>Nome</Text>
          <TextInput style={styles.input} placeholder={fazenda ? fazenda.nomeFazenda : ''} value={nomeFazenda} onChangeText={(text) => setNomeFazenda(text)} />

          <Text style={styles.label}>Coordenadas da sede</Text>
          <TextInput style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder={fazenda ? fazenda.coordenadaSede : ''}
            multiline={true} value={coordenadaSede} onChangeText={(text) => setCoordenadas(text)} />

          <Text style={styles.label}>CEP</Text>
          <TextInput style={styles.input} placeholder={fazenda ? fazenda.endereco.cep : ''} value={cep} onChangeText={(text) => setCep(text)} onBlur={() => fetchAddressByCEP(cep)}/>
          <Text style={styles.label}>Logradouro</Text>
          <TextInput style={styles.input} placeholder={fazenda ? fazenda.endereco.logradouro: ''} value={logradouro} onChangeText={(text) => setLogradouro(text)} />
          <Text style={styles.label}>Número</Text>
          <TextInput style={styles.input} placeholder={fazenda ? fazenda.endereco.numero : ''} value={numero} onChangeText={(text) => setNumero(text)} />
          <Text style={styles.label}>Bairro</Text>
          <TextInput style={styles.input} placeholder={fazenda ? fazenda.endereco.bairro: ''} value={bairro} onChangeText={(text) => setBairro(text)} />
          <View style={styles.cidadeEUF}>
            <View>
              <Text style={styles.label}>Cidade</Text>
              <TextInput style={styles.inputCidade} placeholder={fazenda ? fazenda.endereco.cidade: ''} value={cidade} onChangeText={(text) => setCidade(text)} />
            </View>
            <View>
              <Text style={styles.label}>UF</Text>
              <TextInput style={styles.inputUF} placeholder={fazenda ? fazenda.endereco.uf: ''} value={uf} onChangeText={(text) => setUf(text)} />
            </View>
          </View>
          <Text style={styles.label}>Complemento</Text>
          <TextInput style={styles.input} placeholder={fazenda ? fazenda.endereco.complemento : ''} value={complemento} onChangeText={(text) => setComplemento(text)} />
        </View>
        </ScrollView>

        <View style={styles.secondHalfButtons}>
          <TouchableOpacity style={styles.buttonDeletar} onPress={handleDeletar}>
            <Text style={styles.buttonText}>Deletar fazenda</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSalvar} onPress={handleSalvar}>
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
  secondHalfButtons: {
    flexDirection: 'row',
    marginTop: 18,
    marginBottom: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 42,
  },
  buttonDeletar: {
    backgroundColor: '#DE1B00',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    width: '48%',
    height: 44,
  },
  buttonSalvar: {
    backgroundColor: '#2C8C1D',
    borderRadius: 10,
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
