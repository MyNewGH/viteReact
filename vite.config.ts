import type { UserConfigExport, ConfigEnv, build } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import legacy from '@vitejs/plugin-legacy';
import vitePluginImp from 'vite-plugin-imp';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { minifyHtml } from 'vite-plugin-html';
import postcssPresetEnv from 'postcss-preset-env';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pxToRem = require('postcss-pxtorem');
// https://vitejs.dev/config/
const config: UserConfigExport = {
  plugins: [
    legacy({
      targets: [
        'Android >= 39',
        'Chrome >= 50',
        'Safari >= 10.1',
        'iOS >= 10.3',
        '> 1%',
        'not IE 11'
      ] // 兼容不支持esm 的浏览器
    }),
    vitePluginImp({
      libList: [
        {
          /* 按需加载 antd-mobile */
          libName: 'antd-mobile',
          style(name) {
            if (/CompWithoutStyleFile/i.test(name)) {
              return false;
            }
            return `antd-mobile/es/${name}/style/index.css`;
          },
          libDirectory: 'es'
        }
      ]
    }),
    reactRefresh() // 执行无感知热更新:
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/api'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@model': path.resolve(__dirname, './src/model'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
        // antd 定制主题样式
        modifyVars: {
          '@fill-body': '#fff'
        }
      }
    },
    modules: {
      localsConvention: 'camelCase' // 模块使用驼峰命名法
    },
    postcss: {
      plugins: [
        postcssPresetEnv({
          autoprefixer: {
            flexbox: 'no-2009'
          },
          stage: 3
        }),
        pxToRem({
          rootValue: 32,
          propList: ['*'],
          unitPrecision: 5,
          exclude: /(node_module)/
        })
      ]
    }
  },
  logLevel: 'info',
  server: {
    open: true,
    proxy: {} /* 接口地址 */,
    hmr: {
      overlay: false,
      host: 'localhost' // 本地开启hmr 热更新 编译哈希值变化后就更新
    }
  },
  build: {
    target: 'es2015',
    minify: 'terser',
    cssCodeSplit: true,
    polyfillDynamicImport: true,
    rollupOptions: {
      plugins: []
    }
  }
};
// export default defineConfig(
//  )
/*
  vite    等于 vite -m development，此时 command='serve',mode='development'

"tsc && vite build" 等于 vite -m production，此时 command='build', mode='production'
*/
export default ({ command, mode }: ConfigEnv) => {
  const envFiles = [/** default file */ `.env`, /** mode file */ `.env.${mode}`];
  const { plugins = [] } = config;
  const isDev = command === 'serve';

  for (const file of envFiles) {
    try {
      fs.accessSync(file, fs.constants.F_OK); // 检验是否有权限访问这些文件
      const envConfig = dotenv.parse(fs.readFileSync(file));
      for (const k in envConfig) {
        if (Object.prototype.hasOwnProperty.call(envConfig, k)) {
          process.env[k] = envConfig[k];
        }
      }
    } catch (error) {
      console.log('配置文件不存在，忽略');
    }
  }
  config.define = {
    'process.env.NODE_ENV': `"${mode}"`,
    'process.env.API_URL': `"${process.env.API_URL}"`
  };
  /* DEV */
  if (isDev) {
    // return {
    //   // serve 独有配置
    // }
  } else {
    config.plugins = [...plugins, minifyHtml()];
    config.base = '/app/'; // 生产环境下的公共路径
    // config.define = {
    //   'process.env.NODE_ENV': '"production"'
    // };
    // return {
    //   // build 独有配置
    // }
  }
  return config;
};
