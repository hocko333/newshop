/* 

  此模块用来处理 账户相关路由 具体业务

*/
const svgCaptcha = require('svg-captcha')
const createError = require('http-errors')
const accountModel = require('../models/account')
const config = require('../config')
const cartModel = require('../models/cart')

// 响应登录页面
exports.index = (req, res, next) => {
  const captcha = svgCaptcha.createMathExpr({
    width: 120,
    height: 35,
    fontSize: 34
  })
  // 把验证码答案 放进用户的 session
  req.session.captcha = captcha.text
  // 把验证码图片 放入模板
  res.locals.captcha = captcha.data

  res.locals.returnUrl = req.query.returnUrl || '/member'
  
  res.render('login')
}

// 处理登录请求
exports.login = (req, res, next) => {
  const body = req.body
  Promise.resolve()
    .then(() => {
      // 非空校验
      if (!(body.username && body.password && body.captcha)) {
        throw createError(400, '提交信息不完整!')
      }
      // 校验 验证码
      if (body.captcha != req.session.captcha) {
        throw createError(400, '验证码错误!')
      }
      // 校验 账号 和 密码
      return accountModel.login(body.username, body.password)
    })
    .then(user => {
      if (!(user && user.id)) {
        // 账号或密码 不匹配
        throw createError(400, user.message)
      }
      // 验证通过 下发 session
      req.session.user = user
      // 判断是否勾选自动登录
      if (body.auto == 1) {
        const autoCookie = {
          uid: user.id,
          upwd: user.password
        }
        const expires = new Date(Date.now() + config.cookie.auto_login_expires)
        res.cookie(config.cookie.auto_login_key, JSON.stringify(autoCookie), {
          expires
        })
      }
      // 合并购物车
      const cookieJson = req.cookies[config.cookie.cart_key] || "[]"
      const cookieArr = JSON.parse(cookieJson)
      const axiosArr = cookieArr.map(item => cartModel.add(user.id, item.id, item.amount))
      return Promise.all(axiosArr)
    })
    .then(() => {
      // 往账户 合并购物车 成功
      // 清除 购物车 cookie
      res.clearCookie(config.cookie.cart_key)
      // 清除 验证码答案 session
      req.session.captcha = null
      // 重定向到 returnUrl
      res.redirect(body.returnUrl || '/member')
    })
    .catch(err => {
      // 统一处理登录失败的错误
      if (err.status != 400) {
        res.locals.errMessage = '请重新输入'
      } else {
        res.locals.errMessage = err.message
      }
      const captcha = svgCaptcha.createMathExpr({
        width: 120,
        height: 35,
        fontSize: 34
      })
      // 把验证码答案 放进用户的 session
      req.session.captcha = captcha.text
      // 把验证码图片 放入模板
      res.locals.captcha = captcha.data
      res.render('login')
    })

}

// 退出
exports.logout = (req, res, next) => {
  req.session.user = null
  res.redirect('/login')
}