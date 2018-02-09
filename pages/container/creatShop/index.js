// pages/container/creatShop/index.js
var util = require('../../../utils/util.js');
var config = require('../../common/config.js');
var app = getApp();

Page({
  data: {
    info: {
      is_new: false,
      is_brand: false,
      shop_property: true,
      start_time: '08:00',
      end_time: '20:00'
    },
    startTime: '08:00',  
    endTime: '20:00',  
    nature: ['实体店', '自主经营'],
    shop_pic_show: [], //店铺环境图片；列表
    shop_pic: [],
    goods_pic_show: [],
    goods_pic: [],
    category: [], //分类
    hasRead: true, //同意条款
    isShowPhone: false,
    phone: '' //是否有手机号
  },

  onLoad: function (options) {
    var that = this;
    // 请求店铺分类
    util.getReq('&m=category&a=getCgList', { type: 2 }, function (data) {
      if (data.flag == 1) {
        that.setData({
          category: data.result
        })
      } else {
        util.errorTips(data.msg);
      }
    })

    // 编辑时请求
    if (options.id) {
      util.getReq('&m=shop&a=getShopDetail', {
        id: options.id,
        session3rd: app.globalData.token
      }, function (data) {
        that.setData({
          info: data.result,
          shop_pic_show: data.result.shop_pic_show,
          shop_pic: data.result.shop_pic,
          goods_pic_show: data.result.goods_pic_show,
          goods_pic: data.result.goods_pic
        })
      })
    }

    this.getUserInfo()
  },

  getUserInfo: function () {
    var that = this;
    var token = app.globalData.token;
    util.req('&m=member&a=getMemberInfo', { session3rd: token }, function (data) {
      if (data.flag == 1) {
        if (!data.result.phone) {
          that.setData({ isShowPhone: true })
        } else {
          that.setData({ isShowPhone: false, phone: data.result.phone })
        }
      }
    })
  },

  chooseLocation: function () {
    const info = this.data.info;
    const that = this;
    wx.chooseLocation({
      success: function (res) {
        info.lat = res.latitude;
        info.lng = res.longitude;
        info.shop_addr = res.address;
        info.shop_addr_name = res.name;
        wx.showLoading({
          title: '正在更新地址...',
        })

        app.getLocation(that, res.latitude, res.longitude).then((addr) => {
          info.province = addr.result.ad_info.province;
          info.city = addr.result.ad_info.city;
          info.district = addr.result.ad_info.district;
          that.setData({
            info
          })
          wx.hideLoading();
        })
      }
    })
  },

  openMap: function () {
    const that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              that.chooseLocation()
            },
            fail() {
              wx.showModal({
                cancelText: '知道了',
                confirmText: '去设置',
                content: '获取您的位置信息失败！',
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: (res) => {
                        console.log(res)
                        res.authSetting = {
                          "scope.userLocation": true
                        }
                      }
                    })
                  }
                }
              })
            }
          })
        } else {
          that.chooseLocation();
        }
      }
    })
    return;

  },

  handleChange: function(event) {
    const name = event.currentTarget.dataset.name;
    const value = event.detail.value;
    const info = this.data.info;
    const category = this.data.category;
    if (name == 'cg_id') {
      info.cg_id = category[value].cg_id;
      info.cg_name = category[value].name;
      this.setData({ info });
      return;
    }

    if (name == 'shop_property' || name == 'is_new' || name == 'is_brand') {
      info[name] = value;
      return;
    }
    info[name] = value;
    this.setData({ info });
  },

  chooseLogo: function(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: 'compressed',
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: config.configUrl + '&m=info&a=upPic',
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            const event = {
              currentTarget: { dataset: { name: 'shop_logo' }},
              detail: { value: data.result.file }
            }
            that.handleChange(event);
            that.setData({ shopLogo: tempFilePaths[0] });
          },
          fail: function (res) {
            wx.hideToast();
            wx.showModal({
              title: '错误提示',
              content: res.errMsg,
              showCancel: false,
              success: function (res) { }
            })
          }
        });
      }
    })
  },

  deleteImage: function (event) {
    var name = event.currentTarget.dataset.name;
    var shop_pic_show = this.data.shop_pic_show;
    var shop_pic = this.data.shop_pic;
    var goods_pic_show = this.data.goods_pic_show;
    var goods_pic = this.data.goods_pic;
    if (name == 'goods') {
      goods_pic_show.splice(event.target.id, 1);
      goods_pic.splice(event.target.id, 1);
      this.setData({
        goods_pic_show,
        goods_pic
      })
    } else {
      shop_pic_show.splice(event.target.id, 1);
      shop_pic.splice(event.target.id, 1);
      this.setData({
        shop_pic_show,
        shop_pic
      })
    }
    
  },

  chooseImage: function (event) {
    var that = this;
    var name = event.currentTarget.dataset.name;
    var count = name == 'goods' ? 20 - that.data.goods_pic_show.length : 8 - that.data.shop_pic_show.length;
    
    wx.chooseImage({
      count, // 默认10
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        var shop_pic_show = that.data.shop_pic_show; //创建时是空数组，修改时是线上的链接
        var shop_pic = that.data.shop_pic; // 创建时是空数组，修改时是线上的链接 存储服务器端url
        var goods_pic_show = that.data.goods_pic_show;
        var goods_pic = that.data.goods_pic;
        var uploadImgCount = 0;
        // 遍历循环图片上传到服务器
        for (var i = 0, h = tempFilePaths.length; i < h; i++) {
          wx.uploadFile({
            url: config.configUrl + '&m=info&a=upPic',
            filePath: tempFilePaths[i],
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function (res) {
              uploadImgCount++;
              var data = JSON.parse(res.data);
              if (name == 'goods') {
                goods_pic.push(data.result.file);
                if (goods_pic_show.length > 0) {
                  var newList = goods_pic_show.concat(tempFilePaths);
                  that.setData({
                    goods_pic_show: newList,
                    goods_pic
                  })
                } else {
                  that.setData({
                    goods_pic_show: tempFilePaths,
                    goods_pic
                  })
                }
              } else {
                console.log(shop_pic)
                shop_pic.push(data.result.file);
                if (shop_pic_show.length > 0) {
                  var newList = shop_pic_show.concat(tempFilePaths);
                  that.setData({
                    shop_pic_show: newList,
                    shop_pic
                  })
                } else {
                  that.setData({
                    shop_pic_show: tempFilePaths,
                    shop_pic
                  })
                }
              }
            },
            fail: function (res) {
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: res.errMsg,
                showCancel: false,
                success: function (res) { }
              })
            }
          });
        }
      }
    });
  },

  // 同意发布条款
  checkboxChange: function(e) {
    const len = e.detail.value.length;
    if (len > 0) {
      this.setData({ hasRead: true });
    } else {
      this.setData({ hasRead: false });
    }
  },

  formSubmit: function(e) {
    const newInfo = e.detail.value;
    const info = this.data.info;
    if (!this.data.hasRead) {
      wx.showModal({
        content: '同意发布条款才可以发布',
      })
      return;
    }

    info.session3rd = app.globalData.token;
    info.shop_pic = this.data.shop_pic;
    info.shop_phone = this.data.phone;

    if (!info.shop_logo) {
      wx.showModal({
        content: '请填写店铺logo',
      })
      return;
    }

    if (!info.cg_id) {
      wx.showModal({
        content: '请选择店铺分类',
      })
      return;
    }

    if (!info.shop_pic) {
      wx.showModal({
        content: '请选择店铺图片',
      })
      return;
    }

    util.req('&m=shop&a=editshop', info, function(data) {
      if (data.flag == 1) {
        wx.showToast({
          title: '提交成功',
        })

        setTimeout(function() {
          if (info.id) {
            wx.navigateBack({
              delta: 1
            })
          } else {
            wx.reLaunch({
              url: '../shopList/index'
            })
          }
        }, 1500)
      } else {
        wx.showModal({
          title: data.msg,
        })
      }
    })
  },

  // 无验证手机时显示
  handleOpenPhone: function () {
    this.setData({ isShowPhone: true });
  },

  handleSubmitPhone: function() {
    this.getUserInfo();
    this.handleClosePhone();
  },

  handleClosePhone: function (event) {
    var that = this;
    this.setData({ isShowPhone: false });
  }
})