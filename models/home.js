// 导入已经配置好的 axios
const axios = require('./api')

// 导出一个 获取轮播图相关数据 的方法
exports.getSlider = () => {
  return axios.get('settings/home_slides')
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}