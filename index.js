const http = require('http')
const url = require('url')
const port = process.argv[2]
const qiniu = require('qiniu')

const qiniuConfig = {
  accessKey: 'MAk87WwaEWIRXHRk7oCkfsvZyf2W-zkFt1Utolrx',
  secretKey: 'azMokfANcxcsYJBCdcm7FHmusXcYj3ofwEG_idSr'
}
const qiniuOptions = {
  scope: 'joker-cloud-music',
}
const mac = new qiniu.auth.digest.Mac({ ...qiniuConfig })

// 判断是否传入端口号参数
if (!port) {
  console.log('请指定端口号！\n例如：node server.js 8888')
  process.exit(1)
}

// 创建服务器
const server = http.createServer(
  function (request, response) {
    const temp = url.parse(request.url, true)
    const path = temp.pathname
    console.log('HTTP 请求路径为：\n' + path)
    // 判断 HTTP 请求路径
    if (path === '/uptoken') {
      response.statusCode = 200
      response.setHeader('Access-Control-Allow-Origin', '*')
      response.setHeader('Content-Type', 'applicaiton/json; charset=utf-8')
      
      const putPolicy = new qiniu.rs.PutPolicy(qiniuOptions)
      const uploadToken = putPolicy.uploadToken(mac)

      response.write(`
        {
          "uptoken": "${uploadToken}"
        }
      `)
      response.end()
    } else {
      // 找不到对应的请求路径，返回错误码404
      response.statusCode = 404
      response.end()
    }
  }
)

// 监听传入的端口号
server.listen(port)
console.log('监听' + port + '成功！\nhttp://localhost:' + port)