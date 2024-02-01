import type {Future} from '@legoo/helper';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {IPortalProps} from './portal';
import type {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

type Stack = ReturnType<typeof createNativeStackNavigator>;

export type IScreenProps = React.ComponentProps<Stack['Screen']>;

export type IPortalPushParams<T = any, P = {}> = Omit<
  Omit<Omit<IScreenProps, 'component'>, 'initialParams'>,
  'name'
> & {
  name?: string;
  initialParams?: Partial<P>;
  component: React.ComponentType<IPortalScreenProps<T, P>>;
  portal?: Omit<IPortalProps, 'future'>;
  onClose?: () => void;
};

export type IPortalScreenProps<
  T = any,
  P extends Record<string, any> = {},
> = NativeStackScreenProps<{portal: P}, 'portal'> & IPortalFeture<T>;

export interface IPortalFeture<T = any> {
  future: Future<T>;
}
