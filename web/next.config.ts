import { withExpo } from '@expo/next-adapter';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // tell Next.js to transpile RN and Expo modules
  transpilePackages: ['react-native', 'expo'],
  // use SWC for the Expo presets
  experimental: { forceSwcTransforms: true },
};

export default withExpo(nextConfig);