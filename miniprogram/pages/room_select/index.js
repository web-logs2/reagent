import {
  getQuery
} from '../../utils/route'
Page({
  data: {},
  async onScan() {
    wx.scanCode({
      success: (res) => {
        console.log(res)
        if (!res.path) {
          this.onFail()
          return
        }
        const query = getQuery(res.path)
        if (!query.room_id) {
          this.onFail()
          return
        }
        wx.navigateTo({
          url: `../room_join/index?id=${query.room_id}`,
        })
      },
      fail: this.onFail
    })
  },
  onFail() {
    wx.showToast({
      title: 'Invalid captcha',
      icon: 'none'
    })
  },
  async onCreate() {
    wx.navigateTo({
      url: '../room_create/index',
    })
  }
})