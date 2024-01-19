import type {PressableProps} from 'react-native';

export interface ButtonProps extends PressableProps {
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  children: string;
}
