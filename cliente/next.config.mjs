/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  env: {
    URL_FRONTEND: process.env.URL_FRONTEND || "http://localhost:3000",
    URL_BACKEND: process.env.URL_BACKEND || "http://localhost:5050/api"
  },

  // no imprimir mensajes de consola en producción
  // esto es útil para evitar que se exponga información en el cliente
  // compiler: {
  //   removeConsole: true,
  // },
};

export default nextConfig;
