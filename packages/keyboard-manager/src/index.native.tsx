import { NativeModules, Platform } from 'react-native';
export {
  RestrictedTextInput,
  type RestrictedTextInputProps,
  AmountInput,
  type AmountInputProps,
} from './components/restrictedTextInput/index.native';

const LINKING_ERROR =
  `The package '@legoo/keyboard-manager' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const KeyboardManager = NativeModules.KeyboardManager
  ? NativeModules.KeyboardManager
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function multiply(a: number, b: number): Promise<number> {
  return KeyboardManager.multiply(a, b);
}
