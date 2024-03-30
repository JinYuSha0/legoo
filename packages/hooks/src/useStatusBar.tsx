import React from 'react';

import {useIsFocused} from '@react-navigation/native';
import {StatusBar, StatusBarProps} from 'react-native';

export const useStatusBar = (
  enabled: boolean,
  statusBarProps?: StatusBarProps,
) => {
  const isFocused = useIsFocused();
  if (!enabled || !isFocused) return null;
  return (
    <StatusBar translucent backgroundColor="transparent" {...statusBarProps} />
  );
};
