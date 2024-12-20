import React, { useEffect, useState ,useContext} from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet,ImageBackground } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { BackgroundContext } from '../Context/BackGround';

const AdminConversationsScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const {Background} = useContext(BackgroundContext);
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

        // Kullanıcı adlarını toplu olarak almak için sorgu yapalım
        const usersData = {};
        const batches = [];

        // Firestore 'in' sorgusu maksimum 10 öğe alabilir, bu yüzden gruplar halinde alıyoruz
        while (userIds.length) {
          const batch = userIds.splice(0, 10);
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

        // Kullanıcı adlarını conversations verileriyle birleştiriyoruz
        const conversationsWithNames = conversationsData.map((conversation) => {
          const userId = conversation.id;
          const userData = usersData[userId] || {};
          return {
            ...conversation,
            userName: userData.username || 'Bilinmeyen Kullanıcı',
          };
        });

        setConversations(conversationsWithNames);
      });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => {
    const userId = item.id; // Sohbet ID'si kullanıcı ID'si
    const lastMessage = item.lastMessage ? item.lastMessage.text : '';
    const userName = item.userName;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('AdminChatScreen', { userId ,userName})}
        style={styles.conversationItem}
      >
        <Text style={styles.conversationUserName}>{userName}</Text>
        <Text style={styles.conversationUserId}>Kullanıcı ID: {userId}</Text>
        <Text style={styles.conversationLastMessage}>{lastMessage}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={Background.Home}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
    <View style={styles.container}>
      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
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
  },
  conversationUserName: {
    fontSize: 18, // Daha büyük font boyutu
    fontWeight: 'bold',
  },
  conversationUserId: {
    fontSize: 14, // Daha küçük font boyutu
    color: '#666',
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
});
