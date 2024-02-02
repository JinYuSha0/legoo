import { NativeModules, Platform } from 'react-native';
export {
  RestrictedTextInput,
  type RestrictedTextInputProps,
  AmountInput,
  type AmountInputProps,
} from './components/restrictedTextInput/index.native';
// @ts-ignore
export { default as TextInput } from './components/restrictedTextInput/rnlib/TextInput.js';

const LINKING_ERROR =
  `The package '@legoo/treasure-chest' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const TreasureChest = NativeModules.TreasureChest
  ? NativeModules.TreasureChest
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

TreasureChest;
