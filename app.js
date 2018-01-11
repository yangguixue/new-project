//app.js
var config = require('pages/common/config.js');
var util = require('utils/util.js');
var QQMapWX = require('utils/qqmap-wx-jssdk.js');
var qqmapsdk;

qqmapsdk = new QQMapWX({
  key: 'AAOBZ-DK53W-TSBR3-ONY3L-474I3-CMFGU'
});

App({
  onLaunch: function (options) {
    var that = this;
    wx.setStorageSync('isShowAddDesk', true);
    wx.setStorageSync('isShowZan', true);
    wx.login({
      success: function (res) {
        if (res.code) {
          // 获取新的token
          util.req('&m=member&a=onLogin', { code: res.code }, function (data) {
            if (data.flag == 1) {
              wx.removeStorageSync('token');
              that.setToken(data.reset.session3rd);
              that.setIsReg(data.reset.is_reg);

              //是否有新消息
              util.req('&m=member&a=isUnread', {
                session3rd: data.reset.session3rd
              }, function (data) {
                if (data.flag == 1 && data.unread_num > 0) {
                  that.globalData.hasUnread = true;
                } else {
                  that.globalData.hasUnread = false;
                }

                if (that.isUnreadReadyCallback) {
                  that.isUnreadReadyCallback(that.globalData.hasUnread)
                }
              })

              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(data)
              }

              wx.hideLoading();
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })

    //用户通过卡片点击
    console.log(options)
    if (options.query.userId) {
      console.log(options.query.userId)
      wx.setStorageSync('from_user', options.query.userId);
    }

    // 获取地理位置
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            that.globalData.address = res.result;
            if (that.isAddressReadyCallback) {
              that.isAddressReadyCallback(that.globalData.address)
            }
          },
          fail: function (res) {
          },
          complete: function (res) {
          }
        });
      }
    })
  },

  login: function () {
    var that = this;
    wx.showLoading({
      title: '请稍等...',
    })
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

                if (that.userInfoReadyCallback) {
                  that.userInfoReadyCallback(data)
                }

                wx.hideLoading();
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
    var from_user = wx.getStorageSync('from_user');
    console.log(from_user)
    return new Promise(function(resolve, reject) {
      wx.login({
        success: function (res) {
          var item = { 
            "code": res.code,
            "encryptedData": userInfo.encryptedData,
            "iv": userInfo.iv
          };

          if (from_user) {
            item.token = from_user;
          }

          console.log(item)
          
          util.req('&m=member&a=onReg', item, function (data) {
            console.log(data)
            if (data.flag == 1) {
              resolve();
            } else {
              console.log(1)
              that.loginFail();
            }
          })
        },
        fail: function (res) {
          console.log(2)
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
    wx.setStorage({
      key: "token",
      data: data
    })
  },

  setIsReg: function (data) {
    this.globalData.is_reg = data;
  },

  // 获取位置
  getLocation: function(that, lat, lng) {
    return new Promise(function(resolve, reject) {
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: lat,
          longitude: lng
        },
        coord_type: 5,
        get_poi: 1,
        success: function (res) {
          console.log(res);
          resolve(res);
        },
        fail: function (res) {
        },
        complete: function (res) {
        }
      });
    })
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
            util.req('&m=member&a=setRelationship', newItem, function(data) {
              if (data.flag == 1) {
                if (newItem.is_follow) {
                  newItem.fan_num = parseInt(newItem.fan_num) + 1;
                } else {
                  newItem.fan_num = parseInt(newItem.fan_num) - 1;
                }
                resolve(newItem);
              } else {
                wx.showToast({
                  title: data.msg,
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

  //分享小程序
  shareApp: function() {

  },

  globalData: {
    userInfo: null,
    token: null,
    is_reg: null,
    epage: 5,
    hasUnread: false,
    qqmapsdk,
    address: null
  }
})