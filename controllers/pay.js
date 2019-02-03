/* 

  支付的具体业务处理

*/
const orderModel = require('../models/order')
const alipay = require('../utils/alipay')

// 订单加密 并重定向到付款页面
exports.index = (req, res, next) => {
  const num = req.query.num
  orderModel.find(num)
    .then(order => {
      res.redirect(alipay.getAliUrl(order))
    })
    .catch(err => next(err))
}

// 用户支付成功之后 跳转的路由
exports.callback = (req, res, next) => {
  const out_trade_no = req.query.out_trade_no  // 商家交易流水
  const trade_no = req.query.trade_no  // 支付宝的交易流水
  orderModel.paySuccess(out_trade_no, 1, 0, trade_no)
    .then(order => {
      res.locals.order = order
      res.render('callback')
    })
    .catch(err => next(err))
}