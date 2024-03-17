import {View, Platform} from 'react-native';
import {useColorScheme} from 'nativewind';
import {cx} from 'class-variance-authority';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type ColorScheme = 'light' | 'dark';

interface ThemeProviderProps {
  children: React.ReactNode;
  colorScheme?: ColorScheme;
}

const ThemeContext = createContext<{
  colorScheme: ColorScheme;
  toggleColorScheme: () => void;
}>({
  colorScheme: 'light',
  toggleColorScheme: () => {},
});

export const ThemeProvider = ({children, colorScheme}: ThemeProviderProps) => {
  const [_colorScheme, _setColorScheme] = useState(colorScheme);
  const {colorScheme: __colorScheme, setColorScheme: __setColorScheme} =
    useColorScheme();
  const reallyColorScheme = useMemo(
    () => _colorScheme ?? __colorScheme,
    [_colorScheme, __colorScheme],
  );
  const toggleColorScheme = useCallback(() => {
    const newColorScheme = reallyColorScheme === 'light' ? 'dark' : 'light';
    _setColorScheme(newColorScheme);
    if (Platform.OS === 'web') {
      document.body.classList.remove(reallyColorScheme);
      document.body.classList.add(newColorScheme);
    } else {
      __setColorScheme(newColorScheme);
    }
  }, [reallyColorScheme, _setColorScheme]);
  return (
    <ThemeContext.Provider
      value={{colorScheme: reallyColorScheme, toggleColorScheme}}>
      {Platform.OS === 'web' ? (
        children
      ) : (
        <View
          key={reallyColorScheme}
          className={cx('flex-1', reallyColorScheme)}>
          {children}
        </View>
      )}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
