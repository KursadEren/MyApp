import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TokenContext = createContext();

export default function TokenProvider({children}) {
  const [token, setToken] = useState(0);

  useEffect(() => {
    // Token değiştiğinde AsyncStorage'a kaydet
    const storeToken = async () => {
      if (token) {
        await AsyncStorage.setItem('userToken', JSON.stringify(token));
      } else {
        await AsyncStorage.removeItem('userToken');
      }
    };
    storeToken();
  }, [token,setToken]);

  return (
    <TokenContext.Provider value={{token, setToken}}>
      {children}
    </TokenContext.Provider>
  );
}
