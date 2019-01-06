/* 

  此模块处理 分类相关数据

*/

const axios = require('./api')

// 获取 侧边导航树状结构数据
exports.getCategoryTree = () => {
  return axios.get('categories?format=tree')
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

// 获取分类的 上级 和 上上级
exports.getCateParent = (cateId) => {
  return axios.get(`categories/${cateId}?include=parent`)
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}