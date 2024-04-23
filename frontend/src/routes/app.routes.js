import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';
import CadastroMsg from '../pages/Cadastro/cadastromsg';

import Clientes from '../pages/Clientes/clientes';
import EditarCliente from '../pages/Clientes/editarCliente';
import EditarClienteEndereco from '../pages/Clientes/editarClienteEndereco';

import AprovarContas from '../pages/Aprovar';
import VerConta from '../pages/Aprovar/verConta';

import Fazendas from '../pages/Fazendas';
import CriarFazenda from '../pages/Fazendas/criarFazenda';
import CriarFazendaCep from '../pages/Fazendas/criarFazendaCep';
import VerFazenda from '../pages/Fazendas/fazenda';
import EditarFazenda from '../pages/Fazendas/editarFazenda';

import VerTalhao from '../pages/Talhoes/talhao';
import EditarTalhao from '../pages/Talhoes/editarTalhao';
import CriarTalhao from '../pages/Talhoes/criarTalhao';

import EditarArmadilha from '../pages/Armadilhas/editarArmadilha';
import CriarArmadilha from '../pages/Armadilhas/criarArmadilha';

import Perfil from '../pages/Perfil';
import EditarPerfil from '../pages/Perfil/editarPerfil';

import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

import firebase from '@react-native-firebase/app';
import axios from 'axios';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabNavigator = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = firebase.auth().currentUser;
        const idToken = await currentUser.getIdToken();
        const usuarioId = currentUser.uid;

        const response = await axios.get(`http://10.0.2.2:3000/usuario/${usuarioId}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });

        setUserData(response.data);
      } catch (error) {
        console.log('Erro ao buscar informações do usuário:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) { return null; }

  return (
    <Tab.Navigator screenOptions={({ route }) => ({ tabBarIcon: ({ color }) => {
          let iconName;

          if (route.name === 'Clientes') {
            if (userData.cliente) { return null; }
            iconName = 'users';
          } else if (route.name === 'Fazendas') {
            iconName = 'layers';
          } else if (route.name === 'Perfil') {
            iconName = 'person-circle-outline';
          }

          if (iconName) {
            if (route.name === 'Perfil') {
              return <Ionicons name={iconName} color={color} size={30} />;
            } else {
              return <Feather name={iconName} color={color} size={30} />;
            }
          }

          return null;
        },
        tabBarActiveTintColor: '#FF8C00',
        tabBarInactiveTintColor: '#000',
        tabBarLabelStyle: { fontSize: 13, paddingBottom: 10, },
        tabBarStyle: { backgroundColor: '#E9EEEB', paddingTop: 10, height: 70, }
      })}
    >
      {!userData.cliente && (
        <Tab.Screen name="Clientes" component={Clientes} options={{ headerShown: false }} />
      )}
      <Tab.Screen name="Fazendas" component={Fazendas} options={{ headerShown: false }} />
      <Tab.Screen name="Perfil" component={Perfil} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default function AppRoutes() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Cadastro" component={Cadastro} options={{ headerShown: false }} />
      <Stack.Screen name="CadastroMsg" component={CadastroMsg} options={{ headerShown: false }} />
      <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />

      <Stack.Screen name="EditarCliente" component={EditarCliente} options={{ headerShown: false }} />
      <Stack.Screen name="EditarClienteEndereco" component={EditarClienteEndereco} options={{ headerShown: false }} />

      <Stack.Screen name="AprovarContas" component={AprovarContas} options={{ headerShown: false }} />
      <Stack.Screen name="VerConta" component={VerConta} options={{ headerShown: false }} />

      <Stack.Screen name="CriarFazenda" component={CriarFazenda} options={{ headerShown: false }} />
      <Stack.Screen name="CriarFazendaCep" component={CriarFazendaCep} options={{ headerShown: false }} />
      <Stack.Screen name="VerFazenda" component={VerFazenda} options={{ headerShown: false }} />
      <Stack.Screen name="EditarFazenda" component={EditarFazenda} options={{ headerShown: false }} />

      <Stack.Screen name="VerTalhao" component={VerTalhao} options={{ headerShown: false }} />
      <Stack.Screen name="EditarTalhao" component={EditarTalhao} options={{ headerShown: false }} />
      <Stack.Screen name="CriarTalhao" component={CriarTalhao} options={{ headerShown: false }} />

      <Stack.Screen name="EditarArmadilha" component={EditarArmadilha} options={{ headerShown: false }} />
      <Stack.Screen name="CriarArmadilha" component={CriarArmadilha} options={{ headerShown: false }} />

      <Stack.Screen name="EditarPerfil" component={EditarPerfil} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}