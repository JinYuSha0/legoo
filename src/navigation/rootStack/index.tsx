import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {ScreenNames} from '@helper/sceenNames';
import {Text, View} from 'react-native';
import {NavBar} from '@legoo/headless';
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
    [ScreenNames.PREVIEW]: {title: 'Preview'},
    [ScreenNames.TEST]: {title: 'Test'.repeat(4)},
  };

const RootStack = () => (
  <Stack.Navigator
    initialRouteName={ScreenNames.PREVIEW}
    screenOptions={route => ({
      // headerShown: false,
      animation: 'ios',
      header: props => <NavBar {...props} />,
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
