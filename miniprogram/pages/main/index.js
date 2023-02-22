import {kinds} from '../../constance/kind'
Page({
  data: {
    currentKind: 'reagent',
    kinds: kinds,
    items: []
  },
  onLoad() {
    this.checkUser()
  },
  async checkUser(){
    const userInfo= getApp().globalData.user
    if (!userInfo.roomID) {
      wx.showModal({
        title: 'Welcome',
        content: 'It looks like you haven’t joined the lab yet',
        confirmText: 'Join one',
        cancelText: 'Later',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/room_select/index',
            })
          }
        }
      })
      return
    }
  },
  goSearch(e) {
    const {kind} = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/search_result/index?kind=${kind}`,
    })
  }
})