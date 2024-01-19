module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      '@legoo/rn-screen-adaption/babel',
      {
        include: ['*.tsx', 'src/**/*.tsx', 'packages/**/*.js'],
        exclude: [],
      },
    ],
  ],
};
