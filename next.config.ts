import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  /* Blog drafts arrive with /blog/ slugs; the posts live under /notes. */
  async redirects() {
    return [
      { source: "/blog", destination: "/notes", permanent: true },
      { source: "/blog/:slug", destination: "/notes/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
