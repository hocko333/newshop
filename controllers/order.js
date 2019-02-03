/* 

  订单相关 具体业务处理

*/

const orderModel = require('../models/order')

// 创建订单的路由
exports.create = (req, res, next) => {
  const { ids } = req.query
  orderModel.add(req.session.user.id, ids)
    .then(data => {
      // 订单创建成功 重定向到生成订单页面的路由
      res.redirect('/order/checkout?num=' + data.order_number)
    })
    .catch(err => next(err))
}

// 创建订单的页面
exports.checkout = (req, res, next) => {
  const num = req.query.num
  orderModel.find(num)
    .then(data => {
      res.locals.order = data
      res.render('checkout')
    })
    .catch(err => next(err))
}

// 我的订单
exports.myOrder = (req, res, next) => {
  const id = req.params.id
  orderModel.allOrder(id)
    .then(data => {
      res.locals.orders = data
      res.render('member-order')
    })
    .catch(err => next(err))
}