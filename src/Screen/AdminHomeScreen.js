import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  ImageBackground,
} from 'react-native';
import Card from '../Components/Card';
import AdminNavbar from '../Components/AdminNavbar';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Dimensions } from 'react-native';
import { BackgroundContext } from '../Context/BackGround';

const { width } = Dimensions.get('window');

export default function AdminHomeScreen({ navigation }) {
  const [usersWithSubscriptions, setUsersWithSubscriptions] = useState([]);
 const {Background} = useContext(BackgroundContext);
 useEffect(() => {
  const fetchUsers = async () => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        Alert.alert('Hata', 'Giriş yapmış kullanıcı bulunamadı.');
        return;
      }

      const usersCollectionRef = firestore().collection('users');
      const usersSnapshot = await usersCollectionRef.get();

      if (usersSnapshot.empty) {
        Alert.alert('Hata', 'Hiç kullanıcı bulunamadı.');
        return;
      }

      const userList = usersSnapshot.docs
        .map((doc) => {
          const userData = doc.data();
          const userId = doc.id;

          // Admin'i hariç tut
          if (userId === currentUser.uid) {return null;}

          return {
            id: userId,
            ...userData, // Kullanıcı bilgileri ve abonelikler doğrudan burada
          };
        })
        .filter(Boolean); // Geçerli kullanıcıları filtrele

      if (userList.length === 0) {
        Alert.alert('Hata', 'Kullanıcı verisi bulunamadı.');
      } else {
        setUsersWithSubscriptions(userList);
      }
    } catch (error) {
      console.error('Kullanıcılar alınırken hata oluştu:', error);
      Alert.alert('Hata', 'Kullanıcı verileri alınırken bir sorun oluştu.');
    }
  };

  fetchUsers();
}, []);



  return (
    <ImageBackground
      source={Background.Home}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
    <SafeAreaView style={styles.container}>
      <AdminNavbar navigation={navigation} />

      <ScrollView contentContainerStyle={styles.cardWrapper}>
        <View style={styles.cardContainer}>
          <Card
            title="Analiz"
            iconName="home-outline"
            navigation={navigation}
            targetScreen="DashBoard"
            cardWidth={width / 2 - 30}
            cardHeight={150}
          />
          <Card
            title="Kullanıcılar"
            iconName="people-outline"
            navigation={navigation}
            targetScreen="SubsUserScreen"
            cardWidth={width / 2 - 30}
            cardHeight={150}
            onPress={() =>
              navigation.navigate('SubsUserScreen', { users: usersWithSubscriptions })
            }
          />
        </View>

        <View style={styles.cardContainer}>
          <Card
            title="Ayarlar"
            iconName="settings-outline"
            navigation={navigation}
            targetScreen="Settings"
            cardWidth={width / 2 - 30}
            cardHeight={150}
          />
          <Card
            title="Rapor"
            iconName="document-text-outline"
            navigation={navigation}
            targetScreen="Reports"
            cardWidth={width / 2 - 30}
            cardHeight={150}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,

  },
  cardWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});
