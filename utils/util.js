var config = require('../pages/common/config.js');
var token = wx.getStorageSync('token');

function req(url, data, cb) {
  // data.token = token;
  wx.request({
    url: config.configUrl + url,
    data: data,
    method: 'post',
    header: { 'Content-Type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      return typeof cb == "function" && cb(res.data)
    },
    fail: function (res) {
      this.errorTips(res.data.msg);
      return typeof cb == "function" && cb(false)
    }
  })
}

function getReq(url, data, cb) {
  // data.token = token;
  wx.request({
    url: config.configUrl + url,
    data: data,
    method: 'get',
    header: { 'Content-Type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
}  

function errorTips(data) {
  wx.showModal({
    content: data,
    confirmText: '我知道了'
  })
}

module.exports = {
  req: req,
  getReq: getReq,
  errorTips: errorTips,
}  