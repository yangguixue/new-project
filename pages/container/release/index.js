// pages/container/release/index.js
var config = require('../../common/config.js');
var util = require('../../../utils/util.js');
const app = getApp()

Page({
  data: {
    imagesList:[], //图片；列表
    serverUrl: [],
    isNull: true, //textarea是否是空
    secondMenus: [], // 二级菜单
    item: {}, // 要提交的对象
    isSubmiting: false,
    hasRead: true,
    isSelect: false,
    isShowPhone: false, //是否要验证手机
    price: {},
    showPoint: false, //显示发布完成
    pointNum: '',
    phone: '', //该用户是否验证过手机号
  },

  onLoad: function (options) {
    // 默认id设为url中的id
    var token = app.globalData.token;
    var item = this.data.item;
    item.cg_id = options.id;
    item.session3rd = token;
    this.setData({
      item: item,
      type: options.type
    })

    //请求二级菜单
    var that = this;
    util.req('&m=Category&a=getCgList', {
      type: 0,
      parent_id: options.id
    }, function(data) {
      that.setData({
        secondMenus: data.result
      })
    })

    //获取价格
    util.req('&m=Category&a=getPrice', {
      cg_id: options.id
    }, function (data) {
      that.setData({
        price: data.result
      })
    })

    this.getUserInfo();
  },

  getUserInfo: function () {
    var that = this;
    var token = app.globalData.token;
    util.req('&m=member&a=getMemberInfo', { session3rd: token }, function (data) {
      if (data.flag == 1) {
        if (!data.result.phone) {
          that.setData({ isShowPhone: true  })
        } else {
          const item = that.data.item;
          item.phone = data.result.phone;
          that.setData({ isShowPhone: false, phone: data.result.phone, item })
        }
      }
    })
  },

  chooseLocation: function() {
    const address = this.data.address;
    const item = this.data.item;
    const that = this;
    wx.chooseLocation({
      success: function (res) {
        item.lat = res.latitude;
        item.lng = res.longitude;
        item.post_addr = res.address;
        item.post_addr_name = res.name;
        wx.showLoading({
          title: '正在更新地址...',
        })
        // 重新选择地址
        app.getLocation(that, res.latitude, res.longitude).then((addr) => {
          item.province = addr.result.ad_info.province;
          item.city = addr.result.ad_info.city;
          item.district = addr.result.ad_info.district;
          that.setData({
            item,
            address: addr.result.formatted_addresses.rough
          })
          wx.hideLoading();
        })
      }
    })
  },


  openMap: function() {
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

  // 同意发布条款
  checkboxChange: function (e) {
    const len = e.detail.value.length;
    if (len > 0) {
      this.setData({ hasRead: true });
    } else {
      this.setData({ hasRead: false });
    }
  },

  deleteImage: function(event) {
    var imagesList = this.data.imagesList;
    var serverUrl = this.data.serverUrl;
    imagesList.splice(event.target.id, 1);
    serverUrl.splice(event.target.id, 1);
    this.setData({
      imagesList,
      serverUrl
    })
  },

  chooseImage: function() {
    var that = this;
    var count = 6 - that.data.imagesList.length;
    console.log(count);
    wx.chooseImage({
      count, // 默认6
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var imagesList = that.data.imagesList;
        var serverUrl = that.data.serverUrl; // 存储服务器端url
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
              serverUrl.push(data.result.file);
              if (imagesList.length > 0) {
                var newList = imagesList.concat(tempFilePaths);
                that.setData({
                  imagesList: newList,
                  serverUrl
                })
              } else {
                that.setData({
                  imagesList: tempFilePaths,
                  serverUrl
                })
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
              console.log(res.errMsg)
            }
          });
        }
      }
    });
  },

  handleChange: function(e) {
    var length = e.detail.value.length;
    var name = e.target.dataset.name;
    var item = this.data.item;
    item[name] = e.detail.value;

    if (length > 0) {
      this.setData({
        isNull: false,
        item: item
      })
    } else {
      this.setData({
        isNull: true,
        item: item
      })
    }
  },

  radioChange: function(event) {
    var item = this.data.item;
    item.cg_id = event.detail.value;
    this.setData({
      isSelect: true, //是否选择了二级分类
      item: item
    })
  },

  handleOpenPoint: function (that) {
    that.setData({ showPoint: true });
  },

  handleClosePoint: function() {
    this.setData({ showPoint: false });
    if (this.data.type == 1) {
      wx.reLaunch({
        url: '../circle/index'
      })
    } else {
      wx.reLaunch({
        url: '../index/index'
      })
    }
  },

  handleSubmit: function() {
    var that = this;
    var item = this.data.item;
    var secondMenus = this.data.secondMenus;
    var isSelect = this.data.isSelect;
    var serverUrl = this.data.serverUrl;
    item.smeta = serverUrl;

    if (!item.post_addr_name) {
      wx.showModal({
        content: '请选择你所在的位置',
      })
      return;
    }

    if (secondMenus.length > 0 && !isSelect) {
      wx.showModal({
        content: '请选择一个二级分类',
      })
      return;
    }
    that.setData({ isSubmiting: true });
    util.req('&m=info&a=addInfo', item, function (data) {
      if (data.flag == 1) {
        that.setData({ showPoint: true, pointNum: data.result });
      } else {
        wx.showModal({
          content: '发布失败' + data.msg,
        })
      }
      wx.hideLoading();
      that.setData({ isSubmiting: false });
    })
  },

  handlePayment: function(event) {
    const item = {};
    const that = this;
    item.total_fee = this.data.price;
    item.session3rd = app.globalData.token;
    item.body = '息壤小镇-付费消息';
    util.req('&m=payment&a=pay', item, function (data) {
      if (data.flag == 1) {
        wx.requestPayment({
          'timeStamp': data.result.timeStamp,
          'nonceStr': data.result.nonceStr,
          'package': data.result.package,
          'signType': data.result.signType,
          'paySign': data.result.paySign,
          'success': function (res) {
            wx.showToast({
              title: '支付成功',
            })

            setTimeout(() => {
              wx.showLoading({
                title: '正在发布...',
              })
              that.handleSubmit();
            }, 2000)
          },
          'fail': function (res) {
            wx.showModal({
              content: '支付失败',
            })
          }
        })
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

  handleSubmitPhone: function () {
    this.getUserInfo();
    this.handleClosePhone();
  },

  handleClosePhone: function (event) {
    this.setData({ isShowPhone: false });
  }

})