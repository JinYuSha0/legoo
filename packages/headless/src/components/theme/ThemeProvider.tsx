import {View} from 'react-native';
import {useColorScheme} from 'nativewind';
import cx from 'classnames';
import React, {createContext, useCallback, useContext} from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeContext = createContext<{
  theme: 'light' | 'dark';
  toggleColorScheme: () => void;
}>({
  theme: 'light',
  toggleColorScheme: () => {},
});

export const ThemeProvider = ({children}: ThemeProviderProps) => {
  const {colorScheme, setColorScheme} = useColorScheme();
  const toggleColorScheme = useCallback(() => {
    setColorScheme(colorScheme === 'light' ? 'dark' : 'light');
  }, [colorScheme, setColorScheme]);
  return (
    <ThemeContext.Provider value={{theme: colorScheme, toggleColorScheme}}>
      <View key={colorScheme} className={cx('flex-1', colorScheme)}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
