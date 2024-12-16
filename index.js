import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Arka plan mesaj işleyicisi
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Arka planda mesaj:', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
