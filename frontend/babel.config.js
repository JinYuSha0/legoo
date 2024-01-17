module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['nativewind/babel', {mode: 'compileOnly'}],
    [
      '@legoo/rn-screen-adaption/babel',
      {
        include: ['*.tsx', 'src/**/*.tsx', 'packages/**/*.tsx'],
        exclude: [],
      },
    ],
  ],
};
