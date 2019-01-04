/* 

  此模块用来处理 主页相关 路由 具体业务

*/

const homeModel = require('../models/home')

exports.index = (req, res, next) => {
  // 拿到轮播图数据 放入 locals
  homeModel.getSlider()
  .then(data => {
    // 拿到数据
    res.locals.slider = data
    // 响应 home 页面
    res.render('home')
  })
  .catch(err => next(err))
}