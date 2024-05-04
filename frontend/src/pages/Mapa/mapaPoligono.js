import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, PermissionsAndroid } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MapaPoligono() {
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [initialRegion, setInitialRegion] = useState(null);

  useEffect(() => {
    async function requestLocationPermission() {
      try {
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
  }, []);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    if (isDrawing) {
      setPolygonPoints([...polygonPoints, coordinate]);
    }
  };

  const startDrawing = () => {
    setPolygonPoints([]);
    setIsDrawing(true);
  };

  const stopDrawing = async () => {
    console.log("stop");
    setIsDrawing(false);
    if (polygonPoints.length > 0) {
      const serializedPoints = JSON.stringify(polygonPoints);
      await AsyncStorage.setItem('poligno', serializedPoints);
    }
  };

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        onPress={handleMapPress}
        initialRegion={initialRegion}
      >
        {polygonPoints.map((point, index) => (
          <Marker
            key={index}
            coordinate={point}
            title={`Ponto ${index + 1}`}
          />
        ))}
        {polygonPoints.length > 1 && (
          <Polygon
            coordinates={polygonPoints}
            fillColor="rgba(0, 128, 0, 0.5)"
            strokeColor="rgba(0, 128, 0, 0.8)"
            strokeWidth={2}
          />
        )}
      </MapView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={isDrawing ? stopDrawing : startDrawing}>
          <Text style={styles.buttonText}>{isDrawing ? 'Parar' : 'Começar a desenhar'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '78%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
    width: '100%',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});