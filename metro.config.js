const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {withNativeWind} = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname, {isCSSEnabled: true});

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
