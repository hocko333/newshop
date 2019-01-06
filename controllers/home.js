/* 

  此模块用来处理 主页相关 路由 具体业务

*/

const homeModel = require('../models/home')
const producModel = require('../models/product')


exports.index = (req, res, next) => {
  // 拿到轮播图数据 放入 locals
  // homeModel.getSlider()
  // .then(data => {
  //   // 拿到数据
  //   res.locals.slider = data
  //   // 响应 home 页面
  //   res.render('home')
  // })
  // .catch(err => next(err))

  // producModel.getLikeProducts()
  //   .then(data => res.json(data))
  //   .catch(err => next(err))
  
  Promise.all([homeModel.getSlider(), producModel.getLikeProducts()])
    .then(results => {
      res.locals.slider = results[0]
      res.locals.like = results[1]
      res.render('home')
    })
    .catch(err => next(err))
}

exports.like = (req, res, next) => {
  producModel.getLikeProducts()
    .then(data => res.send(data))
    .catch(err => next(err))
}