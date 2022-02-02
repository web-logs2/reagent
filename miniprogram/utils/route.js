import url from 'url'
import querystring from 'querystring'


export function isTopPage() {
  const pages = getCurrentPages()
  return pages.length <= 1
}

export function getQuery(str) {
  let query = {}
  try {
    const u = url.parse(str)
    query = querystring.parse(u.query)
  } catch (err) {
    //
  }
  return query
}