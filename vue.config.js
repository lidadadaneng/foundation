const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8082,
    proxy: {
      "/favor": {                        //设置跨域变量代号
        target: "https://api.fund.eastmoney.com",         //你想要代理的目标源链接
        changeOrigin: true,          //开启代理
        pathRewrite: {               //设置二级
          "^/favor": "/favor/"
        },
        headers: {//重点在这里，添加配置项 headers 就可以了
          Host: 'api.fund.eastmoney.com',
          Origin: 'https://favor.fund.eastmoney.com',
          Referer: 'https://favor.fund.eastmoney.com/'
        }
      }
    }
  }
})
