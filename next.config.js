/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
