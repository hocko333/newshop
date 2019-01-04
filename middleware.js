/* 

  此模块用来 写自定义中间件

*/

const config = require('./config')

exports.global = (req, res, next) => {
  res.locals.site = config.site
  next()
}