/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    URL_BACKEND: process.env.URL_BACKEND || "http://localhost:5050/api",
    URL_FRONTEND: process.env.URL_FRONTEND || "http://localhost:3000"
  },
};

export default nextConfig;
