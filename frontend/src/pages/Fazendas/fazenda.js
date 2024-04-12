import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

export default function VerFazenda() {
  const navigation = useNavigation();
  const route = useRoute();
  const [fazenda, setFazenda] = useState(null);
  const [filteredTalhoes, setFilteredTalhoes] = useState([]);

  const [nome, setNome] = useState('');
  const [coordenadas, setCoordenadas] = useState('');

  const fazendas = [
    { id: 1, nome: 'Fazenda Norte', agricultor: 'Luciana Silva' },
    { id: 2, nome: 'Fazenda Sul', agricultor: 'Fabi Souza' },
  ];

  const talhoes = [
    { id: 1, nome: 'Laranja', tipoPlantacao: 'Laranja' },
    { id: 2, nome: 'Limão', tipoPlantacao: 'Limão' },
    { id: 3, nome: 'Laranja', tipoPlantacao: 'Laranja' },
    { id: 4, nome: 'Limão', tipoPlantacao: 'Limão' },
    { id: 5, nome: 'Laranja', tipoPlantacao: 'Laranja' },
  ];

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
    const { fazendaId } = route.params;
    const fazendaEncontrada = fazendas.find(fazenda => fazenda.id === fazendaId);
    setFazenda(fazendaEncontrada);
    
    setFilteredTalhoes(talhoes);
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
                  <Text style={styles.title}>{fazenda.nome}</Text>
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
          <TextInput style={styles.input} placeholder="Nome" onChangeText={(text) => setNome(text)} />

          <Text style={styles.label}>Coordenadas da sede</Text>
          <TextInput style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="[[Latitude, Longitude],[Latitude, Longitude]]"
            multiline={true} onChangeText={(text) => setCoordenadas(text)} />

          <View>
            <TouchableOpacity activeOpacity={0.7} onPress={() => handleSeeMore(fazenda.id)}>
              <Text style={styles.seeMore}>Ver mais</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.talhoes}>Talhões</Text>

        <ScrollView contentContainerStyle={styles.talhaoContainer}>
          {filteredTalhoes.map(talhoes => (
            <TouchableOpacity key={talhoes.id} style={styles.talhao} onPress={() => handleTalhao(talhoes.id)}>
              <View style={styles.talhaoContent}>
                <View style={styles.talhaoFoto} />

                <View>
                  <Text style={styles.talhaoNome}>{talhoes.nome}</Text>
                </View>

                <TouchableOpacity style={styles.arrowIcon} onPress={() => handleTalhao(talhoes.id)}>
                  <Feather name="arrow-right" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
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
