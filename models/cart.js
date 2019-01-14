/* 

  购物车相关 数据模型

*/
const axios = require('./api')

exports.add = (uid, proId, amount) => {
  return axios.post(`users/${uid}/cart`, {id: proId, amount})
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}