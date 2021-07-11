import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import legacy from '@vitejs/plugin-legacy'
import vitePluginImp from 'vite-plugin-imp'
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    legacy({
      targets:['defaults','not IE 11'] //兼容不支持esm 的浏览器
    }),
    vitePluginImp({
        libList:[
          {
            /* 按需加载 antd */
            libName:"antd",
            style(name){ 
              if(/CompWithoutStyleFile/i.test(name)){
                return false;
              }
              return `antd/es/${name}/style/index.css`;
            }
          }
        ]
    }),
    reactRefresh() //执行无感知热更新:
  ],
  resolve:{
    alias:{
      "@":path.resolve(__dirname,'./src'),
      "@pages":path.resolve(__dirname,'./src/pages'),
      "@components":path.resolve(__dirname,'./src/components'),
      "@model":path.resolve(__dirname,'./src/model'),
      "@services":path.resolve(__dirname,'./src/services'),
      "@types":path.resolve(__dirname,'./src/types'),
      "@utils":path.resolve(__dirname,'./src/utils'),
    }
  },
  server:{
    proxy:{} /* 接口地址 */,
    hmr:{
      overlay:false,
      host:"localhost" //本地开启hmr 热更新 编译哈希值变化后就更新
    }
  }
})
