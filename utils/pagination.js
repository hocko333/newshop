const template = require('art-template')
const path = require('path')
const url = require('url')

/**
 * @description: 用来处理分页逻辑
 * @param {Object} options 以一个对象的形式传入实参  
 * @return: 生成分页的 HTML
 */
module.exports = (options) => {
  const {
    catePage = 1, showBtn = 5, totalPage, req
  } = options

  // 将请求体中的 url 解析为 url对象
  const urlObj = url.parse(req.url, true)

  function getOriginUrl(catePage) {
    urlObj.query.page = catePage
    urlObj.search = undefined
    return url.format(urlObj)
  }

  let begin = catePage - Math.floor(showBtn / 2)
  begin = begin < 1 ? 1 : begin
  let end = begin + showBtn - 1
  end = end > totalPage ? totalPage : end
  begin = end - showBtn + 1
  begin = begin < 1 ? 1 : begin

  const templateUrl = path.join(__dirname, '../views/component/pagination.art')

  return template(templateUrl, {
    catePage,
    totalPage,
    getOriginUrl,
    begin,
    end,
    query: req.query
  })
}