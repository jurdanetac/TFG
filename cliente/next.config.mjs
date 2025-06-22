/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {URL_BACKEND: process.env.URL_BACKEND || "http://192.168.0.9:5050/api",
    URL_FRONTEND: process.env.URL_FRONTEND || "http://192.168.0.9:3000"
  },
};

export default nextConfig;
