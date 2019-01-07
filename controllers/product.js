/* 

  此模块处理 产品相关数据 具体业务

*/

const productModel = require('../models/product')
const categoryModel = require('../models/category')
const pagination = require('../utils/pagination')

// 产品相关的路由
exports.list = (req, res, next) => {
  // 获取 URL 参数
  const cateId = req.params.id
  const catePage = req.query.page || 1
  const size = req.query.per_page || 5
  const cateSort = req.query.sort || 'commend'

  Promise.all([
    productModel.getCateProducts(cateId, catePage, size, cateSort),
    categoryModel.getCateParent(cateId)
  ])
  .then(results => {
    res.locals.list = results[0].list
    res.locals.cate = results[1]
    res.locals.sort = cateSort
    // 挂载分页插件返回的 html
    res.locals.pagination = pagination({catePage, totalPage: results[0].totalPage, req})
    
    res.render('list')
    // res.json(res.locals)
  })
  .catch(err => next(err))
}

