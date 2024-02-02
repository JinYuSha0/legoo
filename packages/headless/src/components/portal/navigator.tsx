import type {IPortalPushParams, IPortalFeture, IScreenProps} from './types';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {atom, useAtom} from 'helux';
import {deferred, serial, randomStr, nextTick, noop} from '@legoo/helper';
import {navigationRef} from '../provider/provider';
import React from 'react';
import Portal from './portal';

const Stack = createNativeStackNavigator();

const [screensAtom, setScreens] = atom<
  Map<string, IPortalPushParams & IPortalFeture>
>(() => new Map());

export function pushPortalScreen<T = any, P = {}>(
  portalPushParams: IPortalPushParams<T, P>,
  immediately: boolean = true,
) {
  if (!portalPushParams.name) {
    portalPushParams.name = randomStr();
  }
  const {future} = deferred<T>();
  const name = portalPushParams.name;
  if (screensAtom.val.has(name)) {
    console.warn(`Screen name ${name} is duplicated`);
    return;
  }
  setScreens(draft => {
    draft.set(name, {...portalPushParams, future});
  });
  function removeScreen() {
    setScreens(draft => {
      draft.delete(name);
    });
  }
  future.finally(serial(removeScreen, portalPushParams.onClose)).catch(noop);
  if (immediately) {
    nextTick(() => {
      navigationRef.navigate(name, portalPushParams.initialParams);
    });
  }
  return future;
}

export function withPortalStack(Compt: React.ReactElement) {
  const newProps = {...Compt.props};
  const {children, ...rest} = newProps;
  return () => {
    const [screens] = useAtom(screensAtom);
    return React.cloneElement(
      Compt,
      rest,
      children,
      <Stack.Group
        screenOptions={{
          presentation: 'transparentModal',
          headerShown: false,
          animation: 'none',
        }}>
        {Array.from(screens.values()).map(screen => {
          const {portal, future, onClose, ...rest} = screen;
          function TempScreen(props) {
            return (
              <Portal future={future} {...portal}>
                {React.createElement(screen.component, {
                  ...props,
                  future,
                })}
              </Portal>
            );
          }
          TempScreen.name = `Portal_${screen.name}`;
          rest.component = TempScreen;
          return <Stack.Screen key={screen.name} {...(rest as IScreenProps)} />;
        })}
      </Stack.Group>,
    );
  };
}
