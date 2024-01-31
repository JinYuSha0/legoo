import Portal, {type PortalProps} from './portal';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {atom, useAtom} from 'helux';
import React from 'react';

const Stack = createNativeStackNavigator();

export type PortalScreenProps = React.ComponentProps<typeof Stack.Screen> & {
  portal?: PortalProps;
};

const [screensAtom, setScreens] = atom<Map<string, PortalScreenProps>>(
  () => new Map(),
);

export function addPortalScreen(portalScreen: PortalScreenProps) {
  const name = portalScreen.name;
  if (screensAtom.val.has(name)) {
    console.warn(`Screen name ${name} is duplicated`);
    return;
  }
  setScreens(draft => {
    draft.set(name, portalScreen);
  });
  return function remove() {
    setScreens(draft => {
      draft.delete(name);
    });
  };
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
          const {portal, ...rest} = screen;
          function TempScreen(props) {
            return (
              <Portal {...portal}>
                {React.createElement(screen.component, props)}
              </Portal>
            );
          }
          TempScreen.name = `Portal_${screen.name}`;
          rest.component = TempScreen;
          return <Stack.Screen key={screen.name} {...rest} />;
        })}
      </Stack.Group>,
    );
  };
}
