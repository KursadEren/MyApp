import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import Wheel from './Wheel';

const App = () => {
  const [rotation, setRotation] = useState(new Animated.Value(0));
  const [slices] = useState([
    '100 Puan',
    'Boş',
    '50 Puan',
    'Kaybet',
    '200 Puan',
    'Tekrar Çevir',
  ]);
  const [colors] = useState([
    '#FF6347',
    '#FFD700',
    '#ADFF2F',
    '#1E90FF',
    '#FF69B4',
    '#8A2BE2',
  ]);
  const [selectedSlice, setSelectedSlice] = useState(null);
  const radius = 150;

  const spin = () => {
    const minTurns = 3; // Minimum tam tur sayısı
    const maxTurns = 6; // Maksimum tam tur sayısı
    const randomRotation =
      Math.floor(Math.random() * 360) + 360 * (Math.floor(Math.random() * (maxTurns - minTurns + 1)) + minTurns); // 5-10 tam tur + rastgele açı
    const finalAngle = randomRotation % 360; // Çark durduğundaki açı
    const sliceIndex = Math.floor((360 - finalAngle) / (360 / slices.length)) % slices.length;

    Animated.timing(rotation, {
      toValue: randomRotation,
      duration: 4000, // Çarkın daha uzun dönmesi için süreyi artırdık
      easing: Easing.out(Easing.quad), // Dönüşte yavaşlama efekti
      useNativeDriver: true,
    }).start(() => {
      setSelectedSlice(slices[sliceIndex]);
      Alert.alert('Sonuç', `Çark ${slices[sliceIndex]} diliminde durdu!`);
      rotation.setValue(finalAngle); // Çarkın açı değerini sıfırla
    });
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Çark Çevirme Oyunu</Text>
      <View style={{ position: 'relative', marginBottom: 30 }}>
        {/* Çark */}
        <Animated.View
          style={{
            transform: [{ rotate: rotateInterpolate }],
          }}
        >
          <Wheel slices={slices} colors={colors} radius={radius} />
        </Animated.View>
        {/* Ok */}
        <View style={styles.pointer}>
          <View style={styles.pointerTip} />
        </View>
      </View>
      <Button title="Çarkı Çevir" onPress={spin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pointer: {
    position: 'absolute',
    top: -20,
    left: '38%',
    transform: [{ translateX: -10 }],
    width: 0,
    height: 0,
    zIndex: 10,
  },
  pointerTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 15, // Okun genişliği
    borderRightWidth: 15, // Okun genişliği
    borderBottomWidth: 30, // Okun yüksekliği
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'green', // Okun rengi
    transform: [{ rotate: '180deg' }],
  },
});

export default App;
