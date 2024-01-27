export {
  RestrictedTextInput,
  type RestrictedTextInputProps,
  AmountInput,
  type AmountInputProps,
} from './components/restrictedTextInput/index.web';

export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b);
}
