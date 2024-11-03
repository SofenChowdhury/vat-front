// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }

// module.exports = nextConfig


const withTM = require('next-transpile-modules')(['qrcode.react']);
const AntdMomentWebpackPlugin = require('antd-moment-webpack-plugin');

module.exports = withTM({
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // Add the AntdMomentWebpackPlugin to the plugins array
    config.plugins.push(new AntdMomentWebpackPlugin());

    // Return the modified webpack configuration
    return config;
  },
});
