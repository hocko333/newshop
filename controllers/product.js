/* 

  此模块处理 产品相关数据 具体业务

*/
const qs = require('querystring')

const productModel = require('../models/product')
const categoryModel = require('../models/category')
const pagination = require('../utils/pagination')

// 产品列表相关的路由
exports.list = (req, res, next) => {
  // 获取 URL 参数
  const cateId = req.params.id
  const catePage = req.query.page || 1
  const size = req.query.size || 5
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
      res.locals.pagination = pagination({
        catePage,
        totalPage: results[0].totalPage,
        req
      })
      res.render('list')
    })
    .catch(err => next(err))
}

// Get the list by searching.
exports.search = (req, res, next) => {
  const {
    q,
    page = 1,
    sort = 'commend'
  } = req.query
  const catePage = page
  const size = req.query.size || 5
  productModel.getSearchProducts(qs.escape(q), page, size, sort)
    .then(data => {
      res.locals.list = data.list
      res.locals.sort = sort
      res.locals.q = q
      res.locals.pagination = pagination({
        catePage,
        totalPage: data.totalPage,
        req
      })
      res.render('list')
    })
    .catch(err => next(err))
}

// 产品详情页
exports.item = (req, res, next) => {
  const id = req.params.id
  Promise.all([
      productModel.getProduct(id, false),
      productModel.getLikeProducts(5)
    ])
    .then(results => {
      res.locals.detail = results[0]
      res.locals.like = results[1]
      res.render('item')
    })
    .catch(err => next(err))
}