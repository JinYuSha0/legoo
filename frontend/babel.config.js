module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    [
      '@legoo/rn-screen-adaption/babel',
      {
        include: ['*.tsx', 'src/**/*.tsx', 'packages/**/*.js'],
        exclude: [],
      },
    ],
  ],
};
