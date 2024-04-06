import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../pages/Login';
import Clientes from '../pages/Clientes/clientes';
import Editar from '../pages/Clientes/editar';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function StackRoutes(){
  return(
    <Stack.Navigator>
      <Stack.Screen 
      name="Editar" 
      component={Editar} 
      options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}


function AppRoutes(){
  return(
    <Tab.Navigator>
      <Tab.Screen 
      name="Clientes" 
      component={Clientes} 
      />
    </Tab.Navigator>
  )
}

export default AppRoutes;