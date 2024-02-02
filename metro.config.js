const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {withNativeWind} = require('nativewind/metro');
const reverser = require('@legoo/port-reverser/core');

// adb reverse tcp
// fixme ios build throw error
reverser([8081, 8082]);

const defaultConfig = getDefaultConfig(__dirname);

const config = mergeConfig(defaultConfig, {
  resolver: {
    sourceExts: [...defaultConfig.resolver.sourceExts, 'css'],
  },
  transformer: {
    ...defaultConfig.transformer,
    getTransformOptions: async () => ({
      babelTransformerPath: require('metro-babel-transformer'),
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
});

module.exports = withNativeWind(config, {
  input: './global.css',
  inlineRem: 16,
});
