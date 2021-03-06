const cartService = require('../../services/cartService.js')

const cartController = {

  getCart: (req, res) => {
    cartService.getCart(req, res, (data) => {
      return res.json(data)
    })
  },

  postCart: (req, res) => {
    cartService.postCart(req, res, (data) => {
      return res.json(data)
    })
  },

  addCartItem: (req, res) => {
    cartService.addCartItem(req, res, (data) => {
      return res.json(data)
    })
  },

  subCartItem: (req, res) => {
    cartService.subCartItem(req, res, (data) => {
      return res.json(data)
    })
  },

  deleteCartItem: (req, res) => {
    cartService.deleteCartItem(req, res, (data) => {
      return res.json(data)
    })
  },

  addCoupon: (req, res) => {
    cartService.addCoupon(req, res, (data) => {
      return res.json(data)
    })
  },

  removeCoupon: (req, res) => {
    cartService.removeCoupon(req, res, (data) => {
      return res.json(data)
    })
  },
}

module.exports = cartController