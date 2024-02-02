import {BackHandler} from 'react-native';
import {useEffect} from 'react';

export const useHardwareBackPress = (
  enabled: boolean,
  callback: () => boolean,
) => {
  useEffect(() => {
    if (!enabled) return;
    BackHandler.addEventListener('hardwareBackPress', callback);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', callback);
    };
  }, [enabled, callback]);
};

export default useHardwareBackPress;
