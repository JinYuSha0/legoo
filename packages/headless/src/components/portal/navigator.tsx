import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {atom, useAtom} from 'helux';
import React from 'react';

const Stack = createNativeStackNavigator();

type PortalProps = {
  overlay: boolean;
  preventGoBack: boolean;
  backgroundColor: string;
};

export type PortalScreenProps = React.ComponentProps<typeof Stack.Screen> & {
  portal?: Partial<PortalProps>;
};

const [screensAtom, setScreens] = atom<PortalScreenProps[]>(() => []);

export function addPortalScreen(portalScreen: PortalScreenProps) {
  let idx = -1;
  if (screensAtom.val.find(portal => portal.name === portalScreen.name)) {
    console.warn(`Screen name ${portalScreen.name} is duplicated`);
    return;
  }
  setScreens(draft => {
    idx = draft.push(portalScreen);
  }, {});
  return () => {
    setScreens(draft => {
      draft.splice(idx, 1);
      return draft;
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
        {screens.map(screen => (
          <Stack.Screen key={screen.name} {...screen} />
        ))}
      </Stack.Group>,
    );
  };
}
