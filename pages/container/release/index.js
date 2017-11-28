// pages/container/release/index.js
var config = require('../../common/config.js');
var util = require('../../../utils/util.js');
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;

qqmapsdk = new QQMapWX({
  key: 'AAOBZ-DK53W-TSBR3-ONY3L-474I3-CMFGU'
});
const app = getApp()

Page({
  data: {
    imagesList:[], //图片；列表
    isNull: true, //textarea是否是空
    secondMenus: [], // 二级菜单
    item: {}, // 要提交的对象
    address: '',
    hasLogin: null,
    isSubmiting: false
  },

  onLoad: function (options) {
    // 默认id设为url中的id
    var that = this;
    var token = app.globalData.token;
    var item = this.data.item;
    item.cg_id = options.id;
    item.session3rd = token;
    this.setData({
      item: item,
    })
    if (token) {
      this.setData({
        hasLogin: true,
      })
    }

    //请求二级菜单
    if (options.type == 0) {
      util.req('&m=Category&a=getCgList', {
        type: 0,
        parent_id: options.id
      }, function(data) {
        var menus = data.result;
        if (menus.length > 0) {
          that.setData({
            secondMenus: menus
          })
        }
      })
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
            var address = res.result.formatted_addresses.rough
            item.post_addr = address;
            that.setData({
              address: res.result,
              item: item
            })
          },
          fail: function (res) {
          },
          complete: function (res) {
          }
        });
      }
    })
  },

  openMap: function() {
    var address = this.data.address;

    wx.openLocation({
      latitude: address.location.lat,
      longitude: address.location.lng,
      scale: 28
    })
  },

  deleteImage: function(event) {
    var imagesList = this.data.imagesList;
    imagesList.splice(event.target.id, 1);
    this.setData({
      imagesList: imagesList
    })
  },

  chooseImage: function() {
    var that = this;
    wx.chooseImage({
      count: 6, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var imagesList = that.data.imagesList;
        if (imagesList.length > 0) {
          var newList = imagesList.concat(tempFilePaths);
          that.setData({
            imagesList: newList
          })
        } else {
          that.setData({
            imagesList: tempFilePaths
          })
        }
      }
    });
  },

  handleServerUpload: function(item) {
    return new Promise(function(resolve, reject) {
      wx.uploadFile({
        url: config.configUrl + '&m=info&a=upPic',
        filePath: item,
        name: 'file',
        header: { "Content-Type": "multipart/form-data" },
        success: function (res) {
          var data = JSON.parse(res.data);
          resolve(data.file);
        }
      })
    })
  },

  getServerImage: function(list) {
    var images = '';
    var that = this;
    return new Promise(function(resolve, reject) {
      list.map(item => {
        that.handleServerUpload(item).then(res => {
          images = images + ',' + res;
          resolve(images);
        })
      })
    }) 
  },

  handleChange: function(e) {
    var length = e.detail.value.length;
    var item = this.data.item;
    item.post_content = e.detail.value;

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
      item: item
    })
  },

  handleSubmit: function() {
    var that = this;
    var item = this.data.item;
    var imagesList = this.data.imagesList;
    if (imagesList.length > 0) {
      this.getServerImage(this.data.imagesList).then(res => {
        item.smeta = res;
        console.log(res);

        that.setData({ isSubmiting: true });
        util.req('&m=info&a=addInfo', util.json2Form(item), function (data) {
          if (data.flag == 1) {
            wx.showToast({
              title: '发布成功',
              icon: 'success',
              duration: 2000
            });
            wx.navigateBack({
              delta: 1
            })
          } else {
            wx.showModal({
              content: '发布失败' + data.msg,
            })
          }
          that.setData({ isSubmiting: false });
        })
      });
    } else {
      that.setData({ isSubmiting: true });
      util.req('&m=info&a=addInfo', item, function (data) {
        if (data.flag == 1) {
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 2000
          });
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showModal({
            content: '发布失败' + data.msg,
          })
        }
        that.setData({ isSubmiting: false });
      })
    }
  },

  handleSubmit2: function () {
    var that = this;
    var item = this.data.item;
    item.smeta = this.data.imagesList;
    console.log(item.smeta)
    that.setData({ isSubmiting: true });
    util.req('&m=info&a=addInfo', item, function (data) {
      if (data.flag == 1) {
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 2000
        });
      } else {
        wx.showModal({
          content: '发布失败' + data.msg,
        })
      }
      that.setData({ isSubmiting: false });
    })
  }
})