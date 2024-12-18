import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, SafeAreaView, StatusBar, Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';

export default function DashBoard() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateReport = async () => {
      try {
        const usersCollectionRef = firestore().collection('users');
        const usersSnapshot = await usersCollectionRef.get();

        if (usersSnapshot.empty) {
          console.error('Hiç kullanıcı bulunamadı.');
          setLoading(false);
          return;
        }

        const users = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        let totalSubscriptions = 0;
        let freeUsersCount = 0;
        let usersWithMultipleSubscriptions = 0;
        const packageCounts = {};
        const uniqueUsersWithSubscriptions = new Set();

        users.forEach((user) => {
          const { subscriptions } = user;

          if (subscriptions && subscriptions.length > 0) {
            totalSubscriptions += subscriptions.length;
            uniqueUsersWithSubscriptions.add(user.id);

            subscriptions.forEach((subscription) => {
              const packageName = subscription.packet_name;
              packageCounts[packageName] = (packageCounts[packageName] || 0) + 1;
            });

            if (subscriptions.length > 1) {
              usersWithMultipleSubscriptions += 1;
            }
          } else {
            freeUsersCount += 1;
          }
        });

        const reportData = {
          totalSubscriptions,
          freeUsersCount,
          usersWithMultipleSubscriptions,
          uniqueUsersWithSubscriptionsCount: uniqueUsersWithSubscriptions.size,
          packageCounts,
        };

        setReport(reportData);
      } catch (error) {
        console.error('Rapor oluşturulurken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    generateReport();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B0082" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>📊 Abonelik Raporu</Text>
        {report && (
          <>
            <View style={styles.card}>
              <MaterialIcons name="subscriptions" size={24} color="#4B0082" />
              <Text style={styles.reportItem}>Toplam Abonelik: {report.totalSubscriptions}</Text>
            </View>
            <View style={styles.card}>
              <MaterialIcons name="person-outline" size={24} color="#4B0082" />
              <Text style={styles.reportItem}>Farklı Paket Alan Kullanıcı Sayısı: {report.uniqueUsersWithSubscriptionsCount}</Text>
            </View>
            <View style={styles.card}>
              <MaterialIcons name="person-off" size={24} color="#4B0082" />
              <Text style={styles.reportItem}>Ücretsiz Kullanıcı Sayısı: {report.freeUsersCount}</Text>
            </View>
            <View style={styles.card}>
              <MaterialIcons name="group" size={24} color="#4B0082" />
              <Text style={styles.reportItem}>Birden Fazla Abonelik Alan Kullanıcı Sayısı: {report.usersWithMultipleSubscriptions}</Text>
            </View>
            <Text style={styles.subtitle}>📦 Paketlere Göre Kullanıcı Sayıları:</Text>
            {Object.entries(report.packageCounts).map(([packageName, count]) => (
              <View key={packageName} style={styles.packageItem}>
                <MaterialIcons name="package" size={20} color="#555" />
                <Text style={styles.packageText}>
                  {packageName}: {count} kullanıcı
                </Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F8FA',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  reportItem: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B0082',
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  packageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
  },
  packageText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
  },
});
