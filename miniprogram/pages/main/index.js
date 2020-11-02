//index.js
const app = getApp()

Page({
  data: {
    currentKind:0,
    kinds:[
      {
        icon:"iconhuaxueshiyan-1",
        text:"试剂"
      },
      {
        icon:"iconhuaxueshiyan-",
        text:"仪器"
      },
      {
        icon:"iconhuaxueshiyan-2",
        text:"耗材"
      },
    ],
    items:[
      {},{},{},{},{},{}
    ]
  },
  onLoad(){
  },
  onKindChange(e){
    const index=e.currentTarget.dataset.index
    this.setData({
      currentKind:index
    })
  }
})