// pages/container/activity/ integration/index.js
var util = require('../../../../utils/util.js');
var app = getApp();

var fetchPoint = function(that) {
  util.req('&m=member&a=drawCount', { session3rd: app.globalData.token }, function (data) {
    if (data.flag == 1) {
      that.setData({ point: data.result });
    } else {
      wx.showModal({
        title: data.msg + 2,
      })
    }
  })
};

//圆圈
var circleLoop; 
var userLoop;

Page({
  data: {
    items: [],
    point: {},
    userList: [],
    userItem: {},
    isShowLogin: false,
    nodes: '',
    showRed: false, //是否显示红包
    circleList: [],//圆点数组
    awardList: [],//奖品数组
    colorCircleFirst: '#fff',//圆点颜色1
    colorCircleSecond: '#fe7a22',//圆点颜色2
    indexSelect: 0,//被选中的奖品index
    isRunning: false,//是否正在抽奖
    imageAward: [],
  },

  onLoad: function (options) {
    const that = this;

    //获取奖品列表
    util.req('&m=member&a=drawInit', {}, function (data) {
      if (data.flag == 1) {
        that.setData({ imageAward: data.result.redp_list, userList: data.result.wallet_list });
        let i = 0;
        userLoop = setInterval(() => {
          const userItem = data.result.wallet_list[i];
          if (i == data.result.wallet_list.length - 1) {
            i = 0;
            that.setData({ userItem });
          } else {
            i++;
            that.setData({ userItem });
          }
        }, 2000);
        //奖品item设置
        var awardList = [];
        //间距,怎么顺眼怎么设置吧.
        var topAward = 25;
        var leftAward = 25;
        for (var j = 0; j < 8; j++) {
          if (j == 0) {
            topAward = 25;
            leftAward = 25;
          } else if (j < 3) {
            topAward = topAward;
            //166.6666是宽.15是间距.下同
            leftAward = leftAward + 166.6666 + 15;
          } else if (j < 5) {
            leftAward = leftAward;
            //150是高,15是间距,下同
            topAward = topAward + 150 + 15;
          } else if (j < 7) {
            leftAward = leftAward - 166.6666 - 15;
            topAward = topAward;
          } else if (j < 8) {
            leftAward = leftAward;
            topAward = topAward - 150 - 15;
          }

          var imageAward = data.result.redp_list[j];
          awardList.push({ topAward, leftAward, imageAward });
        }
        that.setData({
          awardList,
        })
      } else {
        wx.showModal({
          title: data.msg + 4,
        })
      }
    })

    var leftCircle = 7.5;
    var topCircle = 7.5;
    var circleList = [];
    for (var i = 0; i < 24; i++) {
      if (i == 0) {
        topCircle = 15;
        leftCircle = 15;
      } else if (i < 6) {
        topCircle = 7.5;
        leftCircle = leftCircle + 102.5;
      } else if (i == 6) {
        topCircle = 15
        leftCircle = 620;
      } else if (i < 12) {
        topCircle = topCircle + 94;
        leftCircle = 620;
      } else if (i == 12) {
        topCircle = 565;
        leftCircle = 620;
      } else if (i < 18) {
        topCircle = 570;
        leftCircle = leftCircle - 102.5;
      } else if (i == 18) {
        topCircle = 565;
        leftCircle = 15;
      } else if (i < 24) {
        topCircle = topCircle - 94;
        leftCircle = 7.5;
      } else {
        return
      }
      circleList.push({ topCircle: topCircle, leftCircle: leftCircle });
    }
    this.setData({
      circleList: circleList
    })

    circleLoop = setInterval(function () {
      if (that.data.colorCircleFirst == '#fe7a22') {
        that.setData({
          colorCircleFirst: '#fff',
          colorCircleSecond: '#fe7a22',
        })
      } else {
        that.setData({
          colorCircleFirst: '#fe7a22',
          colorCircleSecond: '#fff',
        })
      }
    }, 500);
    util.req('&m=ad&a=getIll', { name: 'jfzb' }, function (data) {
      if (data.flag == 1) {
        that.setData({ nodes: data.result.content });
      } else {
        wx.showModal({
          title: data.msg + 3,
        })
      }
    })
  },

  onShow: function() {
    const that = this;
    fetchPoint(that);
  },

  onUnload: function() {
    clearInterval(circleLoop);
    clearInterval(userLoop);
  },
  //开始游戏
  startGame: function () {
    if (!app.globalData.is_reg) {
      this.handleOpenLogin();
      return;
    }
    if (this.data.isRunning) return;
    this.setData({
      isRunning: true
    })
    var _this = this;
    var indexSelect = 0;
    var times = 0;
    var timesMap = setInterval(function () {
      times++
    }, 200);

    util.req('&m=member&a=pointDraw', { session3rd: app.globalData.token }, function (data) {
      var timer = setInterval(function () {
        indexSelect++;
        indexSelect = indexSelect % 8;
        _this.setData({
          indexSelect
        })

        if (data.flag == 1) {
          if (times == 20) {
            clearInterval(timesMap);
          }
          
          // 第三次转圈并且选择的值等于返回的值
          if (times == 20 && indexSelect == data.result.key) {
            setTimeout(() => {
              _this.setData({
                indexSelect: data.result.key,
                showRed: true
              }, 3000)
              clearInterval(timer);
              fetchPoint(_this);
            })
          }
          _this.setData({
            isRunning: false,
          })
        } else {
          wx.showModal({
            title: '温馨提示',
            content: data.msg + 1,
          })
          clearInterval(timer);
          _this.setData({
            isRunning: false
          })
        }
      }, 200)
    })
  },

  // userLoop: function (that, i) {
  //   const users = that.data.userList;
  //   setTimeout(() => {
  //     const userItem = users[i];
  //     if (i == users.length - 1) {
  //       i = 0;
  //       that.setData({ userItem });
  //       that.userLoop(that, i);
  //     } else {
  //       i++;
  //       that.setData({ userItem });
  //       that.userLoop(that, i);
  //     }
  //   }, 2000);
  // },

  closeHongbao: function() {
    this.setData({ showRed: false });
  },

  // getWeeklySort: function() {
  //   var that = this;
  //   util.req('&m=point&a=getWeeklySort', {
  //     session3rd: app.globalData.token
  //   }, function(data) {
  //     that.setData({
  //       items: data.result.list
  //     })
  //   })
  // },

  handleSend: function() {
    wx.switchTab({
      url: '../../index/index',
    })
  },

  handleOpenLogin: function () {
    this.setData({ isShowLogin: true });
  },

  handleCloseLogin: function (event) {
    var that = this;
    this.setData({ isShowLogin: false });
    this.myPoint();
  },

  onShareAppMessage: function (res) {
    return {
      title: '天天领红包+积分抽奖100%得红包双重福利等你来拿',
      path: '/pages/container/activity/integration/index?userId=' + app.globalData.token,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

})