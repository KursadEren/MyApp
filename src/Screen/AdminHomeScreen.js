import { View, StyleSheet, ScrollView, SafeAreaView, StatusBar, Platform,Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Card from '../Components/Card';
import AdminNavbar from '../Components/AdminNavbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import { Dimensions } from 'react-native';


const { width } = Dimensions.get('window');

export default function AdminHomeScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const currentUser = auth().currentUser;
        if (!currentUser) {
          Alert.alert('Hata', 'Giriş yapmış kullanıcı bulunamadı.');
          return;
        }
        const currentUserId = currentUser.uid;

        // 'users' koleksiyonuna referans alıyoruz
        const usersCollectionRef = firestore().collection('users');

        // Tüm kullanıcıları çekiyoruz
        const usersSnapshot = await usersCollectionRef.get();

        const userList = [];

        usersSnapshot.forEach(doc => {
          if (doc.id !== currentUserId) {
            const userData = doc.data();
            userList.push({
              id: doc.id,
              ...userData,
            });
          }
        });

        setUsers(userList);

        await AsyncStorage.setItem('@userDataList', JSON.stringify(userList));
        console.log('Kullanıcı verileri AsyncStorage\'a kaydedildi');
      } catch (error) {
        console.error('Kullanıcılar alınırken hata oluştu:', error);
        Alert.alert('Hata', 'Kullanıcılar alınırken bir hata oluştu.');
      }
    };

    fetchUsers();
  }, []);
  return (
    <SafeAreaView style={styles.Container}>
      <AdminNavbar navigation={navigation} />
      <ScrollView contentContainerStyle={styles.CardWrapper}>
        <View style={styles.CardContainer}>
          <Card
            title="DashBoard"
            iconName="home-outline"
            navigation={navigation}
            targetScreen="DashBoard"
            cardWidth={(width / 2) - 30}
            cardHeight={150}
          />
          <Card
            title="Users"
            iconName="people-outline"
            navigation={navigation}
            targetScreen="SubsUserScreen"
            cardWidth={(width / 2) - 30}
            cardHeight={150}
          />
        </View>
        <View style={styles.CardContainer}>
          <Card
            title="Settings"
            iconName="settings-outline"
            navigation={navigation}
            targetScreen="Settings"
            cardWidth={(width / 2) - 30}
            cardHeight={150}
          />
          <Card
            title="Reports"
            iconName="document-text-outline"
            navigation={navigation}
            targetScreen="Reports"
            cardWidth={(width / 2) - 30}
            cardHeight={150}
          />
        </View>
        <View style={styles.CardContainer}>
          <Card
            title="Abonelik Planı Düzenle"
            iconName="document-text-outline"
            navigation={navigation}
            targetScreen="SetSubscription"
            cardWidth={(width / 2) - 30}
            cardHeight={150}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  CardWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  CardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
});
