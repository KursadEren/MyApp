import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const AdminChatScreen = ({ route }) => {
  const { userId,userName } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    const conversationId = userId;

    const unsubscribe = firestore()
      .collection('conversations')
      .doc(conversationId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot((querySnapshot) => {
        const messagesData = [];
        querySnapshot.forEach((doc) => {
          messagesData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setMessages(messagesData);
      });

    return () => unsubscribe();
  }, [userId]);

  const sendMessage = async () => {
    if (messageText.trim() === '') {
      // Boş mesaj gönderme
      return;
    }

    const messageData = {
      senderId: 'admin',
      receiverId: userId,
      text: messageText.trim(),
      timestamp: firestore.FieldValue.serverTimestamp(),
    };

    try {
      await firestore()
        .collection('conversations')
        .doc(userId)
        .collection('messages')
        .add(messageData);

      // Sohbet belgesini güncelle
      await firestore()
        .collection('conversations')
        .doc(userId)
        .set(
          {
            participants: [userId, 'admin'],
            lastMessage: messageData,
          },
          { merge: true }
        );

      // Mesaj alanını temizle
      setMessageText('');
    } catch (error) {
      console.error('Mesaj gönderilirken hata oluştu:', error);
    }
  };

  const renderItem = ({ item }) => {
    const isAdminMessage = item.senderId === 'admin';

    return (
      <View
        style={[
          styles.messageContainer,
          isAdminMessage ? styles.adminMessage : styles.userMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTimestamp}>
          {item.timestamp
            ? new Date(item.timestamp.toDate()).toLocaleTimeString()
            : ''}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flexGrow:1}}>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      keyboardVerticalOffset={Platform.select({ ios: 60, android: 0 })}
    >
      <Text style={styles.chatTitle}> {userName}</Text>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Mesajınızı yazın..."
          value={messageText}
          onChangeText={setMessageText}
          style={styles.textInput}
        />
        <Button title="Gönder" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AdminChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    backgroundColor: '#EEE',
  },
  messagesList: {
    padding: 10,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 8,
    maxWidth: '80%',
  },
  adminMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6', // Açık yeşil
  },
  userMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF', // Beyaz
  },
  messageText: {
    fontSize: 16,
  },
  messageTimestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 5,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 5,
    borderTopWidth: 1,
    borderColor: '#CCC',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    padding: 10,
  },
});
