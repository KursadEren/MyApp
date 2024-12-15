import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ImageBackground,
  TextInput,
  Modal,
  Image
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import 'moment/locale/tr';
import { BackgroundContext } from '../Context/BackGround';

const { width, height } = Dimensions.get('window');

LocaleConfig.locales['tr'] = {
  monthNames: [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
  ],
  monthNamesShort: ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'],
  dayNames: ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'],
  dayNamesShort: ['Paz','Pts','Sal','Çar','Per','Cum','Cts'],
  today: 'Bugün',
};
LocaleConfig.defaultLocale = 'tr';

export default function SubscriptionCalendar() {
  const [children, setChildren] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [childName, setChildName] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const { Background } = useContext(BackgroundContext);

// Bugün'ü belirle
const todayDate = moment().format('YYYY-MM-DD');

// Takvimde gösterilecek başlangıç tarihi (moment nesnesi ile ayarlanmalı)
const [currentDate, setCurrentDate] = useState(moment());



  useEffect(() => {
    const fetchChildren = async () => {
      const currentUser = auth().currentUser;
      const userId = currentUser.uid;
      const userRef = firestore().collection('users').doc(userId);
      const userSnapshot = await userRef.get();
      if (userSnapshot.exists) {
        const userData = userSnapshot.data();
        setChildren(userData.children || []);
      }
    };
    fetchChildren();
  }, []);

  const handleSave = async () => {
    if (!childName || !selectedDate) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    const currentUser = auth().currentUser;
    const userId = currentUser.uid;

    const isDuplicate = children.some(
      (child) => child.name === childName && child.birthDate === selectedDate
    );

    if (isDuplicate) {
      Alert.alert('Hata', 'Bu çocuk zaten eklenmiş.');
      return;
    }

    try {
      const userRef = firestore().collection('users').doc(userId);
      const updatedChildren = [...children, { name: childName, birthDate: selectedDate }];
      await userRef.update({ children: updatedChildren });

      setChildren(updatedChildren);
      setChildName('');
      setSelectedDate(null);
      setCurrentIndex(updatedChildren.length - 1);
      setIsAddingChild(false);
    } catch (error) {
      console.error('Kayıt hatası:', error);
      Alert.alert('Hata', 'Bilgiler kaydedilemedi. Lütfen tekrar deneyin.');
    }
  };

  const currentChild = children[currentIndex] || {};

  // Haftalar için değişkenler
  let markedDates = {};
  let firstAttackStart, firstAttackEnd, seventhWeekStart, eleventhWeekStart,
      fourthMonthStart, fourthMonthEnd, twentyTwoWeekStart, twentyThreeWeekEnd,
      twentySixWeekStart, twentySixWeekEnd,
      twentyNineWeekStart, twentyNineWeekEnd,
      eighthMonthStart, eighthMonthEnd,
      thirtySixWeekStart, thirtySixWeekEnd,
      fortyFortyOneStart, fortyFortyOneEnd,
      fortyFourWeekStart, fortyFourWeekEnd,
      fortyEightWeekStart, fortyEightWeekEnd;

  if (currentChild.birthDate) {
    const birthDate = moment(currentChild.birthDate, 'YYYY-MM-DD');
    const birthDateString = birthDate.format('YYYY-MM-DD');
    // Doğum tarihi (yeşil)
    markedDates[birthDateString] = { selected: true, selectedColor: 'green' };

    const addWeekRange = (startWeek, endWeek, color) => {
      let dp = startWeek.clone();
      while (dp.isSameOrBefore(endWeek)) {
        markedDates[dp.format('YYYY-MM-DD')] = { selected: true, selectedColor: color };
        dp.add(1, 'day');
      }
    };

    // 4.-5. hafta (red)
    firstAttackStart = birthDate.clone().add(4, 'weeks');
    firstAttackEnd = birthDate.clone().add(5, 'weeks');
    addWeekRange(firstAttackStart, firstAttackEnd, 'red');

    // 7. hafta (blue)
    seventhWeekStart = birthDate.clone().add(7, 'weeks');
    const seventhWeekEnd = seventhWeekStart.clone().add(6, 'days');
    addWeekRange(seventhWeekStart, seventhWeekEnd, 'blue');

    // 11. hafta (purple)
    eleventhWeekStart = birthDate.clone().add(11, 'weeks');
    const eleventhWeekEnd = eleventhWeekStart.clone().add(6, 'days');
    addWeekRange(eleventhWeekStart, eleventhWeekEnd, 'purple');

    // 14-17. haftalar (4. ay) (orange)
    fourthMonthStart = birthDate.clone().add(14, 'weeks');
    fourthMonthEnd = birthDate.clone().add(17, 'weeks').add(6, 'days');
    addWeekRange(fourthMonthStart, fourthMonthEnd, 'orange');

    // 22-23. haftalar (grey)
    twentyTwoWeekStart = birthDate.clone().add(22, 'weeks');
    twentyThreeWeekEnd = birthDate.clone().add(23, 'weeks').add(6, 'days');
    addWeekRange(twentyTwoWeekStart, twentyThreeWeekEnd, 'grey');

    // 26. hafta (brown)
    twentySixWeekStart = birthDate.clone().add(26, 'weeks');
    twentySixWeekEnd = twentySixWeekStart.clone().add(6, 'days');
    addWeekRange(twentySixWeekStart, twentySixWeekEnd, 'brown');

    // 29.hafta (pink)
    twentyNineWeekStart = birthDate.clone().add(29, 'weeks');
    twentyNineWeekEnd = twentyNineWeekStart.clone().add(6, 'days');
    addWeekRange(twentyNineWeekStart, twentyNineWeekEnd, 'pink');

    // 8.ay (33-36 haftalar) (yellow)
    eighthMonthStart = birthDate.clone().add(33, 'weeks');
    eighthMonthEnd = birthDate.clone().add(36, 'weeks').add(6, 'days');
    addWeekRange(eighthMonthStart, eighthMonthEnd, 'yellow');

    // 36.hafta (lightblue)
    thirtySixWeekStart = birthDate.clone().add(36, 'weeks');
    thirtySixWeekEnd = thirtySixWeekStart.clone().add(6, 'days');
    addWeekRange(thirtySixWeekStart, thirtySixWeekEnd, 'lightblue');

    // 40-41. haftalar (cornflowerblue)
    fortyFortyOneStart = birthDate.clone().add(40, 'weeks');
    fortyFortyOneEnd = birthDate.clone().add(41, 'weeks').add(6, 'days');
    addWeekRange(fortyFortyOneStart, fortyFortyOneEnd, 'cornflowerblue');

    // 44.hafta (darkgrey)
    fortyFourWeekStart = birthDate.clone().add(44, 'weeks');
    fortyFourWeekEnd = fortyFourWeekStart.clone().add(6, 'days');
    addWeekRange(fortyFourWeekStart, fortyFourWeekEnd, 'darkgrey');

    // 48.hafta (limegreen)
    fortyEightWeekStart = birthDate.clone().add(48, 'weeks');
    fortyEightWeekEnd = fortyEightWeekStart.clone().add(6, 'days');
    addWeekRange(fortyEightWeekStart, fortyEightWeekEnd, 'limegreen');
  }

  // Bugün'ü farklı bir renk ile göster
  // Eğer bugün başka bir haftanın içerisinde ise buradaki ayar onu "override" edebilir
  // Bu nedenle en sonda ekliyoruz
  markedDates[todayDate] = {
    ...markedDates[todayDate],
    selected: true,
    selectedColor: 'indigo', // Bugün için farklı renk
  };

  const handleDayPress = (day) => {
    const dayMoment = moment(day.dateString, 'YYYY-MM-DD');

    // Sıra:
    // 48. hafta
    if (fortyEightWeekStart && fortyEightWeekEnd && dayMoment.isSameOrAfter(fortyEightWeekStart) && dayMoment.isSameOrBefore(fortyEightWeekEnd)) {
      setModalContent(
        '48. Hafta:\n\n' +
        '- tek kademeli emirlere basit sorulara tepki verir\n' +
        '- Sınırları zorlar\n' +
        '- Ağlayarak tepki verir\n' +
        '- Gözünün önünden anne ayrılırsa büyük tepki verir\n' +
        '- Ayrılık kaygısı yaşar\n' +
        '- Uykuya direnir\n' +
        '- gece sık uyanma'
      );
      setModalVisible(true);
      return;
    }

    // 44.hafta
    if (fortyFourWeekStart && fortyFourWeekEnd && dayMoment.isSameOrAfter(fortyFourWeekStart) && dayMoment.isSameOrBefore(fortyFourWeekEnd)) {
      setModalContent('44. Hafta:\n\niçerik eklenecek');
      setModalVisible(true);
      return;
    }

    // 40-41. haftalar
    if (fortyFortyOneStart && fortyFortyOneEnd && dayMoment.isSameOrAfter(fortyFortyOneStart) && dayMoment.isSameOrBefore(fortyFortyOneEnd)) {
      setModalContent('40 - 41. Haftalar:\n\niçerik eklenecek');
      setModalVisible(true);
      return;
    }

    // 22-23. hafta
    if (twentyTwoWeekStart && twentyThreeWeekEnd && dayMoment.isSameOrAfter(twentyTwoWeekStart) && dayMoment.isSameOrBefore(twentyThreeWeekEnd)) {
      setModalContent('22 - 23. Hafta:\n\niçerik eksik');
      setModalVisible(true);
      return;
    }

    // 14-17. haftalar (4. Ay)
    if (fourthMonthStart && fourthMonthEnd && dayMoment.isSameOrAfter(fourthMonthStart) && dayMoment.isSameOrBefore(fourthMonthEnd)) {
      setModalContent('4. AY\n\n- uyku gerilemesi ayı\n- İlgili videoları ücretsiz kısımda bulabilirsiniz');
      setModalVisible(true);
      return;
    }

    // 36.hafta
    if (thirtySixWeekStart && thirtySixWeekEnd && dayMoment.isSameOrAfter(thirtySixWeekStart) && dayMoment.isSameOrBefore(thirtySixWeekEnd)) {
      setModalContent('36. Hafta:\n\n- Ayrılık kaygısı yoğunlaşır\n- Uzun Süreli atak başlangıcı !!\n- Emekler tutunup kalkabilir\n- Kendi kendine yemek yer\n- El çırpabilir\n- Gece uykularından sık sık uyanır');
      setModalVisible(true);
      return;
    }

    // 8.ay (33-36 haftalar)
    if (eighthMonthStart && eighthMonthEnd && dayMoment.isSameOrAfter(eighthMonthStart) && dayMoment.isSameOrBefore(eighthMonthEnd)) {
      setModalContent('8. Ay (33-36 Haftalar):\n\n- Uyku gerilemesi\n- İlgili videolar ücretsiz kısımda mevcut');
      setModalVisible(true);
      return;
    }

    // 29.hafta
    if (twentyNineWeekStart && twentyNineWeekEnd && dayMoment.isSameOrAfter(twentyNineWeekStart) && dayMoment.isSameOrBefore(twentyNineWeekEnd)) {
      setModalContent('29. Hafta:\n\n- Desteksiz Oturur\n- Emeklemeye geçme çabası\n- Hızlı hareket eden nesneyi gözle takip eder\n- Sınırları ve kısıtlamaları zorlama');
      setModalVisible(true);
      return;
    }

    // 26.hafta
    if (twentySixWeekStart && twentySixWeekEnd && dayMoment.isSameOrAfter(twentySixWeekStart) && dayMoment.isSameOrBefore(twentySixWeekEnd)) {
      setModalContent('26. Hafta:\n\n- Oturma kabiliyeti gelişir\n- Oyuncakları ağza götürür\n- Tek heceli ses çıkarır');
      setModalVisible(true);
      return;
    }

    // 11. hafta
    if (eleventhWeekStart && dayMoment.isSameOrAfter(eleventhWeekStart)) {
      setModalContent('11. Hafta:\n\n- Gözlerini ve ellerini koordine kullanır.\n- Elini ağzına sokar.\n- Bacakları esnetip tekme atar.\n- Göz teması kurar.\n- Uzak mesafe görme başlar.');
      setModalVisible(true);
      return;
    }

    // 7. hafta
    if (seventhWeekStart && dayMoment.isSameOrAfter(seventhWeekStart) && (!eleventhWeekStart || dayMoment.isBefore(eleventhWeekStart))) {
      setModalContent('7. Hafta:\n\nİsimlere odaklanabilir,\nKavrama refleksi güçlenir,\nParmaklarının farkına varır.');
      setModalVisible(true);
      return;
    }

    // 4.-5. hafta
    if (firstAttackStart && firstAttackEnd && dayMoment.isSameOrAfter(firstAttackStart) && dayMoment.isSameOrBefore(firstAttackEnd)) {
      setModalContent('İlk Farkındalık Atağı:\n\nUykuya direnme,\nNedensiz ağlama,\nİşitsel uyarılara duyarlılık,\nDaha sık beslenme isteği.');
      setModalVisible(true);
      return;
    }
     // Doğum günü kontrolü
     if (currentChild.birthDate) {
      const birthDate = moment(currentChild.birthDate, 'YYYY-MM-DD');
      if (dayMoment.isSame(birthDate, 'day')) {
        setModalContent(`İyiki Doğdun ${currentChild.name}!`);
        setModalVisible(true);
        return;
      }
    }

    // Normal gün
    setSelectedDate(day.dateString);
    Alert.alert('Bilgi', `${day.dateString} tarihine erişebilirsiniz.`);
  };

  const renderHeader = () => {
    const currentChildData = children[currentIndex] || {};
    return (
      <View style={styles.headerContainer}>
        {currentIndex > 0 && (
          <TouchableOpacity onPress={() => setCurrentIndex(prev => prev - 1)}>
            <Icon name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>
        )}
        <Text style={styles.childName} numberOfLines={1}>
          {isAddingChild ? 'Yeni Çocuk Ekle' : currentChildData.name || 'Çocuk Eklenmedi'}
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (currentIndex < children.length - 1) {
              setCurrentIndex(prev => prev + 1);
            } else {
              setIsAddingChild(true);
            }
          }}
        >
          <Icon name="chevron-forward" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    );
  };

 const goToNextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, 'month'));
  };

  // Ayı geri taşı
  const goToPreviousMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, 'month'));
  };

 

   // Çocuğun adını almak için
   
   const monthAndYear = currentDate.format('MMMM YYYY').toUpperCase();
 
   const generateCalendarDays = () => {
    const startDay = currentDate.clone().startOf('month'); // Ayın ilk günü
    const startOfWeek = startDay.clone().startOf('week'); // Haftanın başı (Pazar)
  
    const endDay = currentDate.clone().endOf('month');
    const endOfWeek = endDay.clone().endOf('week'); // Haftanın sonu
  
    const days = [];
    const day = startOfWeek.clone();
  
    while (day.isBefore(endOfWeek, 'day') || day.isSame(endOfWeek, 'day')) {
      days.push(day.clone());
      day.add(1, 'day');
    }
    return days;
  };
  
 
   const days = generateCalendarDays();
 
   // Hafta isimleri
   const weekDays = ['Pa', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'];


   // çocuk ekleme kısmı 
   const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setBirthDate(selectedDate);
  };

  const addChild = () => {
    if (!childName) {
      Alert.alert('Hata', 'İsim alanı boş olamaz.');
      return;
    }
    const newChild = {
      name: childName,
      birthDate: moment(birthDate).format('YYYY-MM-DD'),
    };

    // Örnek ekleme işlemi
    setChildren([...children, newChild]);
    setModalVisible(false);
    setChildName('');
    setBirthDate(new Date());
  };
 
   return (
     <View style={styles.container}>
       {/* Bulut görünümlü zemin */}
      
       <ImageBackground
      source={require('../assets/img/HomeContent/takvimbackgrond.png')} // Arka plan resmi
      style={styles.cloudContainer}
      resizeMode="cover" // Resmi kapsayacak şekilde ayarla
    >
         {/* Üst başlık - Çocuğun adı ve sağ-sol arrow ikonları */}
         <View style={styles.topHeader}>
           <TouchableOpacity onPress={() => {/* Başka çocuğa geçebilirsiniz */}}>
             <Image source={require('../assets/img/HomeContent/takvimgeri.png')} style={styles.arrowTop} />
           </TouchableOpacity>
           <Text style={styles.childName}>{childName}</Text>
           <TouchableOpacity onPress={() => {/* Başka çocuğa ya da bir sonraki child */}}>
             <Image source={require('../assets/img/HomeContent/takvimileri.png')} style={styles.arrowTop} />
           </TouchableOpacity>
         </View>
 
         {/* Günlerin Başlıkları */}
         <View style={styles.weekHeader}>
           {weekDays.map((day, index) => (
             <Text key={index} style={styles.weekDay}>
               {day}
             </Text>
           ))}
         </View>
 
         {/* Tarihlerin Gösterimi */}
         <View style={styles.daysContainer}>
           {days.map((day, index) => {
             const isCurrentMonth = day.month() === currentDate.month();
             const isToday = day.isSame(moment(), 'day');
             return (
               <View key={index} style={styles.dayWrapper}>
                 <Text
                   style={[
                     styles.dayText,
                     !isCurrentMonth && styles.notCurrentMonth,
                     isToday && styles.today
                   ]}
                 >
                   {day.date()}
                 </Text>
               </View>
             );
           })}
         </View>
 
         {/* Alt başlık - Ay-Yıl bilgisi ve sağ-sol arrow ikonları */}
         <View style={styles.bottomHeader}>
           <TouchableOpacity onPress={goToPreviousMonth}>
             <Image source={require('../assets/img/HomeContent/takvimgeri.png')} style={styles.arrowBottom} />
           </TouchableOpacity>
           <Text style={styles.monthText}>{monthAndYear}</Text>
           <TouchableOpacity onPress={goToNextMonth}>
             <Image source={require('../assets/img/HomeContent/takvimileri.png')} style={styles.arrowBottom} />
           </TouchableOpacity>
         </View>
         </ImageBackground>
      
     </View>
   );
 }
 const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:10,
    alignItems: 'center',
    justifyContent: 'center', 
     // arka plan rengi (isteğe göre değiştirebilirsiniz)
  },
  cloudContainer: {
    width: width * 0.9,
     height:height*0.45,
    borderRadius: 50,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // gölge efekti istiyorsanız:
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 10,
  },
  childName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A00E0',
    textAlign: 'center',
  },
  arrowTop: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  weekHeader: {
    width: '92%',
    flexDirection: 'row',
    justifyContent: 'space-between',
     // Tam genişlik
    marginBottom: 5,
    paddingHorizontal: 10, // Sağ ve sol boşluk
  },
  
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  
  dayWrapper: {
    width: '14.285%', // 100 / 7 = 14.285%
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  
  
  
  dayText: {
    fontSize: 12,
    color: '#4A00E0',
    textAlign: 'center',
  },
  notCurrentMonth: {
    color: '#ccc',
  },
  today: {
    backgroundColor: '#4A00E0',
    color: 'white',
    borderRadius: 15,
    width: 24,
    height: 24,
    textAlign: 'center',
    lineHeight: 24,
    overflow: 'hidden',
  },
  bottomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 10,
  },
  monthText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A00E0',
    textAlign: 'center',
  },
  arrowBottom: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});

