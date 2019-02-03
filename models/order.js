/* 

  订单相关 数据模型

*/

const axios = require('./api')
// 添加订单
exports.add = (user_id, items) => {
  return axios.post('orders', {
      user_id,
      items
    })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

// 获取一条订单信息
exports.find = (num) => {
  return axios.get(`orders/${num}`)
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

// 获取用户所有订单
exports.allOrder = (id) => {
  return axios.get('orders?user_id=' + id)
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

exports.paySuccess = (num, pay_status, send_status, trade_no) => {
  const express_address = '汪磊 安徽省宣城市宣州区向阳镇街道409号 13288889999 242052'

  return axios.patch(`orders/${num}`, {
    pay_status,
    send_status,
    trade_no,
    express_address
  })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}