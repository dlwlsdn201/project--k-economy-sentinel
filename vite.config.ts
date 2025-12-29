import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@models': path.resolve(__dirname, './src/models'),
      '@viewmodels': path.resolve(__dirname, './src/viewmodels'),
      '@views': path.resolve(__dirname, './src/views'),
      '@app': path.resolve(__dirname, './src/app'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.config.*',
        '**/types/**',
        '**/*.d.ts',
      ],
    },
    // SVG 모킹 설정
    alias: {
      '\\.svg$': path.resolve(__dirname, './svgMockup.ts'),
    },
  },
});
