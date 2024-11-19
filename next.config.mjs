/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false,
  webpack: (config) => {
    config.resolve.alias.canvas = false
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      stream: false,
      util: false
    }
    return config
  }
};

export default nextConfig;
