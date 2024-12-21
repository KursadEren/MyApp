import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import messaging from '@react-native-firebase/messaging';

// Context Providers
import { ColorsProvider } from './src/Context/ColorsContext';
import { FontsProvider } from './src/Context/FontsContext';
import { BackgroundProvider } from './src/Context/BackGround';

import { UserProvider } from './src/Context/UserContext';
import { PaymentFlagProvider } from './src/Context/PaymentFlag';
import SubscriptionsProvider from './src/Context/SubsCriptionsContext';
import TokenProvider from './src/Context/UserToken';
import notifee, { AndroidImportance } from '@notifee/react-native';
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
import SleepScheduler from './src/Screen/SleepSchulder';
import Settings from './src/Screen/Settings';
import Destek from './src/Screen/Destek';

const Stack = createNativeStackNavigator();

// Kullanıcıdan bildirim izni isteme fonksiyonu
async function requestUserPermission() {
  if (Platform.OS === 'ios') {
    // iOS için izin isteme
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('iOS Authorization status:', authStatus);
    }
  } else {
    // Android için izin isteme (API 33+)
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
  }
}
async function requestUserPermission() {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('iOS Bildirim izni verildi:', authStatus);
    } else {
      Alert.alert('Bildirim İzni Gerekli', 'Lütfen bildirim izni verin.');
    }
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Bildirim İzni',
          message: 'Bildirim gönderebilmek için izninize ihtiyacımız var.',
          buttonPositive: 'Tamam',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Android Bildirim izni verildi.');
      } else {
        Alert.alert('Bildirim İzni Gerekli', 'Lütfen bildirim izni verin.');
      }
    } catch (err) {
      console.warn(err);
    }
  }
}





function App() {
  useEffect(() => {
    // Bildirim izinlerini iste
    requestUserPermission();


    // Firebase mesaj dinleyicisi (ön planda)
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        'Yeni Bildirim!',
        JSON.stringify(remoteMessage.notification)
      );
    });

    // Firebase arka plan mesaj işleyicisi
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background message:', remoteMessage);
    });

    return unsubscribeOnMessage; // Temizlik işlemi
  }, []);

  return (
    <NavigationContainer>
     
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
                        <Stack.Screen name="Sleep" component={SleepScheduler} />
                        <Stack.Screen name="Settings" component={Settings} />
                        <Stack.Screen name="Destek" component={Destek} />

                      </Stack.Navigator>
                    </SubscriptionsProvider>
                  </ColorsProvider>
                </FontsProvider>
              </BackgroundProvider>
            </TokenProvider>
          </UserProvider>
        </PaymentFlagProvider>
     
    </NavigationContainer>
  );
}

export default App;
