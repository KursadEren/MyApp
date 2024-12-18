import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { FontsContext } from '../Context/FontsContext';
import { ColorsContext } from '../Context/ColorsContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { UserContext } from '../Context/UserContext';
import { BackgroundContext } from '../Context/BackGround';

const { width, height } = Dimensions.get('window');

function calculateAgeAndMonths(birthDateString) {
  const birthDate = new Date(birthDateString);
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  // Eğer doğum günü bu yıl henüz gelmediyse yılı ve ayı düzelt
  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    years--;
    months += 12;
  }

  // Ay farkını doğru hesapla
  if (today.getDate() < birthDate.getDate()) {
    months--;
    const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Geçen ayın son günü
    const daysInPreviousMonth = previousMonth.getDate();
    const extraDays = daysInPreviousMonth - birthDate.getDate() + today.getDate();

    if (extraDays > 0) {
      months += 1;
    }
  }

  // Toplam ay sayısını hesapla
  const totalMonths = years * 12 + months;

  return {
    years,
    months,
    totalMonths
  };
}

export default function Settings({navigation}) {
  const { fonts } = useContext(FontsContext);
  const { colors } = useContext(ColorsContext);
  const { user } = useContext(UserContext);
  const { Background } = useContext(BackgroundContext);
  
  const [childName, setChildName] = useState(
    user && user.children && user.children.length > 0 ? user.children[0].name : "isim"
  );
  const [weight, setWeight] = useState(
    user && user.children && user.children.length > 0 ? user.children[0].weight : 0
  );
  const [height2, setHeight] = useState(
    user && user.children && user.children.length > 0 ? user.children[0].height : 0
  );
  
  const [ageData, setAgeData] = useState({ years: 0, months: 0, totalMonths: 0 });
  const [formattedDate, setFormattedDate] = useState("");
  
  // Yaş hesaplama ve çocuk bilgilerini güncelleme
  useEffect(() => {
    if (user && user.children && user.children.length > 0) {
      setChildName(user.children[0].name); // İlk çocuğun ismini alır
      setWeight(user.children[0].weight);
      setHeight(user.children[0].height);
      
      const birthDateString = user.children[0].birthDate; // Doğum tarihinin doğru alan adı olduğundan emin olun
      if (birthDateString) {
        const age = calculateAgeAndMonths(birthDateString);
        setAgeData(age);
        setFormattedDate(`${birthDateString}`); // İsteğe bağlı olarak formatlayabilirsiniz
      }
    } else {
      setChildName("isim");
      setWeight(0);
      setHeight(0);
      setAgeData({ years: 0, months: 0, totalMonths: 0 });
      setFormattedDate("");
    }
  }, [user]);

  const renderButtonWithText = (onPress, imageSource, text) => (
    <View style={styles.buttonWithTextContainer}>
      <Text style={[styles.buttonText, { fontFamily: fonts.Heavy, color: colors.login, fontSize: 22 }]}>{text}</Text>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Image
          source={imageSource}
          style={styles.buttonImage}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground
      source={Background.Home}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Profile Section */}
        <View style={styles.profileContainer}>
          <Ionicons name="person-circle" size={120} color={colors.primary} style={styles.icon} />
          <View style={styles.profileDetails}>
            <ImageBackground
              source={require('../assets/img/memnuniyet/AyarlarBackGround.png')} // Görsel yolu
              style={{
                width: width * 0.6,   // Ekran genişliğinin %60'ı
                height: height * 0.22, // Ekran yüksekliğinin %22'si
                resizeMode: 'contain', // Görselin oranlarını bozmadan boyutlandırır
                flexDirection: "column",
              }}
            >
              <Text style={{ color: colors.login, fontFamily: fonts.Heavy, fontSize: 30, flex: 0.8, marginHorizontal: width * 0.09, marginTop: height * 0.05 }}>
                {childName}
              </Text>
              <Text style={{ color: colors.login, fontFamily: fonts.Heavy, fontSize: 12, marginHorizontal: width * 0.09 }}>
                {childName} {ageData.months} aylık
              </Text>
              <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
                <TouchableOpacity style={styles.infoBox}>
                  <View style={styles.infoInnerBox}>
                    <Text style={{ color: colors.login, fontFamily: fonts.Heavy }}>
                      {height2} cm
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.infoBox}>
                  <View style={styles.infoInnerBox}>
                    <Text style={{ color: colors.login, fontFamily: fonts.Heavy }}>
                      {weight} kg
                    </Text>
                  </View>
                </View>
              </View>
            </ImageBackground>
            <Image
              source={require('../assets/img/memnuniyet/peri2.png')} // Görsel yolu
              style={{
                width: width * 0.14,   // Ekran genişliğinin %14'ü
                height: height * 0.14, // Ekran yüksekliğinin %14'ü
                left: -width * 0.05,
                top: -height * 0.06,
                resizeMode: 'contain',
                position: "absolute",
              }}
            />
          </View>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonContainer}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {renderButtonWithText(() => navigation.navigate("Profile"), require('../assets/img/ok.png'), "Profil")}
            </View>
          </View>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {renderButtonWithText(() =>navigation.navigate("Destek"), require('../assets/img/ok.png'), "SSS & DESTEK")}
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    width: '100%',
  },
  icon: {
    marginRight: 15,
  },
  profileDetails: {
    flexDirection: 'column',
    alignItems: 'center', // Merkezi hizalama ekledim
  },
  buttonContainer: {
    width: width * 0.9,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  modalContainer: {
    marginBottom: height * 0.02,
    alignItems: 'center',
    backgroundColor: '#e3e3e3',
    borderRadius: 100,
  },
  modalContent: {
    backgroundColor: 'white',
    height: height * 0.1,
    width: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    marginRight: 2,
    borderRadius: 100,
  },
  button: {
    justifyContent: "space-evenly",
    alignItems: 'center',
  },
  buttonImage: {
    width: width * 0.1,
    height: height * 0.1,
    resizeMode: 'contain',
  },
  buttonWithTextContainer: {
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: "flex-start",
    width: '100%', // Tam genişlik
    paddingHorizontal: 20, // Yanlardan boşluk
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
    textAlign: "left",
    flex: 0.9
  },
  infoBox: {
    borderWidth: 1,
    borderColor: '#e3e3e3',
    backgroundColor: '#e3e3e3',
    height: height * 0.04,
    width: width * 0.2,
    borderRadius: 30,
    marginTop: 3,
    marginRight: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  infoInnerBox: {
    borderWidth: 1,
    borderColor: '#e3e3e3',
    backgroundColor: 'white',
    height: height * 0.04,
    borderRadius: 30,
    width: width * 0.2,
    marginTop: 1,
    marginRight: 0.5,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  }
});
