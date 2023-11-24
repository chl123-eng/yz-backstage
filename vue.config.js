const { defineConfig } = require('@vue/cli-service');
const targetPath = "https://m.dcyijian.com/" //正式
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  devServer: {
      port: 8899,
      proxy: {
        '/api': {
          target: targetPath,
        }

      },
  }
})
