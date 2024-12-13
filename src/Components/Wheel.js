import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';

const Wheel = ({ slices, colors, radius }) => {
  const createSlices = () => {
    const anglePerSlice = 360 / slices.length; // Her dilim için açı
    return slices.map((slice, index) => {
      const startAngle = index * anglePerSlice;
      const endAngle = startAngle + anglePerSlice;

      // Dönüş açısını hesapla
      const x1 = radius + radius * Math.sin((startAngle * Math.PI) / 180);
      const y1 = radius - radius * Math.cos((startAngle * Math.PI) / 180);
      const x2 = radius + radius * Math.sin((endAngle * Math.PI) / 180);
      const y2 = radius - radius * Math.cos((endAngle * Math.PI) / 180);

      const largeArcFlag = anglePerSlice > 180 ? 1 : 0;

      return (
        <G key={index}>
          {/* Dilim */}
          <Path
            d={`M${radius},${radius} L${x1},${y1} A${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`}
            fill={colors[index % colors.length]}
          />
          {/* Metin */}
          <SvgText
            x={
              radius +
              (radius * 0.7) * Math.sin(((startAngle + anglePerSlice / 2) * Math.PI) / 180)
            }
            y={
              radius -
              (radius * 0.7) * Math.cos(((startAngle + anglePerSlice / 2) * Math.PI) / 180)
            }
            fill="white"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {slice}
          </SvgText>
        </G>
      );
    });
  };

  return (
    <View style={styles.container}>
      <Svg width={radius * 2} height={radius * 2}>
        {createSlices()}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Wheel;