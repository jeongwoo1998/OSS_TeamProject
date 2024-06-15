import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { AppStyles as styles } from '../styles/AppStyles';

// label : 입력 필드(Ex: 열량, 탄수화물 ..), value : 사용자가 입력한 값,
// onChangeText : 사용자가 값을 입력할 때 호출되는 콜백함수, 입력된 값 상태로 업데이트해주는 기능, unit : 입력 필드 값의 단위
const GoalInput = ({ label, value, onChangeText, unit }) => {
  return (
    <View style={styles.goalInputContainer}>
      {/* "Label |" 까지 표시 */}
      <Text style={styles.goalLabel}>{label}</Text>
      
      <Text style={styles.separator}></Text>

      {/* 사용자가 값을 입력하는 입력 필드 */}
      <TextInput
        style={styles.goalInput}  
        value={value} // 현재 값
        onChangeText={onChangeText} // 사용자가 값을 입력하면 변경하는 함수 호출
        keyboardType="numeric" // keyboardType 속성을 사용해 숫자 키패드가 나타나도록 설정
        maxLength={4} // 최대 입력 길이 4자로 제한
      />

      {/* 단위 표시 */}
      <Text style={styles.goalUnit}>{unit}</Text>
    </View>
  );
};

export default GoalInput;