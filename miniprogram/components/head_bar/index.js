import {isIndexPage} from '../../utils/route'
Component({
  properties: {
    title:String,
    showSearch:{
      type:Boolean,
      value:true,
    }
  },
  data: {
    searchText:"",
    showBack:false,
  },
  ready(){
    const isIndex=isIndexPage()
    this.setData({
      showBack:!isIndex
    })
  },
  onSearchInput(e) {
    this.setData({
      searchText: e.detail.value
    })
  },
  methods: {
    onBack(){
      wx.navigateBack()
    }
  }
})
