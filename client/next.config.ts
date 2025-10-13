import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "*.unsplash.com" },
      { protocol: "https", hostname: "*www.freepik.com" },
      { protocol: "https", hostname: "*cdn-icons-png.flaticon.com" },
      { protocol: "https", hostname: "*example.com" },
    ],
  },
};



export default nextConfig;
