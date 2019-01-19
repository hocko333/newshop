/* 

  购物车相关 数据模型

*/
const axios = require('./api')

// 往账户购物车 添加商品
exports.add = (uid, proId, amount) => {
  return axios.post(`users/${uid}/cart`, {id: proId, amount})
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

// 查询账户购物车
exports.find = (id) => {
  return axios.get(`users/${id}/cart`)
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

// 修改账户购物车数量
exports.edit = (uId, proId, amount) => {
  return axios.patch(`users/${uId}/cart/${proId}`, {amount})
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

// 删除账户里一个购物车记录
exports.delete = (uId, proId) => {
  return axios.delete(`users/${uId}/cart/${proId}`)
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}