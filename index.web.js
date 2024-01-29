import './bootstrap';
import {createRoot} from 'react-dom/client';
import {Text} from 'react-native-web';
import React from 'react';
import App from './App';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
root.render(<App />);
