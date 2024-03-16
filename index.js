import './bootstrap';
import {AppRegistry, LogBox} from 'react-native';
import {name as appName} from './app.json';
import App from './App';

LogBox.ignoreAllLogs();

AppRegistry.registerComponent(appName, () => App);
