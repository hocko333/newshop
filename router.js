/* 

  此模块用来 挂载路由 不处理业务

*/

const express = require('express')
const router = express.Router()
const checkLogin = require('./middleware').checkLogin

// 导入 controllers 中的模块
const home = require('./controllers/home')
const account = require('./controllers/account')
const product = require('./controllers/product')
const cart = require('./controllers/cart')
const member = require('./controllers/member')
const order = require('./controllers/order')

/* ----------------- 首页 相关路由 --------------------- */
router.get('/', home.index)
router.get('/like', home.like)

/* ----------------- 产品 相关路由 --------------------- */
router.get('/list/:id', product.list)
router.get('/search', product.search)
router.get('/item/:id', product.item)

/* ----------------- 购物车 相关路由 --------------------- */
router.get('/cart', cart.index) // 购物车页面
router.get('/cart/find', cart.find) // 购物车内容查询的接口
router.get('/cart/add', cart.add) // 处理添加购物车成功的逻辑
router.get('/cart/success', cart.addSuc) // 购物车添加成功的页面
router.post('/cart/edit', cart.edit) // 编辑购物车数量
router.post('/cart/delete', cart.delete) // 购物车删除商品

/* ----------------- 账户 相关路由 --------------------- */
router.get('/login', account.index) // 响应登录页面
router.post('/login', account.login)  // 处理登录请求
router.get('/logout', account.logout) // 处理退出请求

/* ----------------- 个人 相关路由 --------------------- */
router.get('/member', checkLogin, member.index) // 响应个人中心页面

/* ----------------- 订单 相关路由 --------------------- */
router.get('/order/create', checkLogin, order.create) // 生成订单的路由
router.get('/order/checkout', checkLogin, order.checkout) // 生成订单的具体页面

module.exports = router