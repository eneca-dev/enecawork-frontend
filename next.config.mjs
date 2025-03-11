/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Дополнительные настройки для поддержки группировки маршрутов
  // Группы маршрутов в скобках не будут отображаться в URL
};

export default nextConfig; 