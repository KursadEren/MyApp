import React, { useEffect } from 'react';
import { View, Dimensions, Button, Platform, PermissionsAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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

const { width } = Dimensions.get("window");
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

async function createNotificationChannel() {
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'default',
      name: 'Varsayılan Bildirim Kanalı',
      importance: AndroidImportance.HIGH,
    });
  }
}

async function requestAndroidNotificationPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}

async function requestIOSNotificationPermission() {
  if (Platform.OS === 'ios') {
    const settings = await notifee.requestPermission();
    if (settings.authorizationStatus < 1) {
      console.log('Bildirim izni reddedildi.');
    }
  }
}

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

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: width * 0.15,
          backgroundColor: '#8E2DE2',
          borderTopWidth: 0,
          elevation: 5,
          paddingBottom: 5,
          borderRadius: 15,
          marginHorizontal: 10,
          position: 'absolute',
          bottom: 10,
          left: 10,
          right: 10,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <Ionicons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: '#FFF',
        tabBarInactiveTintColor: '#AAA',
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          textTransform: 'capitalize',
          marginTop: -5,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function App() {
  useEffect(() => {
    async function init() {
      await createNotificationChannel();
      await requestAndroidNotificationPermission();
      await requestIOSNotificationPermission();
    }
    init();
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
                        <Stack.Screen name="MyTabs" component={MyTabs} />
                        <Stack.Screen name="DashBoard" component={DashBoard} />
                        <Stack.Screen name="Payment" component={Payment} />
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

      <View style={{ position: 'absolute', bottom: 50, right: 20 }}>
        <Button title="Bildirim Gönder" onPress={displayNotification} />
      </View>
    </NavigationContainer>
  );
}

export default App;
