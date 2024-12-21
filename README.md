# kullanılan paketler 

"dependencies": {
    "@notifee/react-native": "^9.1.3",
    "@react-native-async-storage/async-storage": "^2.1.0",
    "@react-native-community/cli": "^15.1.2",
    "@react-native-community/datetimepicker": "^8.2.0",
    "@react-native-firebase/app": "^21.6.1",
    "@react-native-firebase/auth": "^21.6.1",
    "@react-native-firebase/firestore": "^21.6.1",
    "@react-native-firebase/messaging": "^21.6.1",
    "@react-native-picker/picker": "^2.10.2",
    "@react-navigation/bottom-tabs": "^7.0.12",
    "@react-navigation/native": "^7.0.7",
    "@react-navigation/native-stack": "^7.1.8",
    "axios": "^1.7.8",
    "moment": "^2.30.1",
    "react": "18.3.1",
    "react-native": "^0.76.5",
    "react-native-calendars": "^1.1286.0",
    "react-native-gesture-handler": "^2.21.2",
    "react-native-get-random-values": "^1.11.0",
    "react-native-linear-gradient": "^2.8.3",
    "react-native-modal-datetime-picker": "^18.0.0",
    "react-native-pdf": "^6.7.5",
    "react-native-reanimated": "^3.16.5",
    "react-native-safe-area-context": "^5.0.0",
    "react-native-screens": "^4.3.0",
    "react-native-svg": "^15.10.1",
    "react-native-uuid": "^2.0.3",
    "react-native-vector-icons": "^10.2.0",
    "react-native-video": "^6.8.2",
    "react-native-webview": "^13.12.4"
},

# ** Bu bilgilendirme Component kısmında başlayıp sırası ile aşağıya doğru iner. Alfabetik olarak bütün dosyaları içeriğini anlatır ** 

<!-- Admin sayfası görseli -->
<img src="Readme/AdminHome.png" alt="Admin sayfası" width="200" height="300" />

## podfile'a notifee için gerekli target eklendi. ios tarafında sadece developer hesabı açılınca bildirim için sertifika eklenecek

### - #Components

#### Admin navbar  
- profile kısmı boş admin için özelleştirecek bir kısım yok isteğe göre kaldırılabilir 
- admin mesajlaşma kısmı şuan aktif olarak çalışıyor kullanıcıların sıralandığı ve en son mesaj atanın gösterildiği kısım mevcut 
- çıkış yap kısmı kullanıcın token'ını unutması için kaydediyoruz ve hızlı giriş yapıyoruz 

#### Card 
- admin kısmında yönlendirmelerin tasarımını içeriyor, sade tutuldu 

#### CustomBackGround

- bu kısım kullanıcının HomeScreen ekranında bulunan bilgilendirme yazısı

<img src="Readme/CustomBackground.png" alt="Bilgilendirme yazısı" width="200" height="300" />
  
#### CustomDropdown 
- bu kısımda flatlist kullanıldı, bizim oluşturduğumuz Component kullanılmadı içerisinde kendi tasarımı mevcut 

<!-- Örnek DropDown (yerel görsel henüz tanımlı değilse alt="" yapabilirsiniz) -->
<img src="Readme/DropDown.png" alt="DropDown" width="200" height="300" />

<!-- Burada external (örnek) bir resim kullanılıyor ise: 
<img src="https://example.com/image.png" alt="Görsel Açıklaması" width="200" height="300" />
-->

#### HomeProfil
- home kısmında bulunan profil, merhaba yazısı ve kullanıcı profil kısmında kullanılan profil iconunu içerir 

#### MyButton 
- uygulama ekranında açılan ilk kısım ve giriş yap / kayıt ol
- aynı zamanda kullanıcı kısmında bulunan SSS & destek ve profil butonlarında bulunur 

#### MyFlatlist

##### FlatlistRenderItem Dizini

- **AdminExerciseItem**: Aslında admin tarafında planları otomatik değiştirmek için kullanılacaktı ama kaldırıldı 
- **CatalogItem**: Bu bilgilendirme yazısından sonra altta kullanılan youtube, bütün planlar ve instagram yönlendirme için yapılan kısmı içerir
- **ExerciseItem**: İsim yanıltmasın, normalde bu kısım Planların olduğu kullanıcı kısmının HomeScreen'inin en altında bulunan Flatlist öğesi ve bütün planları içerir
- **Memnuniyet**: Bu kısım ExerciseItem'ın hemen üstünde bulunan, sadece görselleri sıralamak için
- **VideoItem**: Youtube videolarının gösterileceği kısım. Bu kısımlar özellikle youtube tarafından çekilmedi, linkleri MyFlatlist kısmında tutuluyor, diğer kısımlarda statik olarak tasarlandı 

- #Eklenmesi gereken kısım: premium içerik videolarının olduğu kısım eklenecek. O da FirebaseStorageden çekilebilir.
    
<!-- Planlar.png -->
<img src="Readme/Planlar.png" alt="Planlar" width="200" height="300" />

<!-- CatalogItem.png -->
<img src="Readme/CatalogItem.png" alt="CatalogItem" width="200" height="300" />

<!-- memnuniyet.png -->
<img src="Readme/memnuniyet.png" alt="memnuniyet" width="200" height="300" />

<!-- Motivasyon.png -->
<img src="Readme/Motivasyon.png" alt="Motivasyon" width="200" height="300" />

### MyNavbar
- bu kısım aslında BottomBar olacak ama ismi değiştirilmedi; bu kısımda sırasıyla ayarlar, bildirim, home, mesaj ve profil kısımları bulunmakta

### MyTextInput
- bu kısımlar Register ve Login Kısmında kullanıldı, başka bir yerde kullanılmadı

### SubsCriptionCalender
- Bu kısımda kişinin çocuğunun Atak Haftaları için işlem yapılır ve bu kısım HomeScreen de gösterilir. İçerik olarak:
    - 48. hafta
    - 44. hafta
    - 40-41. haftalar
    - 14-17. haftalar (4. Ay)
    - 36.hafta
    - 8.ay (33-36 haftalar)
    - 29.hafta
    - 26.hafta
    - 11. hafta
    - 7. hafta
    - 4.-5. hafta (ilk farkındalık atağı)
    - Doğum günü kontrolü
    - ve diğer normal günler bulunur. Bu el ile tasarlanmış olup sadece tıklandığı kısmın ne içeriyorsa onun içeriğini gönderir. Bu haftaların başlangıç tarihi kullanıcı profilden çocuğun doğum tarihi bilgilerini giriş yaparsa FireStore'a eklenir ve bu haftalarda bildirim gönderilir (şu an push notifications ayarlanmadı)

<img src="Readme/AtakHaftalari.png" alt="AtakHaftaları" width="200" height="300" />
  
### YoutubeVideo
- bu kısımda VideoItem bileşeninde kullanılır. Aslında VideoItem'a tıklanınca açılan modalda kullanılır.

---

## - #Context

### BackGround context
- Arka planda kullanılan resimleri içerir

### ColorsContext 
- Genel olarak kullanılan renk paketlerini içerir

### FontsContext
- Genelde kullanılan fontları içerir

### PaymentFlag
- Bu kısım kullanıcı ödeme yaptıktan sonra HomeScreende Users Koleksiyonunun tekrar çağrılmasına yarar

### SubsCriptionContext
- Bütün Aylık Paketleri Firebaseden alır ama şu an kaldırıldı, hiçbir yerde kullanılmıyor. Paketler statik olarak eklendi.

### UserContext
- Kullanıcı bilgilerini çekip saklamak için bu kısım HomeScreende ya da login Screende çağrılıyor  

### userToken 
- Bu kısımda HomeScrende çağrılır ve kullanıcı token'ı tutulur.
