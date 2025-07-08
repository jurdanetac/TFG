/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // URL_BACKEND: process.env.URL_BACKEND || "http://172.20.10.3:5050/api",
    // URL_FRONTEND: process.env.URL_FRONTEND || "http://172.20.10.3:3000"
    URL_FRONTEND: process.env.URL_FRONTEND || "http://localhost:3000",
    URL_BACKEND: process.env.URL_BACKEND || "http://localhost:5050/api"
  },
};

export default nextConfig;
