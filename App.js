import React, {useEffect} from 'react';
import {View, ActivityIndicator, Dimensions} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/Screen/HomeScreen';
import {ColorsProvider} from './src/Context/ColorsContext';
import LoginScreen from './src/Screen/LoginScreen';
import RegisterScreen from './src/Screen/RegisterScreen';
import {FontsProvider} from './src/Context/FontsContext';
import {BackgroundProvider} from './src/Context/BackGround';
import ProfileScreen from './src/Screen/ProfileScreen';
import SubscriptionsProvider from './src/Context/SubsCriptionsContext'; // `SubscriptionsContext` dosyasını doğru yoldan içe aktarın
import TokenProvider from './src/Context/UserToken';
import Payment from './src/Screen/Payment';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TransactionProvider} from './src/Context/TransactionContext';
import {UserProvider} from './src/Context/UserContext';
import {PaymentFlagProvider} from './src/Context/PaymentFlag';
import AdminHomeScreen from './src/Screen/AdminHomeScreen';
import SubsUserScreen from './src/Screen/SubsUserScreen';
import DashBoard from './src/Screen/DashBoard';
import SetSubscription from './src/Screen/SetSubscription';
import PackageDetails from './src/Screen/PackageDetails';
import SpinWheel from './src/Components/SpinWhell';

import { LinearGradient } from 'expo-linear-gradient';
import ForgotPasswordScreen from './src/Screen/ForgotPasswordScreen';
import ChatScreen from './src/Screen/ChatScreen';
import AdminConversationsScreen from './src/Screen/AdminConversationsScreen';
import AdminChatScreen from './src/Screen/AdminChatScreen';
import SeeGoogle from './src/google/GoogleDriveFiles';
import SpinWheelWithGifts from './src/Components/SpinWhell';
import OnboardingScreen from './src/Screen/OnboardingScreen';
import OnboardingScreen2 from './src/Screen/OnboardingScreen2';
const {width,height} = Dimensions.get("window")
const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: width * 0.15,
          backgroundColor: '#8E2DE2', // Tab barın daha koyu bir renk alması için
          borderTopWidth: 0,
          elevation: 5,
          paddingBottom: 5, // İkonlar için ekstra boşluk
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
          } else if (route.name === 'profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          // Aktif sekmeye vurgu
          return (
            <View
              style={{
                
                padding: focused ? 0 : 0,
                borderRadius: focused ? 20 : 0,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: '#FFF', // Aktif sekme rengi beyaz
        tabBarInactiveTintColor: '#AAA', // İnaktif sekme rengi gri
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          textTransform: 'capitalize',
          marginTop: -5, // İkon ve yazı arasındaki boşluğu azaltır
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function App() {


  
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
                        screenOptions={{headerShown: false}}
                        initialRouteName="onBoard">
                       
                       <Stack.Screen name="login" component={LoginScreen} />
                      
                        <Stack.Screen name="register" component={RegisterScreen} />
                        <Stack.Screen name="SetSubscription" component={SetSubscription} />
                        <Stack.Screen name="MyTabs" component={MyTabs} />
                        <Stack.Screen name="DashBoard" component={DashBoard} />
                        <Stack.Screen name="Payment" component={Payment} />
                        <Stack.Screen name="Admin" component={AdminHomeScreen} />
                        <Stack.Screen name="SubsUserScreen" component={SubsUserScreen} />
                        <Stack.Screen name="packagedetails" component={PackageDetails} />
                        <Tab.Screen name="profile" component={ProfileScreen} />
                        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                        <Stack.Screen name="ChatScreen" component={ChatScreen} />
                        <Stack.Screen name="AdminConversationsScreen" component={AdminConversationsScreen} />
                        <Stack.Screen name="AdminChatScreen" component={AdminChatScreen} />
                        <Stack.Screen name="SeeGoogle" component={SeeGoogle} />
                        <Stack.Screen name="Spin" component={SpinWheelWithGifts} />
                        <Stack.Screen name="onBoard" component={OnboardingScreen} />
                        <Stack.Screen name="onBoard2" component={OnboardingScreen2} />
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
