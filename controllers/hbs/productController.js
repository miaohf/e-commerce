const productService = require('../../services/productService.js')

const productController = {

  getProducts: (req, res) => {
    productService.getProducts(req, res, (data) => {
      try {
        if (data['status'] === 'success') {
          req.flash('success_messages', data['message'])
          const num = 12
          const range = data.content.length - num
          const startNum = Math.floor(Math.random() * range)
          const randomProducts = data.content.slice(startNum, startNum + num)
          const keyword = req.query.keyword || ''

          return res.render('index', {
            products: data.content,
            randomProducts: randomProducts,
            carousels: data.carousels,
            categories: data.categories,
            keyword: keyword
          })
        } else {
          return req.flash('error_messages', data['message'])
        }
      }
      catch (err) {
        console.log(`Err: ${err}`)
        res.redirect('back')
      }
    })
  },

  getShop: (req, res) => {
    productService.getProducts(req, res, (data) => {
      try {
        if (data['status'] === 'success') {
          req.flash('success_messages', data['message'])

          const page = Number(req.query.page) || 1
          const category_id = Number(req.query.category_id) || ''
          const keyword = req.query.keyword || ''

          return res.render('shop', {
            products: data.content,
            categories: data.categories,
            category_id: category_id,
            page: page,
            totalPages: data.totalPages,
            prev: data.prev,
            next: data.next,
            keyword: keyword
          })
        } else {
          return req.flash('error_messages', data['message'])
        }
      }
      catch (err) {
        console.log(`Err: ${err}`)
        res.redirect('back')
      }
    })
  },

  getProduct: (req, res) => {
    productService.getProduct(req, res, (data) => {
      try {
        if (data['status'] === 'success') {
          req.flash('success_messages', data['message'])
          return res.render('productDetail', {
            product: data.content
          })
        } else {
          return req.flash('error_messages', data['message'])
        }
      }
      catch (err) {
        console.log(`Err: ${err}`)
        res.redirect('back')
      }
    })
  },

  unlikeProduct: async (req, res) => {
    await productService.unlikeProduct(req, res, (data) => {
      try {
        if (data['status'] == 'success') {
          req.flash('success_messages', "成功將商品移出 wishlist")
          res.redirect('back')
        }
      }
      catch (err) {
        console.log(`Err: ${err}`)
        req.flash('error_messages', "無法將商品移出 wishlist")
        res.redirect('back')
      }
    })
  },

  deleteReview: async (req, res) => {
    await productService.deleteReview(req, res, (data) => {
      try {
        if (data['status'] === 'success') {
          req.flash('success_messages', "成功刪除評論")
          res.redirect('back')
        } else {
          req.flash('error_messages', "刪除評論失敗")
          res.redirect('back')
        }
      }
      catch (err) {
        console.log(`Err: ${err}`)
        req.flash('error_messages', "刪除評論失敗")
        res.redirect('back')
      }
    })
  },
}

module.exports = productController