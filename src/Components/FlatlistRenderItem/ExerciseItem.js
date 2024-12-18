import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Dimensions, Image, Alert } from 'react-native';
import { ColorsContext } from '../../Context/ColorsContext';
import { UserContext } from '../../Context/UserContext';

const { width, height } = Dimensions.get("window");

const ExerciseItem = ({ item, navigation, fonts, styles }) => {
  const localImages = {
    '5.png': require('../../assets/img/Planlar/5.png'),
    '6.png': require('../../assets/img/Planlar/6.png'),
    '7.png': require('../../assets/img/Planlar/7.png'),
    '9.png': require('../../assets/img/Planlar/9.png'),
    '8.png': require('../../assets/img/Planlar/8.png'),
    '10.png': require('../../assets/img/Planlar/10.png'),
    '11.png': require('../../assets/img/Planlar/11.png'),
    '12.png': require('../../assets/img/Planlar/12.png'),
  };

  const { colors } = useContext(ColorsContext);
  const {user} = useContext(UserContext)
  const imageSource =
    typeof item.image === 'string' && item.image.startsWith('http')
      ? { uri: item.image }
      : localImages[item.image];

  const IMAGE_RATIO = 3 / 2;

  const splitTitle = item.title.split(' ');
  const firstPart = splitTitle.slice(0, 2).join(' ');
  const secondPart = splitTitle.slice(2).join(' ');

  const handleData = () => {
    if (!user.subscriptions || user.subscriptions.length === 0) {
      console.log("Abonelik bulunamadı, ödeme ekranına yönlendirme");
      navigation.navigate('Payment', { data: item });
      return;
    }
  
    // Aktif abonelik kontrolü
    const hasActiveSubscription = user.subscriptions.some(sub => sub.is_active === true);
  
    if (hasActiveSubscription) {
      console.log("Aktif abonelik bulundu");
      Alert.alert('başarısız', 'aboneliğiniz mevcut');
    } else {
      console.log("Aktif abonelik bulunamadı, ödeme ekranına yönlendirme");
      navigation.navigate('Payment', { data: item });
    }
  };
  
  
   
  

  return (
    <View style={{ borderRadius: 15, overflow: 'hidden' }}>
      <ImageBackground
        source={imageSource}
        style={{
          width: width * 0.9,
          height: height * 0.5 / IMAGE_RATIO,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius:30
        }}
        resizeMode="contain"
      >
        {/* Sol alt köşe */}
        <TouchableOpacity  onPress={() => handleData()} 
            style={{ position: 'absolute',
            bottom:0,
            left: width*0.04,
            width: width * 0.2,
            height: width * 0.2,
            resizeMode: 'contain',}}>
        <Image
          source={require("../../assets/img/HomeContent/play.png")}
          style={{
            position: 'absolute',
            bottom:0,
            left: 0,
            width: width * 0.2,
            height: width * 0.2,
            resizeMode: 'contain',
          }}
        />
        </TouchableOpacity>
        {/* Sağ alt köşe */}
        
      </ImageBackground>

      <View style={{ alignItems: 'center', margin: width * 0.05 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            fontFamily: fonts.Heavy,
            marginBottom: height * 0.01,
            color: "#502051",
          }}
        >
          {firstPart}
        </Text>
        <Text
          style={{
            fontSize: 24,
            fontWeight: '600',
            fontFamily: fonts.Heavy,
            color: "#502051",
          }}
        >
          {secondPart}
        </Text>
      </View>
    </View>
  );
};

export default ExerciseItem;
