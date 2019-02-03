const path = require('path')
const Alipay = require('alipay-node-sdk')
 
const ali = new Alipay({
  appId: '2016092300579138',
  notifyUrl: 'http://localhost:3010/pay/notify',
  rsaPrivate: path.join(__dirname, './rsa_private_key.pem'),
  rsaPublic: path.join(__dirname, './rsa_public_key.pem'),
  sandbox: true,
  signType: 'RSA2'
})

exports.getAliUrl = (order) => {
  const params = ali.pagePay({
    subject: '品优购_电商网站',
    body: order.products.map(item => item.name).join('\n'),
    outTradeId: order.order_number,
    timeout: '10m',
    amount: order.total_price,
    goodsType: '1',
    qrPayMode: 2,
    return_url: 'http://127.0.0.1:3010/pay/callback'
  })
  return 'https://openapi.alipaydev.com/gateway.do?' + params
}
