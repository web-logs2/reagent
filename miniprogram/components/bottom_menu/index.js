
Component({
  properties: {
    currentTab:{
      type:String,
      value:'home'
    }
  },

  data: {

  },
  methods: {
    onToolTap(e){
      const tab=e.currentTarget.dataset.tab
      this.setData({
        currentTab:tab
      })
      if(tab=="home"){
        wx.redirectTo({
          url: `/pages/main/index`,
        })
      }
      if(tab=="user"){
        wx.redirectTo({
          url: `/pages/user/index`,
        })
      }
    },
    onAdd(){
      wx.navigateTo({
        url: '/pages/kind_select/index',
      })
    }
  }
})
