let amapFile = require('../../libs/amap-wx.js');
Page({
  data: {
    city: '',
    today: {},
    future: {},
    placeholder: '请输入你想查询的国内城市'
  },
  onLoad() {
    this.loadCity();
  },
  loadCity() {
    var myAmapFun = new amapFile.AMapWX({
      key: '4d15590fa1267e97b95083bde10b720a'
    });
    myAmapFun.getPoiAround({
      success: (data) => {
        //成功回调
        // this.setData({
        //   city:data.poisData[0].cityname
        // })
        this.loadWeather(data.poisData[0].cityname)
      },
      fail: (info) => {
        //失败回调
        console.log(info)
      }
    })
  },
  loadWeather(city) {
    wx.request({
      method: 'GET',
      url: `http://wthrcdn.etouch.cn/weather_mini?city=${city}`,
      header: {
        "Content-Type": "json"
      },
      success: (res) => {
        // this.setDatas(res.data.data);
        // console.log(res.data.data);
        if(!res.data.data){
          wx.showToast({
            title:'城市名称输入不正确！',
            icon:'none'
          })
        }else{
          this.setDatas(res.data.data);
        }
      },
      fail:(err)=> {
        console.log(err);
      }
    })
  },
  subForm(event) {
    let city = event.detail.value.url;
    this.loadWeather(city);
  },
  setDatas(data) {
    let today = {},
      todayInfo = {},
      future = [];
    today.wendu = data.wendu;
    today.ganmao = data.ganmao;
    todayInfo.type = data.yesterday.type;
    todayInfo.low = data.yesterday.low;
    todayInfo.high = data.yesterday.high;
    today.todayInfo = todayInfo;
    if (data.forecast.length > 3) {
      future = data.forecast.slice(0, 4);
    } else {
      future = data.forecast;
    }
    this.setData({
      today,
      future,
      city: data.city
    })
  }
})