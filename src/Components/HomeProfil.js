import React, { useContext } from 'react';
import { View, Text, Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { UserContext } from '../Context/UserContext';
import { FontsContext } from '../Context/FontsContext';

const { width, height } = Dimensions.get('window');

const HomeProfil = () => {
  const { user } = useContext(UserContext);
  const { fonts } = useContext(FontsContext);

  return (
    <View style={{
      marginHorizontal: width * 0.02,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
    }}>
      {/* Yazı balonu */}
      <View style={{
        flex: 1,
        backgroundColor: '#e3e3e3',
        borderRadius: 30,
        marginRight: 10,
        height: height * 0.07,
      }}>
        <View style={{
          backgroundColor: 'white',
          borderRadius: 100,
          marginTop: 3,
          marginRight: 2,
          height: height * 0.07,
          justifyContent: 'center',
        }}>
          <Text style={{
            fontSize: 18,
            color: '#b791c1',
            textAlign: 'center',
            fontFamily: fonts.baby,
            margin: 10,
            paddingTop: width * 0.02,
          }}>
            Merhaba {user?.username || ''}!
          </Text>
        </View>
      </View>

      <View>
        <FontAwesome name="user-circle" size={70} color="#003366" />
      </View>
    </View>
  );
};

export default HomeProfil;
