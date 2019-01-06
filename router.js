/* 

  此模块用来 挂载路由 不处理业务

*/

const express = require('express')
const router = express.Router()

// 导入 controllers 中的模块
const home = require('./controllers/home')
const account = require('./controllers/account')
const product = require('./controllers/product')


router.get('/', home.index)

router.get('/like', home.like)

router.get('/list/:id', product.list)

router.get('/login', account.login)

module.exports = router