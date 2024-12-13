import React, {createContext, useState} from 'react';

// UserContext oluşturun
export const UserContext = createContext();

// Provider bileşeni oluşturun
export const UserProvider = ({children}) => {
  const [user, setUser] = useState(null); // Başlangıçta kullanıcı bilgisi null

  const updateUser = userInfo => {
    setUser(userInfo);
  };

  const clearUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{user, updateUser, clearUser}}>
      {children}
    </UserContext.Provider>
  );
};
