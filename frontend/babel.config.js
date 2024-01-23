module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    [
      '@legoo/screen-adaption/babel',
      {
        include: ['*.tsx', 'src/**/*.tsx', 'packages/**/*.js'],
        exclude: [],
        tailwindcss: 'global.css',
      },
    ],
  ],
};
