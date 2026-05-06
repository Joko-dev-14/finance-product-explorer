/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // next/image blocks external domains by default to prevent abuse.
    // We allowlist only the Contentful CDN that serves product images.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
    ],
  },
};

export default nextConfig;
