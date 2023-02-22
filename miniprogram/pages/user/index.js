const app = getApp()

Page({
  data: {
    userInfo: {},
    items: [{
      icon: "iconhome-filling",
      text: "Lab",
      action: "room"
    }, ]
  },
  onLoad() {
    this.setData({
        userInfo: getApp().globalData.user
    })
  },
  async onItemTap(e) {
    const action = e.currentTarget.dataset.action
    if (action === "room") {
      if(!await this.checkUser()){
        return
      }
      wx.navigateTo({
        url: '/pages/room_detail/index',
      })
    }
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
      return false
    }
    return true
  }
})