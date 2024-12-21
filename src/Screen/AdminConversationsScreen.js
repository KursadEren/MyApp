import React, { useEffect, useState, useContext } from 'react';
import { View, Text, SectionList, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { BackgroundContext } from '../Context/BackGround';

const AdminConversationsScreen = ({ navigation }) => {
  const [sections, setSections] = useState([]);
  const { Background } = useContext(BackgroundContext);

  // Sabit abonelik gruplarını tanımlama
  const subscriptionGroups = [6, 7, 8, 9, 10, 11, 12];

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('conversations')
      .orderBy('lastMessage.timestamp', 'desc')
      .onSnapshot(async (querySnapshot) => {
        const conversationsData = [];
        const userIds = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const userId = doc.id;
          userIds.push(userId);
          conversationsData.push({
            id: userId,
            ...data,
          });
        });

        // Kullanıcı adlarını ve abonelik bilgilerini toplu olarak almak için sorgu yapalım
        const usersData = {};
        const batches = [];

        // Firestore 'in' sorgusu maksimum 10 öğe alabilir, bu yüzden gruplar halinde alıyoruz
        const userIdsCopy = [...userIds]; // Orijinal diziyi korumak için kopya oluşturuyoruz
        while (userIdsCopy.length) {
          const batch = userIdsCopy.splice(0, 10);
          batches.push(batch);
        }

        await Promise.all(
          batches.map(async (batch) => {
            const usersSnapshot = await firestore()
              .collection('users')
              .where(firestore.FieldPath.documentId(), 'in', batch)
              .get();

            usersSnapshot.forEach((doc) => {
              usersData[doc.id] = doc.data();
            });
          })
        );

        // Kullanıcı abonelik bilgilerini işleyip, aktif abonelikleri buluyoruz
        const conversationsWithSubscription = conversationsData.map((conversation) => {
          const userId = conversation.id;
          const userData = usersData[userId] || {};
          const subscriptions = userData.subscriptions || []; // Düzeltildi

          // Aktif aboneliği bul
          const activeSubscription = subscriptions.find(sub => sub.is_active);

          const subscriptionDuration = activeSubscription ? activeSubscription.subscription_duration : null;
          const userName = userData.username || 'Bilinmeyen Kullanıcı';

          return {
            ...conversation,
            userName,
            subscriptionDuration,
          };
        });

        // Abonelik süresine göre gruplandırma
        const groupedData = {};

        // Sabit abonelik gruplarını başlatma
        subscriptionGroups.forEach(duration => {
          groupedData[duration] = [];
        });

        // Konuşmaları ilgili gruplara atama
        conversationsWithSubscription.forEach(conversation => {
          const duration = conversation.subscriptionDuration;
          if (subscriptionGroups.includes(duration)) {
            groupedData[duration].push(conversation);
          } else {
            // 'Diğer' grubuna ekleme
            if (!groupedData['Diğer']) {
              groupedData['Diğer'] = [];
            }
            groupedData['Diğer'].push(conversation);
          }
        });

        // SectionList için uygun formata dönüştürme
        const sectionsData = subscriptionGroups.map((duration) => ({
          title: `${duration} Aylık Abonelik`,
          data: groupedData[duration],
        }));

        // 'Diğer' grubunu ekleme
        if (groupedData['Diğer'] && groupedData['Diğer'].length > 0) {
          sectionsData.push({
            title: 'Diğer',
            data: groupedData['Diğer'],
          });
        }

        // Debugging için verileri kontrol etme
        console.log('Conversations Data:', conversationsWithSubscription);
        console.log('Grouped Data:', groupedData);
        console.log('Sections Data:', sectionsData);

        setSections(sectionsData);
      });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => {
    const userId = item.id; // Sohbet ID'si kullanıcı ID'si
    const lastMessage = item.lastMessage ? item.lastMessage.text : '';
    const userName = item.userName;
    const subscriptionDuration = item.subscriptionDuration;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('AdminChatScreen', { userId, userName })}
        style={styles.conversationItem}
      >
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationUserName}>{userName}</Text>
          <Text style={styles.subscriptionLabel}>
            {subscriptionDuration ? `${subscriptionDuration} Aylık` : 'Diğer'}
          </Text>
        </View>
        <Text style={styles.conversationUserId}>Kullanıcı ID: {userId}</Text>
        <Text style={styles.conversationLastMessage}>{lastMessage}</Text>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  return (
    <ImageBackground
      source={Background.Home}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <SectionList
          sections={sections}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Hiç konuşma bulunmamaktadır.</Text>
            </View>
          }
        />
      </View>
    </ImageBackground>
  );
};

export default AdminConversationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 10,
  },
  conversationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Mesaj baloncuğu için arka plan
    borderRadius: 10,
    marginVertical: 5,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationUserName: {
    fontSize: 18, // Daha büyük font boyutu
    fontWeight: 'bold',
  },
  subscriptionLabel: {
    fontSize: 14,
    color: '#007BFF',
    fontWeight: '600',
  },
  conversationUserId: {
    fontSize: 14, // Daha küçük font boyutu
    color: '#666',
    marginTop: 5,
  },
  conversationLastMessage: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  sectionHeader: {
    backgroundColor: '#f4f4f4',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
