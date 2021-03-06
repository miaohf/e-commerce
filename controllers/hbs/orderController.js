const orderService = require('../../services/orderService.js')
const userService = require('../../services/userService.js')

const orderController = {

  getNewebPayment: async (req, res) => {
    try {
      await orderService.getPayment(req, res, (data) => {
        let paymentInfo
        let order
        if (data['status'] == 'success') {
          paymentInfo = {
            id: data.content['MerchantID'],
            info: data.content['TradeInfo'],
            sha: data.content['TradeSha'],
            payGateWay: data.content['PayGateWay'],
            version: data.content['Version'],
            orderNo: data.content['MerchantOrderNo'],
            order: data['order']
          }
          order = paymentInfo.order
          res.render('ordersNewebPayment', { paymentInfo: paymentInfo, order: order })
        } else {
          req.flash('error_messages', '取得藍新金流付款資訊失敗')
          return res.redirect('back')
        }
      })
    }
    catch (err) {
      console.log(`Err: ${err}`)
      return res.redirect('back')
    }
  },

  newebpayCallback: async (req, res) => {
    await orderService.newebpayCallback(req, res, (data) => {
      try {
        if (data['status'] == 'success') {
          req.flash('success_messages', '付款成功！')
          return res.redirect('/orders/payment')
        } else {
          req.flash('error_messages', '付款失敗，請重新付款')
          return res.redirect('/accounts/orders')
        }
      }
      catch (err) {
        console.log(`Err: ${err}`)
        return res.redirect('/accounts/orders')
      }
    })
  },

  getStripePayment: async (req, res) => {
    try {
      await orderService.getPayment(req, res, (data) => {
        let order
        if (data['status'] == 'success') {
          order = data['order']
          return res.render('ordersStripePayment', { order: order })
        } else {
          req.flash('error_messages', '取得 Stripe 付款資訊失敗')
          return res.redirect('back')
        }
      })
    }
    catch (err) {
      console.log(`Err: ${err}`)
      return res.redirect('back')
    }
  },

  postStripePayment: async (req, res) => {
    await orderService.postStripePayment(req, res, (data) => {
      try {
        if (data['status'] == 'success') {
          req.flash('success_messages', '付款成功！')
          return res.redirect('/orders/payment')
        } else {
          req.flash('error_messages', '付款失敗，請重新付款')
          return res.redirect('/accounts/orders')
        }
      }
      catch (err) {
        console.log(`Err: ${err}`)
        return res.redirect('/accounts/orders')
      }
    })
  },

  postOrder: async (req, res) => {
    await orderService.postOrder(req, res, (data) => {
      try {
        if (data['status'] === 'success') {
          let order = data.content[0]

          // 使用不同金流
          if (req.body.paymentMethod === 'stripe') {
            return res.redirect(`/orders/${order.id}/stripePayment`)
          } else if (req.body.paymentMethod === 'newebpay') {
            return res.redirect(`/orders/${order.id}/newebPayment`)
          } else {
            return res.redirect(`/accounts/orders/${order.id}`)
          }
        } else {
          req.flash('error_messages', data['message'])
          return res.redirect('back')
        }
      }
      catch (err) {
        console.log(`Err: ${err}`)
        return res.redirect('back')
      }
    })
  }
}

module.exports = orderController