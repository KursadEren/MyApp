import React, { useContext } from "react";
import { View, TextInput, StyleSheet, Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { FontsContext } from "../Context/FontsContext";

const { width, height } = Dimensions.get("window");




const MyTextInput = ({ placeholder, value, onChangeText, secureTextEntry }) => {
  const{fonts } = useContext(FontsContext)
  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
          <TextInput
            style={[styles.input,{ fontFamily:fonts.baby,}]}
            placeholder={placeholder}
            value={value}
            
            onChangeText={onChangeText}
            secureTextEntry={placeholder.toLowerCase().includes("password") ? secureTextEntry : false}
            placeholderTextColor="#B0C4CC"
          />
        </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
   
    backgroundColor: '#e3e3e3',
    borderRadius: 30,
    marginRight: 10,
    height:height*0.07,
    marginVertical:height*0.02
  },
  innerContainer: {
    backgroundColor: "white", 
       
        borderRadius: 100, 
        marginTop: 3,
        marginRight: 2,
        height:height*0.07,
        justifyContent:"center",
   
  },
  innerShadow: {
    flex: 1,
    borderRadius: 25,
    marginTop: height*0.01, // İç gölge için boşluk
    backgroundColor: "#FFFFFF",
    width: width * 0.9,
    marginRight:5,
    marginTop:5,
   
  },
  input: {
    flex: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "transparent",
    color: "#3E3E3E", // Yazı rengi
  
  },
});

export default MyTextInput;
