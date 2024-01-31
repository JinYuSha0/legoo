import './bootstrap';
import {createRoot} from 'react-dom/client';
import {Text} from 'react-native-web';
import React from 'react';
import App from './App';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

// Why wrapped by Text component?
// Create a TextAncestorContext, make the color of the child Text component inherited
// Related issues: https://github.com/necolas/react-native-web/issues/2634
root.render(
  <Text className="flex flex-1 text-foreground">
    <App />
  </Text>,
);
