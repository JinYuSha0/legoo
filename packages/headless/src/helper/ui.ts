import {Platform} from 'react-native';

export const NavBarHeight = (() => {
  switch (Platform.OS) {
    case 'android':
      return 48;
    case 'ios':
    default:
      return 44;
  }
})();
