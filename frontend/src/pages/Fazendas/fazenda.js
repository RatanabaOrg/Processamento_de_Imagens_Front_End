import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import firebase from '@react-native-firebase/app';
import axios from 'axios';

export default function VerFazenda() {
  const navigation = useNavigation();
  const route = useRoute();
  const [fazenda, setFazenda] = useState(null);
  const [talhoes, setTalhoes] = useState([]);

  const [nome, setNome] = useState('');
  const [coordenadas, setCoordenadas] = useState('');

  const handleSeeMore = (fazendaId) => {
    navigation.navigate('EditarFazenda', { fazendaId: fazendaId });
  };

  const handleTalhao = (talhaoId) => {
    navigation.navigate('VerTalhao', { talhaoId: talhaoId });
  };

  const handleCadastro = () => {
    navigation.navigate('CriarTalhao');
  };

  useEffect(() => {
    
  }, []);

  useEffect(() => {
    const fetchFazenda = async () => {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const { fazendaId } = route.params;
      try {
        const response = await axios.get(`http://10.0.2.2:3000/fazenda/completo/${fazendaId}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });
        setFazenda(response.data);
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
                <View>
                  <Text style={styles.title}>{fazenda.nomeFazenda}</Text>
                  <Text style={styles.titleAgri}>Agricultor: {fazenda.agricultor}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={styles.secondHalf}>
        <View style={styles.secondHalfInputs}>
          <Text style={styles.label}>Nome</Text>
          <TextInput style={styles.input} placeholder={fazenda ? fazenda.nomeFazenda : ''} editable={false} />

          <Text style={styles.label}>Coordenadas da sede</Text>
          <TextInput style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder={fazenda ? fazenda.coordenadaSede : ''}
            multiline={true} editable={false}/>

          <View>
            <TouchableOpacity activeOpacity={0.7} onPress={() => handleSeeMore(fazenda.id)}>
              <Text style={styles.seeMore}>Ver mais</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.talhoes}>Talhões</Text>

        <ScrollView contentContainerStyle={styles.talhaoContainer}>
        {fazenda && fazenda.talhoes && fazenda.talhoes.length > 0 ? (
          fazenda.talhoes.map(talhao => (
            <TouchableOpacity key={talhao.id} style={styles.talhao} onPress={() => handleTalhao(talhao.id)}>
              <View style={styles.talhaoContent}>
                <View style={styles.talhaoFoto} />

                <View>
                  <Text style={styles.talhaoNome}>{talhao.nomeTalhao}</Text>
                </View>

                <TouchableOpacity style={styles.arrowIcon} onPress={() => handleTalhao(talhao.id)}>
                  <Feather name="arrow-right" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))): <Text>Não há talhões nesta fazenda</Text>
          }
        </ScrollView>

        <TouchableOpacity style={styles.button} onPress={() => handleCadastro()}>
          <Text style={styles.buttonText}>Criar talhão</Text>
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
  titleAgri: {
    fontSize: 14,
    fontWeight: '500',
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
    marginTop: 45,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000'
  },
  input: {
    height: 44,
    fontSize: 15,
    backgroundColor: '#ddd',
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  seeMore: {
    color: '#FF8C00',
    fontSize: 16,
    textAlign: 'right',
    fontWeight: '500',
  },
  talhoes: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  talhao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  talhaoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  talhaoFoto: {
    width: 48,
    height: 48,
    borderRadius: 30,
    backgroundColor: '#8194D8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  arrowIcon: {
    marginLeft: 'auto',
  },
  button: {
    backgroundColor: '#FF8C00',
    borderRadius: 10,
    padding: 12,
    marginTop: 18,
    marginBottom: 18,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },

});
