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
    serverUrl: []
  },

  onLoad: function (options) {
    var that = this;
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
      util.getReq('&m=shop&a=getShopDetail', { id: options.id }, function (data) {
        that.setData({
          info: data.result
        })
        console.log(data.result)
      })
    }

    // 获取位置
    app.getLocation(that).then((res) =>{
      var address = res.result.formatted_addresses.rough;
      var info = this.data.info;
      info.shop_addr = address;
      that.setData({
        info,
        address: res.result
      })
    })
  },

  openMap: function () {
    var address = this.data.address;
    wx.openLocation({
      latitude: address.location.lat,
      longitude: address.location.lng,
      scale: 28
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

  bindNatureChange: function(e) {
    this.setData({
      natureIndex: e.detail.value
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
            }
          });
        }
      }
    });
  },

  formSubmit: function(e) {
    var info = e.detail.value;
    info.shop_logo = this.data.serverLogo;
    info.shop_pic = this.data.serverUrl;
    info.session3rd = app.globalData.token;
    info.start_time = this.data.startTime;
    info.end_time = this.data.endTime;
    info.shop_addr = this.data.info.shop_addr;

    util.req('&m=shop&a=editshop', info, function(data) {
      console.log(data)
      if (data.flag == 1) {
        wx.showToast({
          title: '提交成功',
        })

        setTimeout(function() {
          wx.reLaunch({
            url: '../shopList/index'
          })
        }, 3000)
      }
    })
  }
})