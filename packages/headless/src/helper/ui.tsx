import {Platform, StatusBar} from 'react-native';

export const statusBarHeight = (() => {
  switch (Platform.OS) {
    case 'android':
      return StatusBar.currentHeight;
    case 'ios':
      return 20;
    default:
      return 0;
  }
})();
