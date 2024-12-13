import React, { useContext, useRef, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView, ImageBackground } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ColorsContext } from "../Context/ColorsContext";
import Icon from "react-native-vector-icons/Feather"
const { width, height } = Dimensions.get("window");

const OnboardingScreen = ({ navigation }) => {
  const scrollRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { colors } = useContext(ColorsContext);

  const data = [
    {
      id: "1",
      title: "Hoş Geldiniz!",
      description: "Bebeklerin gelişimini kolaylaştıran özel bir deneyim sunuyoruz.",
      image: require("../assets/img/Family.png"),
    },
    
   
  ];

  const handleNext = () => {
   
      navigation.replace("login");
    
  };
 

  const renderScreen = (item) => {
    return (
      <View style={styles.screenContainer} key={item.id}>
        {/* Işık Efekti */}
        <LinearGradient
          colors={[
            "rgba(255, 255, 255, 0.5)", // Yarı şeffaf beyaz
            "rgba(255, 255, 255, 0)", // Şeffaf
          ]}
          style={styles.lightEffect}
        />
        <View style={[styles.waveContainer, { color: colors.primary }]}>
          <View style={[styles.wave, { backgroundColor: colors.primary }]}></View>
        </View>
        <View style={styles.imageWrapper}>
          <ImageBackground source={item.image} style={styles.image}>
            <LinearGradient
              colors={["rgba(0, 0, 0, 0.4)", "rgba(0, 0, 0, 0)"]}
              style={styles.gradientOverlay}
            />
          </ImageBackground>
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
      >
        {data.map(renderScreen)}
      </ScrollView>
      <TouchableOpacity style={[styles.button,{backgroundColor:colors.primary}]} onPress={handleNext}>
        <Text style={styles.buttonText}>
          Devam
        </Text>
        <Icon
          name={
            currentIndex === data.length - 1 ? "arrow-right-circle" : "chevron-right"
          }
          size={width * 0.06}
          color="#FFF"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0e0e0",
  },
  screenContainer: {
    width: width,
    height: height,
    alignItems: "center",
    backgroundColor: "#e0e0e0",
  },
  waveContainer: {
    position: "absolute",
    top: 0,
    width: width,
    height: height * 0.8,
    overflow: "hidden",
  },
  wave: {
    position: "absolute",
    width: width * 1.5,
    height: height * 0.75,
    backgroundColor: "#003366",
    borderBottomLeftRadius: width,
    borderBottomRightRadius: width,
    transform: [{ scaleX: 1.5 }],

  },
  lightEffect: {
    position: "absolute",
    top: -70,
    left: -10,
    width: width * 1.5,
    height: height * 0.5,
    transform: [{ rotate: "45deg" }],
    zIndex: 1,
  },
  imageWrapper: {
    width: "80%", // Görüntünün genişliğini ayarlayın
    height: height * 0.4, // Görüntünün yüksekliğini ayarlayın
    marginBottom: 20,
    marginTop: height*0.08,
    overflow: "hidden",
    borderRadius: 20, // Kenarları yuvarlatma
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", // Resmi boyutlandırma
    justifyContent: "center",
    
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginTop: 20,
    zIndex: 2,
  },
  description: {
    fontSize: 16,
    color: "#D3D3D3",
    textAlign: "center",
    marginHorizontal: 30,
    marginTop: 10,
    zIndex: 2,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
    marginRight:width*0.04,
  },
});

export default OnboardingScreen;
