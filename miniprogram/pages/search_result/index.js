import {
  kinds
} from '../../constance/kind'
import {
  getUserInfo
} from '../../utils/user'
import {
  debounce,
  getThumb
} from '../../utils/utils'

const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    currentKind: null,
    currentKindText: 'Search',
    items: [],
    loading: false,
    end: false
  },
  getKindName(kindType) {
    const kind = kinds.find(it => it.type == kindType)
    if (kind) {
      return kind.text
    }
    return 'Search'
  },
  onLoad(option) {
    const kindType = option.kind
    if (kindType) {
      this.setData({
        currentKind: kindType,
        currentKindText: this.getKindName(kindType)
      }, () => {
        this.fetchItems()
      })
    } else {
      this.fetchItems()
    }
  },
  async fetchItems() {
    if (this.data.end||this.data.loading) {
      return
    }
    const type = this.data.currentKind
    const userInfo = await getUserInfo()
    const search = this.search || ''
    this.setData({
      loading: true
    })
    const req = db.collection("item")
      .where(
        db.command.or(
          ['chinese_name', 'english_name', 'state', 'abbreviation'].map(it => {
            return {
              [`info.${it}`]: db.RegExp({
                regexp: search,
                options: 'i',
              })
            }
          })
        ).and([{
          roomID: userInfo.roomID || 'test',
          type: type || undefined,
        }])
      )
      .orderBy('updateTime', 'desc')
      .limit(5)
      .skip(this.data.items.length)
    const {
      total
    } = await req.count()
    const res = await req.get()
    const resList = res.data.map(it => {
      if (!it.info.thumbnail) {
        return it
      }
      it.info.thumbnail = getThumb(it.info.thumbnail)
      return it
    })
    this.setData({
      items: [...this.data.items, ...resList],
      loading: false
    }, () => {
      if (this.data.items.length >= total) {
        this.setData({
          end: true
        })
      }
    })
  },
  onPageScroll: async function (e) {
    const isBottom = await this.checkIsBottom(e)
    if (isBottom) {
      this.fetchItems()
    }
  },
  checkIsBottom(e) {
    return new Promise(resolve => {
      const query = wx.createSelectorQuery();
      query.select('.wrapper').boundingClientRect(rect => {
        if (!rect) {
          return
        }
        const isBottom = e.scrollTop + wx.getSystemInfoSync().windowHeight > rect.height - 20
        resolve(isBottom)
      }).exec();
    })
  },
  onItemTap(e) {
    const index = e.currentTarget.dataset.index
    const item = this.data.items[index]
    wx.navigateTo({
      url: `/pages/item_detail/index?id=${item._id}`,
    })
  },
  onSearch:debounce(function(e) {
    this.search = e.detail.value
    this.refresh()
  },250),
  refresh() {
    this.setData({
      items: [],
      end: false
    }, () => {
      this.fetchItems()
    })
  }
})