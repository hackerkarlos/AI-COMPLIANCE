import type { NextConfig } from 'next';

// Pin the Turbopack / output-tracing root to this project so Next doesn't
// walk up and pick a sibling lockfile (../mission-control) as the workspace.
const projectRoot = process.cwd();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  // Next 16 stabilised typedRoutes out of `experimental`.
  typedRoutes: true,
};

export default nextConfig;
