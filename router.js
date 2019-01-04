/* 

  此模块用来 挂载路由 不处理业务

*/

const express = require('express')
const router = express.Router()

// 导入 controllers 中的模块
const home = require('./controllers/home')

router.get('/', home.index)


module.exports = router