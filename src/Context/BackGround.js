import React, {createContext, useState, useEffect} from 'react';

// Backgroundların global olarak kullanılacağı Context
export const BackgroundContext = createContext();

// BackgroundProvider: Arka plan görüntüsünü sağlayan component
export const BackgroundProvider = ({children}) => {
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);

  // Görsel kaynakları
  const Background = {
    primary: require('../assets/img/GirisArkaplan.jpg'),
    Home:require('../assets/img/HomeContent/AppBackGround.jpg'),
  };

  // Görüntü yükleme işlemi
  useEffect(() => {
    const loadBackground = async () => {
      try {
        // CLI'da ek bir görüntü yükleme işlemi gerekmese de,
        // async işlemi yaparak setBackgroundLoaded'i true yapabiliriz.
        setBackgroundLoaded(true);
      } catch (error) {
        console.error('Arka plan yüklenirken hata oluştu:', error);
      }
    };

    loadBackground();
  }, []);

  return (
    <BackgroundContext.Provider value={{Background, backgroundLoaded}}>
      {children}
    </BackgroundContext.Provider>
  );
};
