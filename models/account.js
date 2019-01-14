/* 

  此模块处理 账户相关数据

*/
const axios = require('./api')

exports.login = (username, password) => {
  return axios.post('users/login', {username, password})
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}