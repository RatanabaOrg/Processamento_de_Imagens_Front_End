import React, { useState, useEffect } from 'react';
import { StyleSheet, View, PermissionsAndroid } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MapaArmadilhaEditar() {
  const [markerCoordinate, setMarkerCoordinate] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);

  useEffect(() => {
    async function requestLocationPermission() {
      try {

        let coordenadasObjeto = null;

        while (coordenadasObjeto === null) {
          const coordenadas = await AsyncStorage.getItem('poligno');
          console.log(coordenadas)
          coordenadasObjeto = JSON.parse(coordenadas);
      
          if (coordenadasObjeto !== null) {
            // console.log(coordenadas);
            setMarkerCoordinate(coordenadasObjeto);
          } else {
            await new Promise(resolve => setTimeout(resolve, 100)); 
          }
        }

        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permissão de Localização',
            message: 'Este aplicativo precisa de acesso à sua localização para funcionar corretamente.',
            buttonNeutral: 'Pergunte-me depois',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setInitialRegion({
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              });
            },
            (error) => console.error(error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
          );
        } else {
          console.log('Permissão de localização negada');
        }
      } catch (err) {
        console.warn(err);
      }
    }

    requestLocationPermission();
  }, [markerCoordinate]);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setMarkerCoordinate(coordinate)
    stopDrawing(coordinate)
  };

  const stopDrawing = (coordinate) => {
    const serializedPoints = JSON.stringify(coordinate);
    // console.log(coordinate);
    AsyncStorage.setItem('poligno', serializedPoints);
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        onPress={handleMapPress}
        initialRegion={initialRegion}
        showsUserLocation={true}
      >
        {markerCoordinate && (
          <Marker
            coordinate={markerCoordinate}
            title={'Meu Ponto'}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '90%',
  },
});
