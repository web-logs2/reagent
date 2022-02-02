import { login } from "../../utils/user"

Page({
  data: {
  },
  bindgetuserinfo(){
    wx.navigateBack()
  },
  onCancel(){
    wx.navigateBack()
  }
})