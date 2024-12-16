import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function SubsUserScreen({ route, navigation }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('username');

  // Veriyi alıp kontrol ediyoruz
  useEffect(() => {
    const users = route?.params?.users || [];
    if (users.length === 0) {
      Alert.alert('Hata', 'Kullanıcı verisi bulunamadı!');
      navigation.goBack(); // Önceki sayfaya yönlendir
    } else {
      setSubscriptions(users);
    }
  }, [route?.params?.users]);

  const sortData = () => {
    let sortedData = [...subscriptions];

    sortedData.sort((a, b) => {
      if (sortBy === 'username') {
        const usernameA = a.username.toLowerCase();
        const usernameB = b.username.toLowerCase();
        return sortOrder === 'asc'
          ? usernameA.localeCompare(usernameB)
          : usernameB.localeCompare(usernameA);
      }

      if (sortBy === 'start_date') {
        const dateA = new Date(a.subscriptions?.[0]?.subscription_start?.seconds * 1000 || 0);
        const dateB = new Date(b.subscriptions?.[0]?.subscription_start?.seconds * 1000 || 0);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }

      if (sortBy === 'plan') {
        const planA = a.subscriptions?.[0]?.packet_name || 'Free';
        const planB = b.subscriptions?.[0]?.packet_name || 'Free';
        return sortOrder === 'asc' ? planA.localeCompare(planB) : planB.localeCompare(planA);
      }

      return 0;
    });

    return sortedData;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortControls}>
        <TouchableOpacity onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} style={styles.button}>
          <Text style={styles.buttonText}>Sırala: {sortOrder === 'asc' ? 'Artan' : 'Azalan'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortBy('username')} style={styles.button}>
          <Text style={styles.buttonText}>İsme Göre</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortBy('start_date')} style={styles.button}>
          <Text style={styles.buttonText}>Başlangıç Tarihi</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortBy('plan')} style={styles.button}>
          <Text style={styles.buttonText}>Planlara Göre</Text>
        </TouchableOpacity>
      </ScrollView>
      <FlatList
        data={sortData()}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.userHeader}>
              <MaterialIcons name="person" size={24} color="#4B0082" />
              <Text style={styles.userName}>Kullanıcı Adı: {item.username}</Text>
            </View>
            <Text style={styles.userEmail}>E-posta: {item.email}</Text>
            <Text style={styles.subHeader}>Abonelikler:</Text>
            {item.subscriptions && item.subscriptions.length > 0 ? (
              item.subscriptions.map((subscription, index) => {
                const startDate = subscription.subscription_start
                  ? new Date(subscription.subscription_start.seconds * 1000).toLocaleDateString()
                  : 'N/A';
                const endDate = subscription.subscription_end
                  ? new Date(subscription.subscription_end.seconds * 1000).toLocaleDateString()
                  : 'N/A';

                return (
                  <View key={index} style={styles.subscriptionContainer}>
                    <Text style={styles.subscriptionDetail}>🎁 Paket: {subscription.packet_name}</Text>
                    <Text style={styles.subscriptionDetail}>📅 Başlangıç: {startDate}</Text>
                    <Text style={styles.subscriptionDetail}>📅 Bitiş: {endDate}</Text>
                    <Text style={styles.subscriptionDetail}>💵 Fiyat: {subscription.amount_paid} TL</Text>
                  </View>
                );
              })
            ) : (
              <Text style={styles.subscriptionDetail}>Abonelik Yok</Text>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 30 : 0,
  },
  sortControls: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4B0082',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFF',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  userEmail: {
    fontSize: 14,
    color: '#777',
  },
  subHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  subscriptionContainer: {
    marginTop: 5,
    padding: 5,
    backgroundColor: '#EFEFEF',
    borderRadius: 5,
  },
  subscriptionDetail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
});
