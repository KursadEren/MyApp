import React from 'react';
import { TouchableOpacity, View, Image, Text, Linking, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const CatalogItem = ({ item, fonts, navigation, styles }) => {
  const handlePress = () => {
    if (item.url) {
      Linking.openURL(item.url).catch((err) => console.error('URL açılırken hata oluştu:', err));
    } else if (item.navigateTo) {
      navigation.navigate(item.navigateTo);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.catalogCardContainer,
        {
          width: width * 0.35, 
          alignItems: 'center',
          marginHorizontal: width*0.03, 
          marginRight: width*0.07,
          marginVertical: width*0.04
        }
      ]}
      onPress={handlePress}
    >
      <View
        style={{
          width: width*0.4,
          aspectRatio: 1,
          backgroundColor: '#F8D8E7',
          borderTopRightRadius:20,
          borderBottomLeftRadius:20,
          position: 'relative',
          overflow: 'hidden',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}
      >
        
        <Image 
          source={item.iconImage} 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: width * 0.1,
            height: width * 0.1,
            resizeMode: 'contain',
          }}
        />
      </View>

      {item.title ? (
        <Text 
          style={[
            styles.catalogTitle, 
            { 
              fontFamily: fonts.Bold,
              fontSize: 13,
              color: '#4A4A4A',
              textAlign: 'center',
              marginTop: 10,
              maxWidth: '90%',
            }
          ]}
          // numberOfLines özelliğini kaldırdık
        >
          {item.title}
        </Text>
      ) : null}

      {item.description ? (
        <Text 
          style={[
            styles.catalogDescription, 
            {
              fontFamily: fonts.Regular,
              fontSize: 10,
              color: '#777',
              textAlign: 'center',
              lineHeight: 30,
              marginTop: 6,
              maxWidth: '90%'
            }
          ]}
          // numberOfLines özelliğini kaldırdık
        >
          {item.description}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

export default CatalogItem;
