export const presets = [
  [
    '@babel/preset-env',
    {
      targets: {
        node: 'current'
      }
    }
  ],
  [
    '@babel/preset-react',
    {
      runtime: 'automatic'
    }
  ]
];
export const plugins = ['@babel/plugin-proposal-private-property-in-object'];
