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

const [routesAtom, setRoutes] = atom<PortalScreenProps[]>(() => []);

export function addPortalScreen(portalScreen: PortalScreenProps) {
  let idx = -1;
  if (routesAtom.val.find(portal => portal.name === portalScreen.name)) {
    console.warn(`Screen name ${portalScreen.name} is duplicate`);
    return;
  }
  setRoutes(draft => {
    idx = draft.push(portalScreen);
  }, {});
  return () => {
    setRoutes(draft => {
      draft.splice(idx, 1);
      return draft;
    });
  };
}

export function withPortalStack(Compt: React.ReactElement) {
  const newProps = {...Compt.props};
  const {children, ...rest} = newProps;
  return () => {
    const [routes] = useAtom(routesAtom);
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
        {routes.map(route => (
          <Stack.Screen
            key={route.name}
            name={route.name}
            component={route.component}
          />
        ))}
      </Stack.Group>,
    );
  };
}
