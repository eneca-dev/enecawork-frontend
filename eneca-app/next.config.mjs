/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['hebbkx1anhila5yf.public.blob.vercel-storage.com'],
    },
    eslint: {
      // Warning during build doesn't fail deployment in production
      ignoreDuringBuilds: true,
    }
  }
export default nextConfig;
