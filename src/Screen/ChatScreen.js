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
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;

    const userId = currentUser.uid;
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
  }, []);

  const sendMessage = async () => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;

    const userId = currentUser.uid;
    const conversationId = userId;

    if (messageText.trim() === '') {
      // Boş mesaj gönderme
      return;
    }

    const messageData = {
      senderId: userId,
      receiverId: 'admin',
      text: messageText.trim(),
      timestamp: firestore.FieldValue.serverTimestamp(),
    };

    try {
      await firestore()
        .collection('conversations')
        .doc(conversationId)
        .collection('messages')
        .add(messageData);

      // Sohbet belgesini güncelle
      await firestore()
        .collection('conversations')
        .doc(conversationId)
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
    const isUserMessage = item.senderId === auth().currentUser.uid;

    return (
      <View
        style={[
          styles.messageContainer,
          isUserMessage ? styles.userMessage : styles.adminMessage,
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      keyboardVerticalOffset={Platform.select({ ios: 60, android: 0 })}
    >
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
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6', // Açık yeşil
  },
  adminMessage: {
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
