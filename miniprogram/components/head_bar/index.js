import { isTopPage } from '../../utils/route'


function interpolate(progress,min,max){
  return (max-min)*progress+min
}

Component({
  properties: {
    title: String,
    disableSticky: Boolean,
    showSearch: {
      type: Boolean,
      value: true,
    },
    searchStatus: {
      type: String,
      value: 'hidden'
    }
  },
  data: {
    searchText: "",
    showBack: false,
  },
  ready() {
    const isIndex = isTopPage()
    this.setData({
      showBack: !isIndex
    })
  },
  methods: {
    onBack() {
      wx.navigateBack()
    },
    goSearch(){
      wx.navigateTo({
        url: `/pages/search_result/index`,
      })
    },
    onSearchInput(e) {
      this.setData({
        searchText: e.detail.value
      })
      this.triggerEvent("searchinput", {
        value: e.detail.value
      })
    },
    onScan(e){
      wx.scanCode({
        success(res){
          console.log(res.result)
        }
      })
    },
    onScroll(e){
      const scrollTop=e.detail.scrollTop
      const progress=-80/scrollTop
      this.animate(".back",[
        {top:interpolate(progress,70,240)+'rpx'}
      ],10)
      // this.animate(".title")
    }
  }
})
