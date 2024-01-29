import {type ForwardRefRenderFunction, memo, forwardRef, Fragment} from 'react';
import {type NativeStackHeaderProps} from '@react-navigation/native-stack';
import {View, Text, StatusBar} from 'react-native';
import {statusBarHeight} from '../../helper/ui';
import {useColorScheme} from 'nativewind';
import React from 'react';

export interface NavBarProps extends NativeStackHeaderProps {}

const NavBar: ForwardRefRenderFunction<View, NavBarProps> = (props, ref) => {
  const {colorScheme} = useColorScheme();
  return (
    <Fragment>
      <StatusBar
        backgroundColor="transparent"
        barStyle={colorScheme !== 'light' ? 'light-content' : 'dark-content'}
      />
      <View
        ref={ref}
        className="w-screen h-11 bg-background"
        style={{height: statusBarHeight + 44, paddingTop: statusBarHeight}}>
        <Text>{props.options.title}</Text>
      </View>
    </Fragment>
  );
};

NavBar.displayName = 'NavBar';

export default memo(forwardRef(NavBar));
