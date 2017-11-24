//app.js
var config = require('pages/common/config.js');
var util = require('utils/util.js');

App({
  onLaunch: function () {
    var that = this;
    that.login();
    // 小程序初始化判断用户是否登录
    // wx.checkSession({
    //   success: function() {
    //     wx.getStorage({
    //       key: 'token',
    //       success: function(res) {
    //         var token = res.data;
    //         that.globalData.token = token;
    //       }
    //     })
    //   },
    //   fail: function() {
    //     //登录态过期
    //     that.login();
    //   }
    // })
  },

  login: function (callback) {
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          // 获取新的token
          util.req('&m=member&a=onLogin', { code: res.code }, function(data) {
            if (data.flag == 1) {
              that.setToken(data.reset.session3rd);
              that.setIsReg(data.reset.is_reg);
              console.log(callback)
              if (callback) {
                console.log(5)
                callback();
              }
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },

  // 注册
  registerUser: function(callback) {
    console.log(2)
    var that = this;
    wx.login({
      success: function(res) {
        wx.getUserInfo({
          success: function (userinfo) {
            var item = {
              "code": res.code,
              "encryptedData": userinfo.encryptedData,
              "iv": userinfo.iv
            };
            util.req('&m=member&a=onReg', item, function (data) {
              if (data.flag == 1) {
                console.log(3)
                that.login(callback);
              } else {
                that.loginFail();
              }
            })
          },
          fail: function (res) {
            that.loginFail();
          }
        })
      }
    })
  },

  repeatLogin: function (userinfo, callback) {
    var that = this;
    wx.login({
      success: function(res) {
        var item = {
          "code": res.code,
          "encryptedData": userinfo.encryptedData,
          "iv": userinfo.iv
        };
        wx.showLoading({
          title: '客观请稍等',
        })
        util.req('&m=member&a=onLogin', item, function(data) {
          if (data.flag == 1) {
            that.setToken(data.reset.session3rd);
            callback();
          } else {
            that.loginFail();
          }
          wx.hideLoading()
        })
      }
    })
  },

  loginFail: function () {
    var that = this;
    wx.showModal({
      content: '登录失败，您现在处于游客状态',
    });
  },

  setToken: function (data) {
    this.globalData.token = data;
    wx.setStorage({
      key: "token",
      data: data
    })
  },

  setIsReg: function (data) {
    this.globalData.is_reg = data;
  },

  globalData: {
    userInfo: null,
    token: null,
    is_reg: null
  }
})