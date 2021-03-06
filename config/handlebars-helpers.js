const moment = require('moment')

module.exports = {

  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },

  ifCondNum: function (a, b, options) {
    if (Number(a) === Number(b)) {
      return options.fn(this)
    }
    return options.inverse(this)
  },

  moment: function (a) {
    return moment(a).fromNow()
  },

  momentFormat: function (a) {
    return moment(a).format('YYYY-MM-DD')
  },

  momentYYYYMMDD: function (a) {
    return moment(a).format('YYYY-MM-DD')
  },

  momentYYYYMMDDHHmmss: function (a) {
    return moment(a).tz("Asia/Taipei").format('YYYY-MM-DD HH:mm:ss')
  },

  NTDtoSGD: function (a) {
    return parseFloat(a / 22).toFixed(2)
  },

}