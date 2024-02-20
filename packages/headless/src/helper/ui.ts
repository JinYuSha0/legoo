import {Platform} from 'react-native';
import {Dimensions} from 'react-native';

export const windowWidth = Dimensions.get('screen').width;
export const windowHeight = Dimensions.get('window').height;

export const NavBarHeight = (() => {
  switch (Platform.OS) {
    case 'android':
      return 48;
    case 'ios':
    default:
      return 44;
  }
})();

export const sizePercent = (where: 'width' | 'height', percent: string) => {
  if (!/^\d+(\.\d+)?%$/.test(percent)) {
    throw new Error();
  }
  let base = windowHeight;
  const scale = +percent.slice(0, percent.length - 1) / 100;
  if (where === 'width') base = windowWidth;
  return base * scale;
};
