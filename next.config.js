/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig;

require('events').EventEmitter.defaultMaxListeners = 30;