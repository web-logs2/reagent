import querystring from 'qs'


export function isTopPage() {
  const pages = getCurrentPages()
  return pages.length <= 1
}

export function getQuery(str) {
  let query = {}
  try {
    const u =  new URL(str)
    query = querystring.parse(u.search)
  } catch (err) {
    //
  }
  return query
}