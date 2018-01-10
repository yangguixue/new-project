// pages/container/creatShop/index.js
var util = require('../../../utils/util.js');
var config = require('../../common/config.js');
var app = getApp();

Page({
  data: {
    info: {},
    startTime: '',  
    endTime: '',  
    nature: ['实体店', '自主经营'],
    imagesList: [], //图片；列表
    category: [], //分类
    serverUrl: [],
    hasRead: true //同意条款
  },

  onLoad: function (options) {
    var that = this;
    // 请求店铺分类
    util.getReq('&m=category&a=getCgList', { type: 1 }, function (data) {
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
          imagesList: data.result.shop_pic_show,
          serverUrl: data.result.shop_pic
        })
      })
    }

    // 获取位置
    if (!options.id) {
      app.getLocation(that).then((res) => {
        var address = res.result.formatted_addresses.rough;
        var info = this.data.info;
        info.shop_addr_name = address;
        that.setData({
          info,
          address: res.result
        })
      })
    }
  },

  openMap: function () {
    const info = this.data.info;
    const that = this;
    wx.chooseLocation({
      success: function (res) {
        info.shop_addr = res.address;
        info.shop_addr_name = res.name;
        info.lat = res.latitude;
        info.lng = res.longitude;
        that.setData({
          info
        })
      }
    })
  },

  bindStartTimeChange: function (e) {
    this.setData({
      startTime: e.detail.value
    })
  },

  bindEndTimeChange: function (e) {
    this.setData({
      endTime: e.detail.value
    })
  },

  bindCategoryChange: function (e) {
    this.setData({
      categoryIndex: e.detail.value
    })
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
            that.setData({ shopLogo: tempFilePaths[0], serverLogo: data.result.file })
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
    var imagesList = this.data.imagesList;
    var serverUrl = this.data.serverUrl;
    imagesList.splice(event.target.id, 1);
    serverUrl.splice(event.target.id, 1);
    this.setData({
      imagesList,
      serverUrl
    })
  },

  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 6, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        var imagesList = that.data.imagesList; //创建时是空数组，修改时是线上的链接
        var serverUrl = that.data.serverUrl; // 创建时是空数组，修改时是线上的链接 存储服务器端url
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

    if (info.id) {
      newInfo.id = info.id;
      newInfo.shop_logo = this.data.serverLogo ? this.data.serverLogo : info.shop_logo;
      newInfo.start_time = this.data.startTime ? this.data.startTime : info.start_time;
      newInfo.end_time = this.data.endTime ? this.data.endTime : info.end_time;
    } else {
      newInfo.shop_logo = this.data.serverLogo;
      newInfo.start_time = this.data.startTime;
      newInfo.end_time = this.data.endTime;
    }
    newInfo.shop_pic = this.data.serverUrl;
    newInfo.shop_addr = info.shop_addr;
    newInfo.shop_addr_name = info.shop_addr_name;
    newInfo.lat = info.lat;
    newInfo.lng = info.lng;
    newInfo.session3rd = app.globalData.token;

    util.req('&m=shop&a=editshop', newInfo, function(data) {
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
        }, 3000)
      } else {
        wx.showToast({
          title: data.msg,
        })
      }
    })
  }
})