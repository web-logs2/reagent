import { login } from "../../utils/user"


Page({
  data: {

  },
  onLoad() {
    login().then().catch(err => {
      console.log(err)
    })
  }
})