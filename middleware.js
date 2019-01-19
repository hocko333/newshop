/* 

  此模块用来 写自定义中间件

*/
const qs = require('querystring')

const config = require('./config')
const categoryModel = require('./models/category')
const cartModel = require('./models/cart')

exports.global = (req, res, next) => {
  // seo 相关信息
  res.locals.site = config.site
  // 全局挂载 user
  if (req.session.user) {
    res.locals.user = req.session.user
  }

  const getCategory = () => {
    // 获取侧边分类导航 树状数据
    // 判断 缓存中是否有数据
    if (!req.app.locals.category) {
      // 没有缓存
      return categoryModel.getCategoryTree()
        .then(data => {
          // 将新数据挂载在全局对象上 页面可以使用
          res.locals.category = data
          // 并且 缓存起来 (将数据放在变量中,而变量存在缓存中,程序运行时,一直存在,程序关闭则销毁)
          req.app.locals.category = data
        })
        .catch(err => next(err))
    } else {
      // 缓存中 有数据
      res.locals.category = req.app.locals.category
      return Promise.resolve()
    }
  }

  const getCart = () => {
    if (req.session.user) {
      return cartModel.find(req.session.user.id)
        .then(data => {
          // let totalAmount = 0
          // data.forEach(item => {
          //   totalAmount += parseInt(item.amount)
          // })
          // const nameList = data.map(item => item.name)
          // res.locals.cartPreviewList = {
          //   totalAmount,
          //   nameList
          // }
          res.locals.cartPreviewList = {
            totalAmount: data.reduce((pre, item) => pre + parseInt(item.amount), 0),
            nameList: data.map(item => item.name)
          }
        })

    } else {
      const cookieJson = req.cookies[config.cookie.cart_key] || "[]"
      const cookieArr = JSON.parse(cookieJson)
      let totalAmount = 0
      cookieArr.forEach(item => {
        totalAmount += parseInt(item.amount)
      })
      const nameList = cookieArr.map(item => item.name)
      res.locals.cartPreviewList = {
        totalAmount,
        nameList
      }
    }
  }

  Promise.all([getCategory(), getCart()])
    .then(ret => {
      next()
    })
    .catch(err => Promise.reject(err))
}

exports.checkLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login?returnUrl=' + qs.escape(req.url))
  }
  next()
}