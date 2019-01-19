/* 

  订单相关 数据模型

*/

const axios = require('./api')

exports.add = (user_id, items) => {
  return axios.post('orders', {user_id, items})
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

exports.find = (num) => {
  return axios.get(`orders/${num}`)
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}