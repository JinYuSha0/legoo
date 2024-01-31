import {Platform, Dimensions, StatusBar} from 'react-native';

const {height, width} = Dimensions.get('window');
export const ScreenWidth = width;
export const ScreenHeight = height;

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

const getRamdonStr = () => Math.random().toString(36).split('.')[1];

export const randomRouteName = (name: string) => `${name}_${getRamdonStr()}`;
