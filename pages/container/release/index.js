// pages/container/release/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imagesList:[],
    isNull: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  deleteImage: function(event) {
    var imagesList = this.data.imagesList;
    imagesList.splice(event.target.id, 1);
    console.log(imagesList)
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
        console.log(imagesList)
        if (imagesList.length > 0) {
          console.log(tempFilePaths)
          console.log(imagesList)
          const newList = imagesList.concat(tempFilePaths)
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

  handleChange: function(e) {
    var length = e.detail.value.length;
    console.log(length)
    if (length > 0) {
      this.setData({
        isNull: false
      })
    } else {
      this.setData({
        isNull: true
      })
    }
  }
})