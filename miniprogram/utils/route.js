export function isIndexPage(){
  const pages=getCurrentPages()
  const lastPage=pages[pages.length-1]
  return lastPage.route==="pages/main/index"||lastPage.route==="pages/user/index"
}