import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function Cadastro() {
  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senha2, setSenha2] = useState('');

  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUF] = useState('');
  const [complemento, setComplemento] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [page, setPage] = useState(1);
  const [imageSize, setImageSize] = useState(150);
  const [inputFocused, setInputFocused] = useState(false);

  const handleInputFocus = () => { setImageSize(0); setInputFocused(true); }

  const handleInputBlur = () => { setImageSize(150); setInputFocused(false); }

  useEffect(() => { return () => { setInputFocused(false); }; }, []);

  const handlePage = () => {
    if (nome === '' || email === '' || senha === '' || senha2 === '') return;
    setPage(2);
  };

  const fetchAddressByCEP = async (cep) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const { logradouro, bairro, localidade, uf } = response.data;
      setLogradouro(logradouro);
      setBairro(bairro);
      setCidade(localidade);
      setUF(uf);
    } catch (error) {
      // Alert.alert(
      //   "Erro", "Não foi possível ao buscar endereço pelo CEP",
      //   [{ text: "Cancelar", style: "cancel" }]
      // );
      console.log('Erro ao buscar endereço pelo CEP:', error);
    }
  };

  const handleCadastro = async () => {
    if (telefone === '' || cep === '' || logradouro === '' || numero === '' ||
      bairro === '' || cidade === '' || uf === '' || complemento === '') return;

    try {
      console.log('try')
      const response = await axios.post(`http://10.0.2.2:3000/usuario/cadastro`, {
        nome: nome, email: email, senha: senha, confirmarSenha: senha2,
        telefone: telefone,
        endereco: {
          cep: cep, logradouro: logradouro, numero: numero,
          cidade: cidade, uf: uf,
          bairro: bairro, complemento: complemento
        }
      });

      navigation.navigate('CadastroMsg');

    } catch (error) {
      console.log('Erro ao cadastrar usuário:', error);
    }

  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={inputFocused ? styles.firstHalfFocused : styles.firstHalf}>
        {(page === 1 || page === 2) && (
          <Image source={require('./logo.png')}
            style={[ styles.imagem, {
                height: inputFocused ? 0 : (page === 1 ? 330 : 200),
                width: inputFocused ? 0 : (page === 1 ? 330 : 200),
              },
            ]}
          />
        )}
      </View>

      {page === 1 && (
        <View style={[styles.secondHalf, { flex: 4 }]}>
          <Text style={styles.title}>Cadastro</Text>

          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input} placeholder="Seu nome" value={nome} onChangeText={setNome}
            onFocus={handleInputFocus} onBlur={handleInputBlur} />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu email" value={email} onChangeText={setEmail}
            keyboardType="email-address" autoCapitalize="none" autoCompleteType="email"
            onFocus={handleInputFocus} onBlur={handleInputBlur} />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input} placeholder="Sua senha" value={senha} onChangeText={setSenha}
            secureTextEntry onFocus={handleInputFocus} onBlur={handleInputBlur} />

          <Text style={styles.label}>Confirmar senha</Text>
          <TextInput
            style={styles.input} placeholder="Confirmar sua senha" value={senha2}
            onChangeText={setSenha2}
            secureTextEntry onFocus={handleInputFocus} onBlur={handleInputBlur} />

          <TouchableOpacity style={styles.button} onPress={handlePage}>
            <Text style={styles.buttonText}>Próximo</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogin}>
            <View style={styles.divCadastrar}>
              <Text style={styles.cadastrar}>Já possui uma conta? </Text>
              <Text style={styles.cadastrarColorido}>Entrar</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {page === 2 && (
        <View style={[styles.secondHalf, { flex: 10 }]}>
          <Text style={styles.label}>Telefone</Text>
          <TextInput style={styles.input} placeholder="Seu telefone"
            value={telefone} onChangeText={(text) => setTelefone(text)} />

          <Text style={styles.label}>CEP</Text>
          <TextInput style={styles.input} placeholder="00000-000"
            value={cep} onChangeText={(text) => setCep(text)} onBlur={() => fetchAddressByCEP(cep)} />

          <Text style={styles.label}>Logradouro</Text>
          <TextInput style={styles.input} placeholder="Logradouro"
            value={logradouro} onChangeText={(text) => setLogradouro(text)} />

          <Text style={styles.label}>Número</Text>
          <TextInput style={styles.input} placeholder="0000"
            value={numero} onChangeText={(text) => setNumero(text)} />

          <Text style={styles.label}>Bairro</Text>
          <TextInput style={styles.input} placeholder="Bairro"
            value={bairro} onChangeText={(text) => setBairro(text)} />

          <View style={styles.cidadeEUF}>
            <View>
              <Text style={styles.label}>Cidade</Text>
              <TextInput style={styles.inputCidade} placeholder="Cidade"
                value={cidade} onChangeText={(text) => setCidade(text)} />
            </View>

            <View>
              <Text style={styles.label}>UF</Text>
              <TextInput style={styles.inputUF} placeholder="UF"
                value={uf} onChangeText={(text) => setUF(text)} />
            </View>
          </View>

          <Text style={styles.label}>Complemento</Text>
          <TextInput style={styles.input} placeholder="Complemento"
            value={complemento} onChangeText={(text) => setComplemento(text)} />


          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleCadastro}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogin}>
            <View style={styles.divCadastrar}>
              <Text style={styles.cadastrar}>Já possui uma conta? </Text>
              <Text style={styles.cadastrarColorido}>Entrar</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF8C00',
  },
  firstHalf: {
    flex: 2,
    zIndex: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  firstHalfFocused: {
    flex: 0,
    zIndex: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    resizeMode: 'contain',
  },
  secondHalf: {
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