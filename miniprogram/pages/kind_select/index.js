//index.js
const app = getApp()

Page({
  data: {
    kinds:[
      {
        icon:"iconhuaxueshiyan-1",
        text:"试剂",
        type:""
      },
      {
        icon:"iconhuaxueshiyan-",
        text:"仪器"
      },
      {
        icon:"iconhuaxueshiyan-2",
        text:"耗材"
      },
    ]
  },
  onKindChange(e){
    const index=e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/reagent_edit/index',
    })
  }
})