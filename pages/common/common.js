var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;

qqmapsdk = new QQMapWX({
  key: 'AAOBZ-DK53W-TSBR3-ONY3L-474I3-CMFGU'
});

function getAddress() {
  wx.getLocation({
    type: 'wgs84',
    success: function (res) {
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: res.latitude,
          longitude: res.longitude
        },
        success: function (res) {
          return res.result.address_component.district;
        },
        fail: function (res) {
        },
        complete: function (res) {
        }
      });
    }
  })
}


function handleJoin(item) {
  wx.request({
    url: config.prod + '&m=member&a=setCicleStatus',
    data: item,
    header: { "content-type": "application/x-www-form-urlencoded" },
    method: "POST",
    dataType: "json",
    success: function(res) {
      console.log(res)
    }
  })
}

module.exports.getAddress = getAddress;
module.exports.handleJoin = handleJoin;