module.exports = {
  presets: [
    '@babel/preset-env',
  ],
  plugins: [
    // Stage 2
   '@babel/plugin-proposal-export-namespace-from',
    // Stage 3
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    ['@babel/plugin-proposal-class-properties', { 'loose': true }],
    '@babel/plugin-proposal-json-strings',
  ],
}
