import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {ScreenNames} from '@helper/sceenNames';
import {withPortalStack, NavBar} from '@legoo/headless';
import {Keyboard, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import Preview from '@screens/preview';
import Test from '@/screens/test';
import Selector from '@/screens/selector';

export type RootStackParamList = {
  [ScreenNames.PREVIEW]: {
    a: number;
  };
  [ScreenNames.TEST]?: {};
  [ScreenNames.SELECTOR]?: {};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const options: Record<keyof typeof ScreenNames, NativeStackNavigationOptions> =
  {
    [ScreenNames.PREVIEW]: {title: 'Preview'},
    [ScreenNames.TEST]: {title: 'Test'},
    [ScreenNames.SELECTOR]: {title: 'Selector'},
  };

const RootStack = withPortalStack((props: React.PropsWithChildren<{}>) => {
  const {children} = props;
  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('transparent');
  }, []);
  return (
    <Stack.Navigator
      initialRouteName={ScreenNames.PREVIEW}
      screenListeners={{
        state: e => {
          Keyboard.dismiss();
        },
      }}>
      <Stack.Group
        screenOptions={route => ({
          headerShadowVisible: false,
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
        <Stack.Screen
          name={ScreenNames.SELECTOR}
          component={Selector}
          options={options[ScreenNames.SELECTOR]}
        />
      </Stack.Group>
      {children}
    </Stack.Navigator>
  );
});

export default RootStack;
