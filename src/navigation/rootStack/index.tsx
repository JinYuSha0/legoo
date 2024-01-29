import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {ScreenNames} from '@helper/sceenNames';
import React from 'react';
import Preview from '@screens/preview';
import Test from '@/screens/test';

export type RootStackParamList = {
  [ScreenNames.PREVIEW]: {
    a: number;
  };
  [ScreenNames.TEST]: {};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const options: Record<keyof typeof ScreenNames, NativeStackNavigationOptions> =
  {
    [ScreenNames.PREVIEW]: {headerShown: false},
    [ScreenNames.TEST]: {title: 'Test'},
  };

const RootStack = () => (
  <Stack.Navigator
    initialRouteName={ScreenNames.PREVIEW}
    screenOptions={route => ({
      headerShown: false,
      statusBarColor: 'transparent',
      statusBarTranslucent: true,
      animation: 'ios',
    })}>
    <Stack.Screen
      name={ScreenNames.PREVIEW}
      component={Preview}
      options={options[ScreenNames.PREVIEW]}
    />
    <Stack.Screen
      name={ScreenNames.TEST}
      component={Test}
      options={options[ScreenNames.TEST]}
    />
  </Stack.Navigator>
);

export default RootStack;
