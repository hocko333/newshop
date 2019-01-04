const axios = require('axios')
// 导入 配置项
const config = require('../config')
// 提取配置项中的 api
const api = config.api
// 配置axios
const instance = axios.create({
  baseURL: api.baseURL,
  timeout: api.timeout,
  auth: {
    username: api.auth.username,
    password: api.auth.password
  }
})

// 导出 axios 示例 instance
module.exports = instance