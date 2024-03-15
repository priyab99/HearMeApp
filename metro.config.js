const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push('cjs');
//defaultConfig.resolver.assetExts.push('scss', 'sass', 'css','js', 'json', 'jsx', 'ts', 'tsx');


module.exports = defaultConfig;
