/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // URL_BACKEND: process.env.URL_BACKEND || "http://192.168.0.200:5050/api",
    // URL_FRONTEND: process.env.URL_FRONTEND || "http://192.168.0.200:3000"
    URL_FRONTEND: process.env.URL_FRONTEND || "http://localhost:3000",
    URL_BACKEND: process.env.URL_BACKEND || "http://localhost:5050/api"
  },
};

export default nextConfig;
