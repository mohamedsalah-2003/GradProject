// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// ✅ Fix لـ Firebase v9+ مع Metro bundler
config.resolver.unstable_enablePackageExports = true;

module.exports = config;