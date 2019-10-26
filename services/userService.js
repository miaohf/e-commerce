const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const moment = require('moment')
const passport = require('passport')
const sendEmailService = require('./sendEmailService')
const signUpValidEmailService = require('./signUpValidEmailService')

const db = require('../models')
const { User, Product, Order, Coupon, CouponDistribution, Review, PageView } = db

const userService = {

  checkUserField: (data) => {
    const name = data.name === undefined ? '' : data.name.trim()
    const phone = data.phone === undefined ? '' : data.phone.trim()
    const address = data.address === undefined ? '' : data.address.trim()
    const birthday = data.birthday === undefined ? '' : data.birthday.trim()

    if (birthday.length !== 0 && moment(birthday, 'YYYY-MM-DD', true).isValid()) {
      if (moment(birthday).isAfter(new Date())) {
        return ({ status: 'error', message: 'birthday 請輸入今日以前日期' })
      }
    } else if (birthday.length !== 0 && !moment(birthday, 'YYYY-MM-DD', true).isValid()) {
      return ({ status: 'error', message: 'birthday 請輸入正確的日期格式 YYYY-MM-DD' })
    }
    return ({ status: 'success', message: 'User 欄位確認正確' })
  },

  signIn: async (req, res, callback) => {

    try {
      const email = req.body.email === undefined ? '' : req.body.email.trim()
      const password = req.body.password === undefined ? '' : req.body.password.trim()

      if (email.length == 0 || password.length == 0) {
        return callback({ status: 'error', message: '請輸入登入資訊 !' })
      }

      if (!validator.isEmail(email)) {
        return callback({ status: 'error', message: '請輸入正確的 email !' })
      }

      const user = await User.findOne({
        where: {
          email: email,
          isValid: true
        }
      })

      if (!user) return res.status(401).json({ status: 'error', message: '使用者不存在，或尚未通過信箱驗證' })
      if (!bcrypt.compareSync(password, user.password)) {
        return callback({ status: 'error', message: '密碼不正確' })
      }

      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)

      req.session.user = user

      return callback({
        status: 'success', message: '登入成功', token, user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      })
    }
    catch (err) {
      return callback({ status: 'error', message: '使用者登入失敗', content: err })
    }

  },

  signUp: (req, res, callback) => {

    const name = req.body.name === undefined ? '' : req.body.name.trim()
    const email = req.body.email === undefined ? '' : req.body.email.trim()
    const password = req.body.password === undefined ? '' : req.body.password.trim()
    const passwordCheck = req.body.passwordCheck === undefined ? '' : req.body.passwordCheck.trim()
    const phone = req.body.phone === undefined ? '' : req.body.phone.trim()
    const address = req.body.address === undefined ? '' : req.body.address.trim()
    const birthday = req.body.birthday === undefined ? '' : req.body.birthday.trim()

    if (name.length == 0 ||
      email.length == 0 ||
      password.length == 0 ||
      passwordCheck.length == 0 ||
      phone.length == 0 ||
      address.length == 0 ||
      birthday.length == 0) {
      return callback({ status: 'error', message: '請使用者輸入相關註冊資訊！' })
    } else {
      if (!validator.isEmail(email)) {
        return callback({ status: 'error', message: '請輸入正確的 email !' })
      }

      if (!moment(birthday, 'YYYY-MM-DD', true).isValid()) {
        return callback({ status: 'error', message: '請輸入正確的格式，birthday 為日期格式' })
      }

      // Confirm password
      if (passwordCheck !== password) {
        return callback({ status: 'error', message: '兩次密碼輸入不同！' })
      } else {

        User.findOne({
          where: {
            email
          }
        }).then((user) => {
          if (user) {
            const diffSecondTime = moment(new Date()).diff(moment(user.updatedAt), 'seconds')
            if (user.isValid) {
              // 代表此 email 已經註冊過且已通過 email 認證
              return callback({ status: 'error', message: '此 email 已重複！' })
            } else if (user && !user.isValid && diffSecondTime <= 300) {
              // 代表此 email 已經註冊過、尚未通過 email 認證、信件連結還在時效內
              return callback({ status: 'error', message: '請使用者透過信件中的連結來激活 email 帳號！' })
            } else if (!user.isValid && diffSecondTime > 300) {
              // 代表此 email 已經註冊過、尚未通過 email 認證、連結時效已過期
              user.destroy()
                .then((user) => {
                  User.create({
                    name,
                    email,
                    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
                    phone,
                    address,
                    birthday
                  }).then(async user => {
                    let promises = await signUpValidEmailService.setEmailLinkKey(email)
                    return callback(promises)
                  })
                })
            }

          } else {
            // 不存在於 Users Table 
            User.create({
              name,
              email,
              password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
              phone,
              address,
              birthday
            }).then(async user => {
              let promises = await signUpValidEmailService.setEmailLinkKey(email)
              return callback(promises)
            })
          }


        })

      }
    }

  },

  checkEmail: async (req, res, callback) => {
    try {
      return callback(await signUpValidEmailService.checkEmailLink(req.params.token))
    } catch (err) {
      return callback({ status: 'error', message: 'email 認證錯誤' })
    }
  },

  getProfile: (req, res, callback) => {
    try {
      return User.findAll({
        where: {
          id: req.user.id
        },
        include: [
          Review,
          { model: Product, as: "productLiked" },
          { model: Product, as: "productViewed" },
          { model: Product, as: "productReviewed" },
        ]
      }).then(result => {
        let user = result[0]

        // 將有瀏覽過的商品，加入是否 like 過的紀錄
        user.productViewed = user.productViewed.map(r => ({
          ...r,
          isLiked: user.productLiked.map(d => d.id).includes(r.id)
        }))

        return callback({ status: 'success', message: '取得使用者頁面成功', content: user })
      }).catch(err => {
        return callback({ status: 'error', message: '無法取得使用者頁面' })
      })
    }
    catch (err) {
      return callback({ status: 'error', message: '無法取得使用者頁面' })
    }
  },

  putProfile: (req, res, callback) => {

    try {
      const userFieldCheckResult = userService.checkUserField(req.body)
      if (userFieldCheckResult.status === 'success') {
        return User.findByPk(req.user.id)
          .then((user) => {
            if (!user) {
              return callback({ status: 'error', message: '使用者不存在' })
            }
            user.update({
              name: req.body.name,
              phone: req.body.phone,
              address: req.body.address,
              birthday: req.body.birthday,
            }).then((user) => {
              return callback({ status: 'success', message: '使用者資料更新成功!' })
            })
          })
      } else {
        return callback(userFieldCheckResult)
      }
    }
    catch (err) {
      return callback({ status: 'error', message: '無法更新使用者資料' })
    }
  },

  getOrders: (req, res, callback) => {
    try {
      Order.findAll({
        where: {
          UserId: req.user.id
        },
        order: [['updatedAt', 'DESC']],
      }).then(orders => {
        return callback({ status: 'success', message: '成功取得訂單清單', content: orders })
      }).catch(err => {
        return callback({ status: 'error', message: '無法取得訂單清單' })
      })
    }
    catch (err) {
      return callback({ status: 'error', message: '無法取得訂單清單' })
    }
  },

  getOrder: (req, res, callback) => {
    try {
      Order.findAll({
        where: {
          UserId: req.user.id,
          id: req.params.order_id
        }
      }).then(result => {
        let order = result[0]
        if (order) {
          return callback({ status: 'success', message: '成功取得單筆訂單資料', content: order })
        } else {
          return callback({ status: 'error', message: '無法取得單筆訂單資料' })
        }
      }).catch(err => {
        return callback({ status: 'error', message: '無法取得單筆訂單資料' })
      })
    }
    catch (err) {
      return callback({ status: 'error', message: '無法取得單筆訂單資料' })
    }
  },

  cancelOrder: (req, res, callback) => {
    try {
      Order.findAll({
        where: {
          UserId: req.user.id,
          id: req.params.order_id,
          dataStatus: 1
        }
      }).then(result => {
        let order = result[0]
        order.update({
          dataStatus: 0
        }).then(order => {

          // 發送訂單取消通知信件
          let email = req.user.email
          let subject = `AJA Online Store: 訂單已取消（編號: ${order.sn}）`
          let type = 'text'
          let info = `您已取消您的訂單（編號: ${order.sn}）`
          sendEmailService.mailInfo({ email, subject, type, info })

          return callback({ status: 'success', message: '成功取消該筆訂單' })
        }).catch(err => {
          return callback({ status: 'error', message: '取消訂單失敗' })
        })
      }).catch(err => {
        return callback({ status: 'error', message: '取消訂單失敗' })
      })
    }
    catch (err) {
      return callback({ status: 'error', message: '取消訂單失敗' })
    }
  },

  getCoupons: (req, res, callback) => {
    try {
      return User.findAll({
        where: {
          id: req.user.id
        },
        include: [
          CouponDistribution,
          { model: Coupon, as: "couponsOwned" },
        ],
      }).then(result => {
        let coupons = result[0].couponsOwned
        if (coupons.length === 0) {
          return callback({ status: 'success', message: '成功取得資料，該使用者目前沒有 coupon', content: coupons })
        } else {
          return callback({ status: 'success', message: '成功取得 coupons', content: coupons })
        }
      }).catch(err => {
        return callback({ status: 'error', message: '無法取得 coupons' })
      })
    }
    catch (err) {
      return callback({ status: 'error', message: '無法取得 coupons' })
    }
  },

  getCurrentUser: (req, res, callback) => {

    try {
      if (req.user) {
        let user = req.user
        user.password = null
        return callback({ status: 'success', message: '取得當前使用者資料成功', content: user })
      } else {
        return callback({ status: 'success', message: '使用者尚未登入' })
      }
    }
    catch (err) {
      return callback({ status: 'error', message: '取得當前使用者資料失敗' })
    }
  },

  logout: (req, res, callback) => {
    req.logout()
    req.session.user = null
    return callback({ status: 'success', message: '成功登出' })
  },

  getFacebook: (req, res, callback) => {
    return callback({ status: 'success', message: '使用 Facebook 登入中' })
  },

  getFacebookCallback: (req, res, callback) => {
    try {
      passport.authenticate('facebook', function (err, user, info) {
        if (err || !user) { return callback({ status: 'error', message: err }) }

        req.logIn(user, function (err) {

          if (err) { return callback({ status: 'error', message: err }) }
          // 產生 token
          const payload = { id: user.id }
          const token = jwt.sign(payload, process.env.JWT_SECRET)

          return callback({
            status: 'success',
            message: '使用 Facebook 登入成功',
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
            }
          })
        })
      })(req, res, callback);
    }
    catch (err) {
      return callback({ status: 'error', message: '使用 Facebook 登入失敗' })
    }
  },

  getViewHistory: (req, res, callback) => {
    console.log('getViewHistory')
    try {
      return PageView.findAll({
        where: {
          UserId: req.user.id
        },
        order: [['updatedAt', 'DESC']],
        include: [Product]
      }).then(pageViews => {
        return callback({ status: 'success', message: '取得使用者商品瀏覽紀錄成功', content: pageViews })
      }).catch(err => {
        return callback({ status: 'success', message: '取得使用者商品瀏覽紀錄失敗', content: err })
      })
    }
    catch (err) {
      return callback({ status: 'success', message: '取得使用者商品瀏覽紀錄失敗', content: err })
    }
  }
}

module.exports = userService  