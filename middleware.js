/* 

  此模块用来 写自定义中间件

*/

const config = require('./config')
const categoryModel = require('./models/category')

exports.global = (req, res, next) => {
  // seo 相关信息
  res.locals.site = config.site
  // 全局挂载 user
  if (req.session.user) {
    res.locals.user = req.session.user
  }
  // 获取侧边分类导航 树状数据
  // 判断 缓存中是否有数据
  if (!req.app.locals.category) {
    // 没有缓存
    categoryModel.getCategoryTree()
      .then(data => {
        // 将新数据挂载在全局对象上 页面可以使用
        res.locals.category = data
        // 并且 缓存起来 (将数据放在变量中,而变量存在缓存中,程序运行时,一直存在,程序关闭则销毁)
        req.app.locals.category = data
        next()
      })
      .catch(err => next(err))
  } else {
    // 缓存中 有数据
    res.locals.category = req.app.locals.category
    next()
  }
}