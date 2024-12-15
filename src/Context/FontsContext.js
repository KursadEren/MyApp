import React, {createContext, useEffect, useState} from 'react';

// Fontların global olarak kullanılacağı Context
export const FontsContext = createContext();

// FontsProvider: Fontları yükleyen ve sağlayan component
export const FontsProvider = ({children}) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Font isimleri
  const fonts = {
    book: 'BlenderPro-Book', // Font ismi dosya adı olmadan
    bold: 'BlenderPro-Bold',
    Heavy: 'BlenderPro-Heavy', // Font ismi dosya adı olmadan
    Medium: 'BlenderPro-Medium',
    thin: 'BlenderPro-Thin',
    baby: 'Hellobaby',
    Winter: "Winter Minie"
  };

  const fontsSize = {
    Bold: 24,
    Text: 20,
  };

  // Fontları yüklüyoruz
  useEffect(() => {
    // React Native CLI'da manuel yükleme gerekmiyor, fontsLoaded'ı true yapalım
    setFontsLoaded(true);
  }, []);

  return (
    <FontsContext.Provider value={{fontsSize, fonts, fontsLoaded}}>
      {children}
    </FontsContext.Provider>
  );
};
