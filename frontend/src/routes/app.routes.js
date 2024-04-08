import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from '../pages/Login';
import Clientes from '../pages/Clientes/clientes';
import EditarCliente from '../pages/Clientes/editarCliente';
import Feather from 'react-native-vector-icons/Feather'
import EditarClienteEndereco from '../pages/Clientes/editarClienteEndereco';
import Fazendas from '../pages/Fazendas/verFazendas'
import Perfil from '../pages/Perfil'

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Clientes" component={Clientes} 
      options={{ headerShown: false, tabBarIcon: ({ color, size }) => {
          return <Feather name="users" color={'#000'} size={30} />
      }}} />
      <Tab.Screen name="Fazendas" component={Fazendas} 
      options={{ headerShown: false, tabBarIcon: ({ color, size }) => {
          return <Feather name="users" color={'#000'} size={30} />
      }}} />
      <Tab.Screen name="Perfil" component={Perfil} 
      options={{ headerShown: false, tabBarIcon: ({ color, size }) => {
          return <Feather name="users" color={'#000'} size={30} />
      }}} />
    </Tab.Navigator>
  );
};

export default function AppRoutes() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="EditarCliente" component={EditarCliente} options={{ headerShown: false }} />
      <Stack.Screen name="EditarClienteEndereco" component={EditarClienteEndereco} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}