//index.js
const app = getApp()

Page({
  data: {
    kinds: [
      {
        icon: "iconhuaxueshiyan-1",
        text: "Reagent",
        type: "reagent"
      },
      {
        icon: "iconhuaxueshiyan-",
        text: "Instrument",
        type: "instrument"
      },
      {
        icon: "iconhuaxueshiyan-2",
        text: "Material",
        type: "material"
      },
    ]
  },
  onKindChange(e) {
    const type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `/pages/item_edit/index?type=${type}`,
    })
  }
})