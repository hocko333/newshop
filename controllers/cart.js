/* 

  购物车相关 具体处理业务

*/
//购物车相关的业务
//注意：购物车的操作分两种情况  1.已登录  2. 未登录
//1.已登录 去操作当前用户的购物车信息
//2.未登录 去操作的是客户端的cookie
const config = require('../config')
const productModel = require('../models/product')
const cartModel = require('../models/cart')

// 添加购物车
exports.add = (req, res, next) => {
  const id = req.query.id
  const amount = +req.query.amount || 1
  if (req.session.user) {
    // 已登录
    cartModel.add(req.session.user.id, id, amount)
      .then(data => {
        res.redirect('/cart/success?id=' + id + '&amount=' + amount)
      })
      .catch(err => next(err))
  } else {
    // 未登录
    const cookieJson = req.cookies[config.cookie.cart_key] || "[]"
    let cookieArr = JSON.parse(cookieJson)
    const cart = cookieArr.find(item => item.id == id)
    if (cart) {
      cart.amount += amount
    } else {
      cookieArr.push({
        id,
        amount
      })
    }
    const expires = new Date(Date.now() + config.cookie.cart_expires)
    res.cookie(config.cookie.cart_key, JSON.stringify(cookieArr), {
      expires
    })
    res.redirect('/cart/success?id=' + id + '&amount=' + amount)
  }
}

// 购物车添加成功的页面
exports.addSuc = (req, res, next) => {
  const {
    amount,
    id
  } = req.query
  productModel.getProduct(id, true)
    .then(data => {
      res.locals.cartInfo = {
        id: data.id,
        name: data.name,
        thumbnail: data.thumbnail,
        amount
      }
      res.render('cart-add')
    })
    .catch(err => next(err))
}

// 响应 购物车页面
exports.index = (req, res, next) => {
  res.render('cart')
}

// 查询购物车的接口 ajax
exports.find = (req, res, next) => {
  if (req.session.user) {
    // 已登录
    cartModel.find(req.session.user.id)
      .then(list => {
        res.json({list})
      })
      .catch(err => {
        res.json({list: []})
      })
  } else {
    // 未登录
    const cookieJson = req.cookies[config.cookie.cart_key] || "[]"
    const cookieArr = JSON.parse(cookieJson)
    const axiosArr = cookieArr.map((item, i) => productModel.getProduct(item.id, true))
    Promise.all(axiosArr)
      .then(results => {
        let list = results.map((item, i) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          thumbnail: item.thumbnail,
          amount: cookieArr[i].amount
        }))
        res.json({
          list
        })
      })
      .catch(err => {
        res.json({list: []})
      })
  }

}

// 编辑购物车数量
exports.edit = (req, res, next) => {
  const {
    id,
    amount
  } = req.body
  if (req.session.user) {
    // TODO 已登录
    cartModel.edit(req.session.user.id, id, amount)
      .then(data => {
        res.json({
          success: true
        })
      })
      .catch(err => {
        res.json({
          success: false
        })
      })
  } else {
    // 未登录 操作cookie
    const cookieJson = req.cookies[config.cookie.cart_key] || "[]"
    const cookieArr = JSON.parse(cookieJson)
    const cart = cookieArr.find(item => item.id == id)
    cart.amount = amount
    // 更新客户端 cookie
    const expires = new Date(Date.now() + config.cookie.cart_expires)
    res.cookie(config.cookie.cart_key, JSON.stringify(cookieArr), {
      expires
    })
    res.json({
      success: true
    })
  }
}

// 购物车删除商品
exports.delete = (req, res, next) => {
  const {
    id
  } = req.body
  if (req.session.user) {
    // TODO 已登录
    cartModel.delete(req.session.user.id, id)
      .then(data => {
        res.json({
          success: true
        })
      })
      .catch(err => {
        res.json({
          success: false
        })
      })
  } else {
    // 未登录
    // 取出 cookie 中的数据
    const cookieJson = req.cookies[config.cookie.cart_key] || "[]"
    // 将 cookie 中存储的数据 转成数组对象 便于操作
    const cookieArr = JSON.parse(cookieJson)
    // 找出符合条件的 数据对象 的索引
    const cartIndex = cookieArr.findIndex(item => item.id == id)
    cookieArr.splice(cartIndex, 1)
    // 更新客户端 cookie
    const expires = new Date(Date.now() + config.cookie.cart_expires)
    res.cookie(config.cookie.cart_key, JSON.stringify(cookieArr), {
      expires
    })
    res.json({
      success: true
    })
  }
}