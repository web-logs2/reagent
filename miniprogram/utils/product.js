const db = wx.cloud.database()

export async function getProductByCode(code) {
  const res=await db.collection("item")
    .where({
      code
    }).get()
    console.log(res)
}
