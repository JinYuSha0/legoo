import './global.css';
import {init, Direction} from '@legoo/screen-adaption';
import {normalization} from '@legoo/headless';

normalization(['ios', 'android']);

init({
  designSize: {
    width: 375,
    height: 675,
  },
  direction: Direction.width,
});
