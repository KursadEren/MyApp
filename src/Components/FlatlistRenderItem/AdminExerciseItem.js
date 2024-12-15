import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';

const AdminExerciseItem = ({ item, navigation, fonts, styles }) => (
  <View style={styles.cardContainer}>
    {item.subscription_duration === 12 && (
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Bebeğiniz için en iyisi</Text>
        </View>
      </View>
    )}
    <TouchableOpacity
      style={styles.exerciseCard}
      onPress={() => navigation.navigate('Payment', { data: item, navigation })}
    >
      <ImageBackground
        source={require('../../assets/img/5.jpeg')}
        style={styles.backgroundImage}
        resizeMode="cover"
        imageStyle={{ borderTopLeftRadius: 15, borderTopRightRadius: 15 }}
      />
    </TouchableOpacity>
  </View>
);

export default AdminExerciseItem;
