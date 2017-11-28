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

  login: function () {
    var that = this;
    return new Promise(function(resolve, reject){
      wx.login({
        success: function (res) {
          if (res.code) {
            // 获取新的token
            util.req('&m=member&a=onLogin', { code: res.code }, function (data) {
              if (data.flag == 1) {
                wx.removeStorageSync('token');
                that.setToken(data.reset.session3rd);
                that.setIsReg(data.reset.is_reg);
                resolve();
              }
            });
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      })
    })
  },

  // 注册
  registerUser: function(userInfo) {
    var that = this;
    return new Promise(function(resolve, reject) {
      wx.login({
        success: function (res) {
          var item = { 
            "code": res.code,
            "encryptedData": userInfo.encryptedData,
            "iv": userInfo.iv
          };
          util.req('&m=member&a=onReg', item, function (data) {
            if (data.flag == 1) {
              resolve();
            } else {
              that.loginFail();
            }
          })
        },
        fail: function (res) {
          that.loginFail();
        }
      })
    })
  },

  loginFail: function () {
    var that = this;
    wx.showModal({
      content: '登录失败，您现在处于游客状态',
    });
  },

  setToken: function (data) {
    var _this = this;
    _this.globalData.token = data;
    console.log(_this.globalData.token)
    wx.setStorage({
      key: "token",
      data: data
    })
  },

  setIsReg: function (data) {
    this.globalData.is_reg = data;
  },

  // 文章点赞，取消赞
  handleZan: function (content) {
    const that = this;
    const is_like = content.is_like;
    return new Promise(function (resolve, reject) {
      wx.showLoading({
        title: '稍等...',
      })

      util.req('&m=info&a=setLikeStatus', {
        id: content.id,
        action: !content.is_like,
        session3rd: that.globalData.token
      }, function (data) {
        if (data.flag == 1) {
          content['is_like'] = !is_like;
          if (!is_like) {
            content['post_like'] = content.post_like + 1;
          } else {
            content['post_like'] = content.post_like - 1;
          }
          // 回调函数
          resolve(content);
          wx.hideLoading()
        } else {
          wx.hideLoading()
          wx.showModal({
            content: data.msg,
          })
        }
      })
    });
  },

  // 收藏、取消收藏文章
  handleCollection: function (content) {
    const that = this;
    const is_star = content.is_star;
    const title = content.is_star ? '取消收藏成功' : '收藏成功';
    return new Promise(function (resolve, reject) {
      wx.showLoading({
        title: '稍等...',
      })
      util.req('&m=info&a=setStarStatus', {
        id: content.id,
        action: !content.is_star,
        session3rd: that.globalData.token
      }, function (data) {
        if (data.flag == 1) {
          content['is_star'] = !is_star;
          resolve(content);
          wx.hideLoading()
        } else {
          wx.hideLoading()
          wx.showModal({
            content: data.msg,
          })
        }
      })
    })
  },

  // 关注、取消关注某个用户
  handleFocus: function(item) {
    var that = this;
    var title = !item.is_follow ? '想关注我吗？' : '真的要取消关注吗？';
    var content = !item.is_follow ? '您真是太有眼光啦~' : '我辣么美~继续关注下噻~';
    var newItem = Object.assign({}, item);
    newItem.is_follow = !newItem.is_follow;
    newItem.session3rd = this.globalData.token;

    return new Promise(function (resolve, reject) {
      wx.showModal({
        title: title,
        content: content,
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: config.configUrl + '&m=member&a=setRelationship',
              data: newItem,
              success: function (res) {
                if (res.data.flag == 1) {
                  if (newItem.is_follow) {
                    newItem.fan_num = parseInt(newItem.fan_num) + 1;
                  } else {
                    newItem.fan_num = parseInt(newItem.fan_num) - 1;
                  }
                  resolve(newItem);
                }
              },
              fail: function (res) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'success',
                  duration: 2000
                })
              }
            })
          }
        }
      })
    })
  },

  // 加入、退出圈子
  joinCircle: function(item) {
    var that = this;
    return new Promise(function (resolve, reject) {
      var newItem = {
        status: !item.status,
        cg_id: item.cg_id,
        cg_name: item.name,
        session3rd: that.globalData.token,
      };
      util.req('&m=member&a=setCicleStatus', newItem, function (data) {
        if (data.flag == 1) {
          item.status = !item.status;
          resolve(item);
        } else {
          wx.showModal({
            content: data.msg,
          })
        }
      })
    })
  },

  globalData: {
    userInfo: null,
    token: null,
    is_reg: null
  }
})