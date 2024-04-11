import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Login from '../pages/Login';

import Clientes from '../pages/Clientes/clientes';
import EditarCliente from '../pages/Clientes/editarCliente';
import EditarClienteEndereco from '../pages/Clientes/editarClienteEndereco';

import AprovarContas from '../pages/Aprovar';
import VerConta from '../pages/Aprovar/verConta';

import Fazendas from '../pages/Fazendas';
import CriarFazenda from '../pages/Fazendas/criarFazenda';
import CriarFazendaCep from '../pages/Fazendas/criarFazendaCep';

import Perfil from '../pages/Perfil';
import EditarPerfil from '../pages/Perfil/editarPerfil';

import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;

          if (route.name === 'Clientes') {
            iconName = 'users';
          } else if (route.name === 'Fazendas') {
            iconName = 'layers';
          } else if (route.name === 'Perfil') {
            iconName = 'person-circle-outline';
            return <Ionicons name={iconName} color={color} size={30} />;
          }

          return <Feather name={iconName} color={color} size={30} />;
        },
        tabBarActiveTintColor: '#FF8C00', tabBarInactiveTintColor: '#000',
        tabBarLabelStyle: { fontSize: 13 }, tabBarStyle: { backgroundColor: '#E9EEEB' }
      })}
    >
      <Tab.Screen name="Clientes" component={Clientes} options={{ headerShown: false }} />
      <Tab.Screen name="Fazendas" component={Fazendas} options={{ headerShown: false }} />
      <Tab.Screen name="Perfil" component={Perfil} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default function AppRoutes() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />

      <Stack.Screen name="EditarCliente" component={EditarCliente} options={{ headerShown: false }} />
      <Stack.Screen name="EditarClienteEndereco" component={EditarClienteEndereco} options={{ headerShown: false }} />

      <Stack.Screen name="AprovarContas" component={AprovarContas} options={{ headerShown: false }} />
      <Stack.Screen name="VerConta" component={VerConta} options={{ headerShown: false }} />

      
      <Stack.Screen name="CriarFazenda" component={CriarFazenda} options={{ headerShown: false }} />
      <Stack.Screen name="CriarFazendaCep" component={CriarFazendaCep} options={{ headerShown: false }} />
      
      <Stack.Screen name="EditarPerfil" component={EditarPerfil} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}