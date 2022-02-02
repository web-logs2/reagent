import { getUserInfo } from "../../utils/user"


Page({
  data: {

  },
  onLoad(option) {
    getUserInfo().then(info=>{
      if(!info.roomID && option.room_id){
        wx.navigateTo({
          url: `/pages/room_join/index?id=${option.room_id}`,
        })
      }else {
        wx.reLaunch({
          url: '/pages/main/index',
        })
      }
    })
  }
})