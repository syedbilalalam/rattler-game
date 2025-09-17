import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
};
module.exports = {
    output: 'export', // for Next.js 13+ App Router
    images: {
        unoptimized: true
    }
}
export default nextConfig;
