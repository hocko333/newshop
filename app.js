// 导入 核心模块
const path = require('path')

// 导入 第三方模块
const express = require('express')
const app = express()
const Youch = require('youch')
const bodyParser = require('body-parser')
const expressTpl = require('express-art-template')
const createError = require('http-errors')
const morgan = require('morgan')
const favicon = require('express-favicon')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)

// 导入 自定义模块
const router = require('./router')
const middleware = require('./middleware')
const config = require('./config')

/* 
  配置区
*/

// 配置 express-favicon
app.use(favicon(path.join(__dirname, 'favicon.ico')))
// 配置 日志信息
app.use(morgan('dev'))
// 配置 express-art-template
app.engine('art', expressTpl)
app.set('view engine', 'art')
app.set('view options', {
  debug: process.env.NODE_ENV !== 'production'
})
// 配置 body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// 配置 静态资源
app.use('/public', express.static(path.join(__dirname, 'public')))
// 配置 session 持久化中间件
const sessionStore = new MySQLStore(config.mysqlSession)
app.use(session({
  key: 'PYGSID',
  secret: 'pyg_session_secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: true
}))
// 配置 cookie-parser
app.use(cookieParser())

// 挂载自定义中间件
app.use(middleware.global)

// 挂载路由
app.use(router)

// 其他没处理的路径
app.use((req, res, next) => {
  next(createError(404, 'Not Found'))
})

// 统一处理错误
app.use((err, req, res, next) => {
  // 获取环境变量 判断环境变量
  const env = req.app.get('env')
  if (env === 'development') {
    // 开发环境
    return new Youch(err, req).toHTML().then(html => res.send(html))
  }
  // 生产环境
  res.locals.status = err.status === 404 ? 404 : 500
  res.render('error')
})


// 监听 3010 端口
app.listen(3010, () => console.log('Sever is running at port 3010.'))