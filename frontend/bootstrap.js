import {NativeWindStyleSheet} from 'nativewind';
import ScreenAdaption from '@legoo/rn-screen-adaption';

NativeWindStyleSheet.setOutput({
  default: 'native',
});

ScreenAdaption.init({
  designSize: {
    width: 375,
    height: 667,
  },
  direction: ScreenAdaption.Direction.width,
});
