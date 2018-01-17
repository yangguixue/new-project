// pages/container/creatShop/index.js
var util = require('../../../utils/util.js');
var config = require('../../common/config.js');
var app = getApp();

Page({
  data: {
    info: {
      is_new: false,
      is_brand: false,
      shop_property: true
    },
    startTime: '',  
    endTime: '',  
    nature: ['实体店', '自主经营'],
    imagesList: [], //图片；列表
    category: [], //分类
    serverUrl: [],
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
          imagesList: data.result.shop_pic_show,
          serverUrl: data.result.shop_pic
        })
      })
    }

    // 获取位置
    if (!options.id) {
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          app.getLocation(that, res.latitude, res.longitude).then((res) => {
            var address = res.result.formatted_addresses.rough;
            var info = that.data.info;
            info.shop_addr_name = address;
            info.lat = res.result.location.lat;
            info.lng = res.result.location.lng;
            info.shop_addr = res.result.address;
            info.province = res.result.ad_info.province;
            info.city = res.result.ad_info.city;
            info.district = res.result.ad_info.district;
            that.setData({
              info,
              address: res.result
            })
          })
        }
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

  openMap: function () {
    const info = this.data.info;
    console.log(info);
    const that = this;
    wx.chooseLocation({
      success: function (res) {
        info.shop_addr = res.address;
        info.shop_addr_name = res.name;
        info.lat = res.latitude;
        info.lng = res.longitude;
        wx.showLoading({
          title: '正在更新地址...',
        })
        // 重新选择地址
        app.getLocation(that, res.latitude, res.longitude).then((addr) => {
          info.province = addr.result.ad_info.province;
          info.city = addr.result.ad_info.city;
          info.district = addr.result.ad_info.district;
          wx.hideLoading();
        })
        console.log(info);
        that.setData({
          info
        })
      }
    })
  },

  handleChange: function(event) {
    console.log(event)
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
    console.log(info)
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
    if (!this.data.hasRead) {
      wx.showModal({
        content: '同意发布条款才可以发布',
      })
      return;
    }

    info.session3rd = app.globalData.token;
    info.shop_pic = this.data.serverUrl;
    info.shop_phone = this.data.phone;
    console.log(info.shop_pic)

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