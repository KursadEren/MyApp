import React, { useEffect } from 'react';
import { View, Dimensions, Button, Platform, PermissionsAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import notifee, { AndroidImportance } from '@notifee/react-native';

// Context Providers
import { ColorsProvider } from './src/Context/ColorsContext';
import { FontsProvider } from './src/Context/FontsContext';
import { BackgroundProvider } from './src/Context/BackGround';
import { TransactionProvider } from './src/Context/TransactionContext';
import { UserProvider } from './src/Context/UserContext';
import { PaymentFlagProvider } from './src/Context/PaymentFlag';
import SubscriptionsProvider from './src/Context/SubsCriptionsContext';
import TokenProvider from './src/Context/UserToken';

// Screens
import HomeScreen from './src/Screen/HomeScreen';
import LoginScreen from './src/Screen/LoginScreen';
import RegisterScreen from './src/Screen/RegisterScreen';
import ProfileScreen from './src/Screen/ProfileScreen';
import Payment from './src/Screen/Payment';
import AdminHomeScreen from './src/Screen/AdminHomeScreen';
import SubsUserScreen from './src/Screen/SubsUserScreen';
import DashBoard from './src/Screen/DashBoard';
import SetSubscription from './src/Screen/SetSubscription';
import PackageDetails from './src/Screen/PackageDetails';
import ForgotPasswordScreen from './src/Screen/ForgotPasswordScreen';
import ChatScreen from './src/Screen/ChatScreen';
import AdminConversationsScreen from './src/Screen/AdminConversationsScreen';
import AdminChatScreen from './src/Screen/AdminChatScreen';
import OnboardingScreen from './src/Screen/OnboardingScreen';
import Payment2 from './src/Screen/Payment2';

const { width } = Dimensions.get("window");
const Stack = createNativeStackNavigator();
import '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

// iOS için izin isteme
async function requestUserPermission() {
  const authStatus = await messaging().requestPermission({
    provisional: true,
  });
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
  if (enabled) {
    console.log('Bildirim izni verildi:', authStatus);
  } else {
    console.log('Bildirim izni reddedildi');
  }
}

// Notifee için Android kanalını oluşturma
async function createNotificationChannel() {
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'default',
      name: 'Varsayılan Bildirim Kanalı',
      importance: AndroidImportance.HIGH,
    });
  }
}

// Android 13+ için bildirim izni isteme
async function requestAndroidNotificationPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}

// iOS için bildirim izni isteme
async function requestIOSNotificationPermission() {
  if (Platform.OS === 'ios') {
    const settings = await notifee.requestPermission();
    if (settings.authorizationStatus < 1) {
      console.log('Bildirim izni reddedildi.');
    }
  }
}

// Bildirim gösterme örneği (isteğe bağlı)
async function displayNotification() {
  await notifee.displayNotification({
    title: 'Merhaba 👋',
    body: 'Bu bir test bildirimidir!',
    android: {
      channelId: 'default',
      smallIcon: 'ic_launcher', // Küçük simge (Android'de gerekli)
      pressAction: {
        id: 'default',
      },
    },
    ios: {
      sound: 'default', // iOS için varsayılan ses
    },
  });
}

function App() {
  useEffect(() => {
    async function init() {
      await createNotificationChannel();
      await requestAndroidNotificationPermission();
      await requestIOSNotificationPermission();
      await requestUserPermission();
    }
    init();
  }, []);

  useEffect(() => {
    // Cihaz token'ını alma
    messaging().getToken().then(token => {
      console.log('FCM Token:', token);
      // Bu token'ı sunucunuza gönderebilirsiniz.
    });

    // Token yenilenirse
    const unsubscribe = messaging().onTokenRefresh(token => {
      console.log('Token yenilendi:', token);
      // Sunucuda güncelleyin
    });

    // Ön planda mesaj dinleme
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('Ön planda gelen mesaj:', remoteMessage);
      // Notifee ile bildirim gösterme
      await notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        android: {
          channelId: 'default',
        },
        ios: {
          sound: 'default',
        },
      });
    });

    return () => {
      unsubscribe();
      unsubscribeOnMessage();
    };
  }, []);

  return (
    <NavigationContainer>
      <TransactionProvider>
        <PaymentFlagProvider>
          <UserProvider>
            <TokenProvider>
              <BackgroundProvider>
                <FontsProvider>
                  <ColorsProvider>
                    <SubscriptionsProvider>
                      <Stack.Navigator
                        screenOptions={{ headerShown: false }}
                        initialRouteName="onBoard"
                      >
                        <Stack.Screen name="onBoard" component={OnboardingScreen} />
                        <Stack.Screen name="login" component={LoginScreen} />
                        <Stack.Screen name="register" component={RegisterScreen} />
                        <Stack.Screen name="SetSubscription" component={SetSubscription} />
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Profile" component={ProfileScreen} />
                        <Stack.Screen name="DashBoard" component={DashBoard} />
                        <Stack.Screen name="Payment" component={Payment} />
                        <Stack.Screen name="Payment2" component={Payment2} />
                        <Stack.Screen name="Admin" component={AdminHomeScreen} />
                        <Stack.Screen name="SubsUserScreen" component={SubsUserScreen} />
                        <Stack.Screen name="packagedetails" component={PackageDetails} />
                        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                        <Stack.Screen name="ChatScreen" component={ChatScreen} />
                        <Stack.Screen name="AdminConversationsScreen" component={AdminConversationsScreen} />
                        <Stack.Screen name="AdminChatScreen" component={AdminChatScreen} />
                      </Stack.Navigator>
                    </SubscriptionsProvider>
                  </ColorsProvider>
                </FontsProvider>
              </BackgroundProvider>
            </TokenProvider>
          </UserProvider>
        </PaymentFlagProvider>
      </TransactionProvider>
    </NavigationContainer>
  );
}

export default App;
