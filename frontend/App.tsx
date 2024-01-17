/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
  useColorScheme,
  Platform,
  Image,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import {styled, NativeWindStyleSheet} from 'nativewind';

const Colors = {
  darker: '#000000',
  lighter: '#FFFFFF',
  black: '#000000',
  white: '#FFFFFF',
};

function A(...props: any) {
  console.log(props);
  return null;
}

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledA = styled(A);

function App(): React.JSX.Element {
  return (
    <StyledView className="flex-row">
      <StyledView className="bg-yellow-300 w-[125px] h-[125px] rounded-md"></StyledView>
      <View
        style={{
          width: 125,
          height: 125,
          borderRadius: 6,
          backgroundColor: '#000',
        }}
      />
      <StyledView className="bg-green-300 w-[125px] h-[125px] rounded-md"></StyledView>
      <StyledA width={125} borderRadius={10} />
    </StyledView>
  );
}

export default App;
