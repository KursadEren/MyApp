import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function SubsUserScreen() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [sortBy, setSortBy] = useState('username'); // 'username', 'start_date', 'plan'

  useFocusEffect(
    React.useCallback(() => {
      const fetchStoredUserData = async () => {
        try {
          const storedData = await AsyncStorage.getItem('@userDataList');
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            setSubscriptions(parsedData);
            console.log('User data retrieved from AsyncStorage:', parsedData);
          }
        } catch (error) {
          console.error('Error retrieving data from AsyncStorage:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchStoredUserData();
    }, [])
  );

  const sortData = () => {
    let sortedData = [...subscriptions];

    // Sort logic
    sortedData.sort((a, b) => {
      if (sortBy === 'username') {
        const usernameA = a.username.toLowerCase();
        const usernameB = b.username.toLowerCase();
        if (usernameA < usernameB) return sortOrder === 'asc' ? -1 : 1;
        if (usernameA > usernameB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      }

      if (sortBy === 'start_date') {
        const dateA = new Date(a.subscriptions?.[0]?.subscription_start?.seconds * 1000 || 0);
        const dateB = new Date(b.subscriptions?.[0]?.subscription_start?.seconds * 1000 || 0);
        if (dateA < dateB) return sortOrder === 'asc' ? -1 : 1;
        if (dateA > dateB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      }

      if (sortBy === 'plan') {
        const planA = a.subscriptions?.[0]?.packet_name || 'Free';
        const planB = b.subscriptions?.[0]?.packet_name || 'Free';
        if (planA < planB) return sortOrder === 'asc' ? -1 : 1;
        if (planA > planB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      }

      return 0;
    });

    return sortedData;
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const setSortingCriterion = (criterion) => {
    setSortBy(criterion);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortControls}>
        <TouchableOpacity onPress={toggleSortOrder} style={styles.button}>
          <Text style={styles.buttonText}>
            Sırala: {sortOrder === 'asc' ? 'Artan' : 'Azalan'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortingCriterion('username')} style={styles.button}>
          <Text style={styles.buttonText}>İsme Göre</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortingCriterion('start_date')} style={styles.button}>
          <Text style={styles.buttonText}>Başlangıç Tarihi</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortingCriterion('plan')} style={styles.button}>
          <Text style={styles.buttonText}>Planlara Göre</Text>
        </TouchableOpacity>
      </ScrollView>
      <FlatList
        data={sortData()}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.userHeader}>
              <MaterialIcons name="person" size={24} color="#4B0082" />
              <Text style={styles.userName}>Kullanıcı Adı: {item.username}</Text>
            </View>
            <View style={styles.userHeader}>
              <MaterialIcons name="email" size={24} color="#4B0082" />
              <Text style={styles.userEmail}>{item.email}</Text>
            </View>
            <Text style={styles.userId}>User ID: {item.id}</Text>
            <Text style={styles.subHeader}>Subscriptions:</Text>
            {item.subscriptions && item.subscriptions.length > 0 ? (
              item.subscriptions.map((subscription, index) => {
                const startDate = subscription.subscription_start
                  ? new Date(subscription.subscription_start.seconds * 1000)
                  : null;
                const endDate = subscription.subscription_end
                  ? new Date(subscription.subscription_end.seconds * 1000)
                  : null;

                return (
                  <View key={index} style={styles.subscriptionContainer}>
                    <Text style={styles.subscriptionDetail}>
                      🎁 Paket: {subscription.packet_name}
                    </Text>
                    <Text style={styles.subscriptionDetail}>
                      📅 Başlangıç:{' '}
                      {startDate ? startDate.toLocaleDateString() : 'N/A'}
                    </Text>
                    <Text style={styles.subscriptionDetail}>
                      📅 Bitiş:{' '}
                      {endDate ? endDate.toLocaleDateString() : 'N/A'}
                    </Text>
                    <Text style={styles.subscriptionDetail}>
                      💵 Ödeme: {subscription.amount_paid} TL
                    </Text>
                    <Text style={styles.subscriptionDetail}>
                      Aktif: {subscription.is_active ? '✔️' : '❌'}
                    </Text>
                  </View>
                );
              })
            ) : (
              <Text style={styles.subscriptionDetail}>Free</Text>
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight+30 : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortControls: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 5,
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
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  userEmail: {
    fontSize: 16,
    color: '#777',
    marginLeft: 8,
  },
  userId: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 8,
  },
  subscriptionContainer: {
    backgroundColor: '#EFEFEF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  subscriptionDetail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
});
