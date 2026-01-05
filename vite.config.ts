import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { createHtmlPlugin } from 'vite-plugin-html';
import process from 'node:process';

// ----------------------------------------------------------------------

const PORT = 3039;

export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        dev: { logLevel: ['error'] },
      },
      overlay: {
        position: 'tl',
        initialIsOpen: false,
      },
    }),
      createHtmlPlugin({
          inject: {
              // 将数据注入到index.html中
              data: {
                  // 可以直接使用加载到的环境变量
                  title: process.env.VITE_APP_TITLE,
                  // 也可以注入其他自定义数据
                  // injectData: 'Some static data'
              },
          },
      }),
  ],
  resolve: {
    alias: [
      {
        find: /^src(.+)/,
        replacement: path.resolve(process.cwd(), 'src/$1'),
      },
    ],
  },
    server: {
        port: PORT, host: true,
        proxy: {
            '/api/analysis': {
                target: 'https://news-analytics-gw35.onrender.com',
                changeOrigin: true,
            },
            '/api': {
                target: process.env.VITE_API_URL,
                changeOrigin: true,
            },
        },
    },
  preview: { port: PORT, host: true },
});
