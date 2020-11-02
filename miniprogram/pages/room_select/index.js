Page({
  data: {
  },
  onScan(){
    wx.scanCode({
      success: (res) => {
        console.log(res.result);
      },
      fail: (res) => {
        wx.showToast({
          title: '无效的二维码',
          icon: 'none'
        })
      }
    })
  },
  onCreate(){
    wx.redirectTo({
      url: '../room_create/index',
    })
  }
})