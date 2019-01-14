/* 

  此模块处理 产品相关数据
  
*/

const axios = require('./api')

// 猜你喜欢的数据
exports.getLikeProducts = (limit = 6) => {
  return axios.get(`products?type=like&limit=${limit}`)
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

/**
 * @description: 获取指定 ID 的单个分类下的商品列表
 * @param {Number} cateId 通过当前页面的 ID 获取对应的分类数据
 * @param {Number} catePage 当前页面的页码
 * @param {Number} size 一页显示几条 默认十条
 * @param {String} cateSort 排序规则 commend(默认) / quantity / market_time / price / -price（可选）
 * @return: 返回一个 获取商品列表的 Promise 对象
 */
exports.getCateProducts = (cateId, catePage, size, cateSort) => {
  const url = `categories/${cateId}/products?page=${catePage}&per_page=${size}&sort=${cateSort}`
  return axios.get(url)
    .then(res => ({
      list: res.data,
      totalPage: res.headers['x-total-pages']
    }))
    .catch(err => Promise.reject(err))
}

exports.getSearchProducts = (q, page, size, sort) => {
  const url = `products?q=${q}&page=${page}&per_page=${size}&sort=${sort}`
  return axios.get(url)
    .then(res => ({
      list: res.data,
      totalPage: res.headers['x-total-pages']
    }))
    .catch(err => Promise.reject(err))
}

exports.getProduct = (id, isBasic) => {
  const url = `products/${id}?` + (isBasic ? '' : `include=introduce,category,pictures`)
  return axios.get(url)
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}