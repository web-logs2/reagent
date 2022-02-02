import {
  kinds
} from '../../constance/kind'

const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    info: {},
    propsList: [],
    title: "",
    kind: null
  },
  onLoad(option) {
    this.id = option.id
    this.fetchInfo()
  },
  getKindName(kindType) {
    const kind = kinds.find(it => it.type == kindType)
    if (kind) {
      return kind.text
    }
    return ''
  },
  onEdit(){
    wx.navigateTo({
      url: `/pages/item_edit/index?type=${this.data.kind}&id=${this.id}`,
    })
  },
  async fetchInfo() {
    const res = await db.collection("item").doc(this.id).get()
    const {
      thumbnail,
      chinese_name,
      english_name,
      state,
      size,
      ...props
    } = res.data.info
    const propsList = Object.keys(props).map(k => ({
      k,
      v: props[k]
    }))
    this.setData({
      info: res.data.info || {},
      propsList,
      kind: res.data.type,
      title: this.getKindName(res.data.type)
    })
  }
})