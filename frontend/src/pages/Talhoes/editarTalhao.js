import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import firebase from '@react-native-firebase/app';
import axios from 'axios';

export default function EditarTalhao() {
  const navigation = useNavigation();
  const route = useRoute();
  const [talhao, setTalhao] = useState(null);
  const [nome, setNome] = useState(null);
  const [tipoPlantacao, setTipoPlantacao] = useState(null);
  const [coordenadas, setCoordenadas] = useState(null); // Corrigido o nome da variável

  const handleFazenda = (talhaoId) => {
    navigation.navigate('VerFazenda', { talhaoId: talhaoId });
  };

  const handleDeletar = () => {
    Alert.alert(
      `Deletar talhão`,
      "Você realmente deseja deletar esse talhão? \n \nEssa ação é irreversível e irá apagar todos os dados relacionados ao talhão!",
      [{
        text: "Confirmar",
        onPress: () => {  
        const deleteTalhao = async () => {
          try {
            const currentUser = firebase.auth().currentUser;
            const idToken = await currentUser.getIdToken();
            const { talhaoId } = route.params;
            const response = await axios.delete(`http://10.0.2.2:3000/talhao/${talhaoId}`, {
              headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
              }
            });
           
            navigation.navigate('VerFazenda');
          } catch (error) {
            console.error('Erro ao deletar usuario:', error);
          }
        };
        deleteTalhao()
      }
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
      const { talhaoId } = route.params;
      const response = await axios.put(`http://10.0.2.2:3000/talhao/${talhaoId}`, {
        nomeTalhao: nome,
        tipoPlantacao: tipoPlantacao, 
        coordenadas: coordenadas 
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

  useEffect(() => {
    console.log('oi')
    const fetchTalhao = async () => {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const { talhaoId } = route.params;
      try {
        const response = await axios.get(`http://10.0.2.2:3000/talhao/completo/${talhaoId}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });
        console.log(response.data)
        setTalhao(response.data);
        setNome(response.data.nomeTalhao);
        setTipoPlantacao(response.data.tipoPlantacao);
        setCoordenadas(response.data.coordenadas);
      } catch (error) {
        console.error('Erro ao buscar talhao:', error);
      }
    };

    fetchTalhao();
  }, [route.params]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstHalf}>
        <View>
          {talhao && (
            <View style={styles.firstHalfContent}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
                <Feather name="arrow-left" size={30} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.title}>Ver/Editar {talhao.nomeTalhao}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={styles.secondHalf}>
        <View style={styles.secondHalfInputs}>
          <Text style={styles.label}>Nome</Text>
          <TextInput style={styles.input} placeholder={talhao ? talhao.nomeTalhao : ''} value={nome} onChangeText={(text) => setNome(text)} />

          <Text style={styles.label}>Tipo de plantação</Text>
          <TextInput style={styles.input}
            placeholder={talhao ? talhao.tipoPlantacao : ''}
            value={tipoPlantacao}
            onChangeText={(text) => setTipoPlantacao(text)} />

          <Text style={styles.label}>Coordenadas</Text>
          <TextInput style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder={talhao ? talhao.coordenadas : ''}
            value={coordenadas}
            multiline={true} onChangeText={(text) => setCoordenadas(text)} />
        </View>

        <View style={styles.secondHalfButtons}>
          <TouchableOpacity style={styles.buttonDeletar} onPress={() => handleDeletar()}>
            <Text style={styles.buttonText}>Deletar talhão</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSalvar} onPress={() => handleSalvar()}>
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
