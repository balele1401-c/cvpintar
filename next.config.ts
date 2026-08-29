import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.cvpintarku.my.id",
          },
        ],
        destination: "https://cvpintarku.my.id/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
