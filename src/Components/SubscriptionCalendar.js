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
  Image,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import 'moment/locale/tr';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { BackgroundContext } from '../Context/BackGround';
import { FontsContext } from '../Context/FontsContext';
import { ColorsContext } from '../Context/ColorsContext';
import { UserContext } from '../Context/UserContext';

const { width, height } = Dimensions.get('window');

LocaleConfig.locales.tr = {
  monthNames: [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
  ],
  monthNamesShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
  dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
  dayNamesShort: ['Paz', 'Pts', 'Sal', 'Çar', 'Per', 'Cum', 'Cts'],
  today: 'Bugün',
};
LocaleConfig.defaultLocale = 'tr';

export default function SubscriptionCalendar() {
  const [children, setChildren] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [childName, setChildName] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // Çocuk ekleme modal
  const [modalContent, setModalContent] = useState('');
  const [infoModalVisible, setInfoModalVisible] = useState(false); // Bilgi modalının görünürlüğü
  const [birthDate, setBirthDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const {user} = useContext(UserContext);
  const { Background } = useContext(BackgroundContext);

  const todayDate = moment().format('YYYY-MM-DD');
  const [currentDate, setCurrentDate] = useState(moment());

  const { fonts } = useContext(FontsContext);
  const { colors } = useContext(ColorsContext);
  useEffect(() => {
    const fetchChildren = async () => {

        setChildren(user.children || []);

    };
    fetchChildren();
  }, []);

  const currentChild = children.length > 0 ? children[currentIndex] : null;

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

  if (currentChild && currentChild.birthDate) {
    const birthDateMoment = moment(currentChild.birthDate, 'YYYY-MM-DD');
    const birthDateString = birthDateMoment.format('YYYY-MM-DD');

    // Doğum tarihi (yeşil)
    markedDates[birthDateString] = { selected: true, selectedColor: 'green' };

    const addWeekRange = (startWeek, endWeek, color) => {
      let dp = startWeek.clone();
      while (dp.isSameOrBefore(endWeek)) {
        markedDates[dp.format('YYYY-MM-DD')] = { selected: true, selectedColor: color };
        dp.add(1, 'day');
      }
    };

    // Haftalık aralıklar
    firstAttackStart = birthDateMoment.clone().add(4, 'weeks');
    firstAttackEnd = birthDateMoment.clone().add(5, 'weeks');
    addWeekRange(firstAttackStart, firstAttackEnd, 'red');

    seventhWeekStart = birthDateMoment.clone().add(7, 'weeks');
    const seventhWeekEnd = seventhWeekStart.clone().add(6, 'days');
    addWeekRange(seventhWeekStart, seventhWeekEnd, 'blue');

    eleventhWeekStart = birthDateMoment.clone().add(11, 'weeks');
    const eleventhWeekEnd = eleventhWeekStart.clone().add(6, 'days');
    addWeekRange(eleventhWeekStart, eleventhWeekEnd, 'purple');

    fourthMonthStart = birthDateMoment.clone().add(14, 'weeks');
    fourthMonthEnd = birthDateMoment.clone().add(17, 'weeks').add(6, 'days');
    addWeekRange(fourthMonthStart, fourthMonthEnd, 'orange');

    twentyTwoWeekStart = birthDateMoment.clone().add(22, 'weeks');
    twentyThreeWeekEnd = birthDateMoment.clone().add(23, 'weeks').add(6, 'days');
    addWeekRange(twentyTwoWeekStart, twentyThreeWeekEnd, 'grey');

    twentySixWeekStart = birthDateMoment.clone().add(26, 'weeks');
    twentySixWeekEnd = twentySixWeekStart.clone().add(6, 'days');
    addWeekRange(twentySixWeekStart, twentySixWeekEnd, 'brown');

    twentyNineWeekStart = birthDateMoment.clone().add(29, 'weeks');
    twentyNineWeekEnd = twentyNineWeekStart.clone().add(6, 'days');
    addWeekRange(twentyNineWeekStart, twentyNineWeekEnd, 'pink');

    eighthMonthStart = birthDateMoment.clone().add(33, 'weeks');
    eighthMonthEnd = birthDateMoment.clone().add(36, 'weeks').add(6, 'days');
    addWeekRange(eighthMonthStart, eighthMonthEnd, 'yellow');

    thirtySixWeekStart = birthDateMoment.clone().add(36, 'weeks');
    thirtySixWeekEnd = thirtySixWeekStart.clone().add(6, 'days');
    addWeekRange(thirtySixWeekStart, thirtySixWeekEnd, 'lightblue');

    fortyFortyOneStart = birthDateMoment.clone().add(40, 'weeks');
    fortyFortyOneEnd = fortyFortyOneStart.clone().add(1, 'weeks').add(6, 'days');
    addWeekRange(fortyFortyOneStart, fortyFortyOneEnd, 'cornflowerblue');

    fortyFourWeekStart = birthDateMoment.clone().add(44, 'weeks');
    fortyFourWeekEnd = fortyFourWeekStart.clone().add(6, 'days');
    addWeekRange(fortyFourWeekStart, fortyFourWeekEnd, 'darkgrey');

    fortyEightWeekStart = birthDateMoment.clone().add(48, 'weeks');
    fortyEightWeekEnd = fortyEightWeekStart.clone().add(6, 'days');
    addWeekRange(fortyEightWeekStart, fortyEightWeekEnd, 'limegreen');
  }

  // Bugün
  markedDates[todayDate] = {
    ...markedDates[todayDate],
    selected: true,
    selectedColor: 'indigo',
  };

  const handleDayPress = (day) => {
    if (!currentChild || !currentChild.birthDate) {
      Alert.alert('Uyarı', 'Lütfen önce bir çocuk ekleyiniz.');
      return;
    }

    const dayMoment = moment(day.dateString, 'YYYY-MM-DD');

    // 48.hafta
    if (fortyEightWeekStart && fortyEightWeekEnd && dayMoment.isBetween(fortyEightWeekStart, fortyEightWeekEnd, null, '[]')) {
      setModalContent(
        '48. Hafta:\n\n' +
        '- Tek kademeli emirlere basit sorulara tepki verir\n' +
        '- Sınırları zorlar\n' +
        '- Ağlayarak tepki verir\n' +
        '- Gözünün önünden anne ayrılırsa büyük tepki verir\n' +
        '- Ayrılık kaygısı yaşar\n' +
        '- Uykuya direnir\n' +
        '- Gece sık uyanma'
      );
      setInfoModalVisible(true);
      return;
    }

    // 44.hafta
    if (fortyFourWeekStart && fortyFourWeekEnd && dayMoment.isBetween(fortyFourWeekStart, fortyFourWeekEnd, null, '[]')) {
      setModalContent('44. hafta:  \n\n- Kategorize Etme: Nesneleri boyut, şekil veya türüne göre gruplar. İnsanları "tanıdık" ve "yabancı" olarak ayırt eder.\n- Neden-Sonuç: Düğmeye basarak oyuncaktan ses çıkmasını bekler.\n- Planlama ve Problem Çözme: Oyuncakları kutuya yerleştirme, üst üste dizme gibi görevlerde başarılıdır. Önceki denemelerini hatırlayıp uygular.');

      setInfoModalVisible(true);
      return;
    }

    // 40-41. haftalar
    if (fortyFortyOneStart && fortyFortyOneEnd && dayMoment.isBetween(fortyFortyOneStart, fortyFortyOneEnd, null, '[]')) {
      setModalContent('40 - 41. Haftalar:\n\n- Kategorize Etme: Nesneleri boyut, şekil veya türüne göre gruplar. İnsanları "tanıdık" ve "yabancı" olarak ayırt eder.\n- Neden-Sonuç: Düğmeye basarak oyuncaktan ses çıkmasını bekler.\n- Planlama ve Problem Çözme: Oyuncakları kutuya yerleştirme, üst üste dizme gibi görevlerde başarılıdır. Önceki denemelerini hatırlayıp uygular.');
      setInfoModalVisible(true);
      return;
    }

    if (twentyTwoWeekStart && twentyThreeWeekEnd && dayMoment.isBetween(twentyTwoWeekStart, twentyThreeWeekEnd, null, '[]')) {
      setModalContent('22 - 23. Hafta:\n\n- Sebep-sonuç: Hareketlerinin sonuçlarını anlamaya başlar. Örneğin, bir nesneyi salladığında ses çıkacağını öğrenir.\n- Keşif: Nesneleri detaylı incelemeye, dokularını ve şekillerini anlamaya çalışır.\n- Duygusal farkındalık: Tanıdık yüzlere mutluluk, yabancılara tedirginlik gösterebilir.\n- El-göz koordinasyonu: Nesnelere uzanma ve küçük objeleri tutma becerisi gelişir.\n- Yuvarlanma ve oturma: Yuvarlanabilir ve destekle oturmaya çalışabilir.\n- Ayak keşfi: Ayaklarıyla oynamaya başlayarak vücut farkındalığı kazanır.');
      setInfoModalVisible(true);
      return;
    }



    // 14-17. haftalar (4. Ay)
    if (fourthMonthStart && fourthMonthEnd && dayMoment.isBetween(fourthMonthStart, fourthMonthEnd, null, '[]')) {
      setModalContent('4. AY\n\n- Uyku gerilemesi ayı\n- İlgili videoları ücretsiz kısımda bulabilirsiniz');
      setInfoModalVisible(true);
      return;
    }

    // 36.hafta
    if (thirtySixWeekStart && thirtySixWeekEnd && dayMoment.isBetween(thirtySixWeekStart, thirtySixWeekEnd, null, '[]')) {
      setModalContent('36. Hafta:\n\n- Ayrılık kaygısı yoğunlaşır\n- Uzun Süreli atak başlangıcı !!\n- Emekler tutunup kalkabilir\n- Kendi kendine yemek yer\n- El çırpabilir\n- Gece uykularından sık sık uyanır');
      setInfoModalVisible(true);
      return;
    }

    // 8.ay (33-36 haftalar)
    if (eighthMonthStart && eighthMonthEnd && dayMoment.isBetween(eighthMonthStart, eighthMonthEnd, null, '[]')) {
      setModalContent('8. Ay (33-36 Haftalar):\n\n- Uyku gerilemesi\n- İlgili videolar ücretsiz kısımda mevcut');
      setInfoModalVisible(true);
      return;
    }

    // 29.hafta
    if (twentyNineWeekStart && twentyNineWeekEnd && dayMoment.isBetween(twentyNineWeekStart, twentyNineWeekEnd, null, '[]')) {
      setModalContent('29. Hafta:\n\n- Desteksiz Oturur\n- Emeklemeye geçme çabası\n- Hızlı hareket eden nesneyi gözle takip eder\n- Sınırları ve kısıtlamaları zorlama');
      setInfoModalVisible(true);
      return;
    }

    // 26.hafta
    if (twentySixWeekStart && twentySixWeekEnd && dayMoment.isBetween(twentySixWeekStart, twentySixWeekEnd, null, '[]')) {
      setModalContent('26. Hafta:\n\n- Oturma kabiliyeti gelişir\n- Oyuncakları ağza götürür\n- Tek heceli ses çıkarır');
      setInfoModalVisible(true);
      return;
    }

    // 11. hafta
    if (eleventhWeekStart && dayMoment.isSameOrAfter(eleventhWeekStart) && (!fourthMonthStart || dayMoment.isBefore(fourthMonthStart))) {
      setModalContent('11. Hafta:\n\n- Gözlerini ve ellerini koordine kullanır\n- Elini ağzına sokar\n- Bacakları esnetip tekme atar\n- Göz teması kurar\n- Uzak mesafe görme başlar');
      setInfoModalVisible(true);
      return;
    }

    // 7. hafta
    if (seventhWeekStart && dayMoment.isSameOrAfter(seventhWeekStart) && (!eleventhWeekStart || dayMoment.isBefore(eleventhWeekStart))) {
      setModalContent('7. Hafta:\n\n- İsimlere odaklanabilir\n- Kavrama refleksi güçlenir\n- Parmaklarının farkına varır');
      setInfoModalVisible(true);
      return;
    }

    // 4.-5. hafta (ilk farkındalık atağı)
    if (firstAttackStart && firstAttackEnd && dayMoment.isBetween(firstAttackStart, firstAttackEnd, null, '[]')) {
      setModalContent('İlk Farkındalık Atağı:\n\n- Uykuya direnme\n- Nedensiz ağlama\n- İşitsel uyarılara duyarlılık\n- Daha sık beslenme isteği');
      setInfoModalVisible(true);
      return;
    }

    // Doğum günü kontrolü
    if (currentChild && currentChild.birthDate) {
      const birthDateMoment = moment(currentChild.birthDate, 'YYYY-MM-DD');
      if (dayMoment.isSame(birthDateMoment, 'day')) {
        setModalContent(`İyiki Doğdun ${currentChild.name}!`);
        setInfoModalVisible(true);
        return;
      }
    }

    // Normal gün
    setSelectedDate(day.dateString);
    Alert.alert('Bilgi', `${day.dateString} tarihine erişebilirsiniz.`);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setBirthDate(date);
    hideDatePicker();
  };

  const addChild = async () => {
    if (!childName) {
      Alert.alert('Hata', 'İsim alanı boş olamaz.');
      return;
    }
    if (!birthDate) {
      Alert.alert('Hata', 'Lütfen doğum tarihi seçin.');
      return;
    }

    const formattedBirthDate = moment(birthDate).format('YYYY-MM-DD');

    const isDuplicate = children.some(
      (child) => child.name === childName && child.birthDate === formattedBirthDate
    );
    if (isDuplicate) {
      Alert.alert('Hata', 'Bu çocuk zaten eklenmiş.');
      return;
    }

    const newChild = {
      name: childName.trim(),
      birthDate: formattedBirthDate,
    };

    const currentUser = auth().currentUser;
    const userId = currentUser?.uid;

    try {
      const userRef = firestore().collection('users').doc(userId);
      const updatedChildren = [...children, newChild];
      await userRef.update({ children: updatedChildren });
      setChildren(updatedChildren);
      setModalVisible(false);
      setChildName('');
      setBirthDate(new Date());
      setCurrentIndex(updatedChildren.length - 1);
      Alert.alert('Başarılı', 'Çocuk eklendi ve bilgiler kaydedildi.');
    } catch (error) {
      Alert.alert('Hata', 'Çocuk eklenirken bir sorun oluştu.');
      console.error(error);
    }
  };

  const daysInMonth = () => {
    const startDay = currentDate.clone().startOf('month').startOf('week');
    const endDay = currentDate.clone().endOf('month').endOf('week');
    const days = [];
    const day = startDay.clone();
    while (day.isBefore(endDay, 'day') || day.isSame(endDay, 'day')) {
      days.push(day.clone());
      day.add(1, 'day');
    }
    return days;
  };

  const generateCalendarDays = () => {
    const startDay = currentDate.clone().startOf('month');
    const startOfWeek = startDay.clone().startOf('week');
    const endDay = currentDate.clone().endOf('month').endOf('week');

    const days = [];
    const day = startOfWeek.clone();

    while (day.isBefore(endDay, 'day') || day.isSame(endDay, 'day')) {
      days.push(day.clone());
      day.add(1, 'day');
    }
    return days;
  };

  const days = generateCalendarDays();
  const weekDays = ['Pa', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'];

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/img/HomeContent/takvimbackgrond.png')}
        style={styles.cloudContainer}
        resizeMode="cover"
      >
        {/* Üst Header */}
        <View style={styles.topHeader}>

          <Text style={[styles.childName,{color:colors.login}]}>
            {currentChild ? currentChild.name : 'Çocuk Eklenmedi'}
          </Text>

        </View>

        {children.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Henüz çocuk eklenmedi.</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.addButtonText}>Çocuk Ekle</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.weekHeader}>
              {weekDays.map((day, index) => (
                <Text key={index} style={styles.weekDay}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.daysContainer}>
              {days.map((day, index) => {
                const isCurrentMonth = day.month() === currentDate.month();
                const isToday = day.isSame(moment(), 'day');
                const dateStr = day.format('YYYY-MM-DD');
                const dayStyle = markedDates[dateStr]
                  ? { backgroundColor: markedDates[dateStr].selectedColor, color: '#fff', borderRadius: 12, width: 24, height: 24, textAlign: 'center' }
                  : (isToday ? styles.today : (isCurrentMonth ? {} : styles.notCurrentMonth));

                return (
                  <TouchableOpacity key={index} style={styles.dayWrapper} onPress={() => handleDayPress({ dateString: dateStr })}>
                    <Text style={[styles.dayText, dayStyle]}>
                      {day.date()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        <View style={styles.bottomHeader}>
          <TouchableOpacity onPress={() => setCurrentDate(currentDate.clone().subtract(1, 'month'))}>
            <Image source={require('../assets/img/HomeContent/takvimgeri.png')} style={styles.arrowBottom} />
          </TouchableOpacity>
          <Text style={[styles.monthText,{color:colors.login}]}>{currentDate.format('MMMM YYYY').toUpperCase()}</Text>
          <TouchableOpacity onPress={() => setCurrentDate(currentDate.clone().add(1, 'month'))}>
            <Image source={require('../assets/img/HomeContent/takvimileri.png')} style={styles.arrowBottom} />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Modal - Yeni Çocuk Ekle */}

      {/* Bilgi Modalı (Gün üzerine tıklanınca açılan) */}
      <Modal style={{
        flex: 1,
        backgroundColor: '#FFFFFF',

        backgroundColor: '#e3e3e3',
      }} visible={infoModalVisible} transparent animationType="fade" onRequestClose={() => setInfoModalVisible(false)}>
        {modalContent ? (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={{ backgroundColor: 'white', height: height * 0.4, borderTopRightRadius:30,borderBottomLeftRadius:30, marginTop: 5, marginRight: 3, alignItems: 'center', justifyContent: 'space-evenly' }}>
                <Text style={{ marginVertical: 10, fontSize: 16, textAlign: 'left', fontFamily: fonts.bold, color: colors.login }}>{modalContent}</Text>
                <TouchableOpacity style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 30,
                  backgroundColor: '#e3e3e3',
                  height: height * 0.07,
                  width: width * 0.3,
                }} onPress={() => { setModalContent(''); setInfoModalVisible(false); }}>
                  <View style={{ borderWidth: 1, borderColor: '#e3e3e3', backgroundColor: 'white', height: height * 0.07, borderRadius:30, marginTop: 3, marginRight: 1, alignItems: 'center', justifyContent: 'space-evenly' }}>
                    <Text style={[styles.cancelText,{fontFamily:fonts.baby,color:colors.login}]}>Kapat</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cloudContainer: {
    width: width * 0.9,
    height: height * 0.45,
    borderRadius: 50,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // gölge efekti:
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  topHeader: { flexDirection: 'row', justifyContent: 'center', width: '80%', marginBottom: 20 },
  childName: { fontSize: 18, fontWeight: '600'  },
  arrowTop: { width: 20, height: 20, resizeMode: 'contain' },
  arrowBottom: { width: 20, height: 20, resizeMode: 'contain' },
  weekHeader: { flexDirection: 'row', justifyContent: 'space-between', width: '90%' },
  weekDay: { fontSize: 14, fontWeight: 'bold', color: '#4a2053' },
  daysContainer: { flexDirection: 'row', flexWrap: 'wrap', width: '100%', justifyContent: 'space-between' },
  dayWrapper: { width: '14.285%', alignItems: 'center', marginVertical: 5 },
  dayText: { fontSize: 14, color: '#a77ea2' },
  notCurrentMonth: { color: '#ccc' },
  today: { backgroundColor: '#4A00E0', color: '#fff', borderRadius: 12, width: 24, height: 24, textAlign: 'center' },
  bottomHeader: { flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginTop: 10 },
  monthText: { fontSize: 16, fontWeight: 'bold', color: '#4A00E0' },
  emptyContainer: { alignItems: 'center', marginTop: 20 },
  emptyText: { fontSize: 16, color: '#4A00E0', marginBottom: 10 },
  addButton: { backgroundColor: '#4A00E0', padding: 10, borderRadius: 5 },
  addButtonText: { color: '#fff', fontSize: 16 },
  modalContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)',



  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopRightRadius:30,borderBottomLeftRadius:30,
    backgroundColor: '#e3e3e3',
    height: height * 0.406,
    width: width * 0.8,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#4A00E0', textAlign: 'center', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 },
  datePickerButton: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 5, alignItems: 'center' },
  datePickerText: { fontSize: 16 },
  saveButton: { backgroundColor: '#4A00E0', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#fff', fontSize: 16 },
  cancelText: { color: '#4A00E0', textAlign: 'center', marginTop: 10, fontSize:20},
});
