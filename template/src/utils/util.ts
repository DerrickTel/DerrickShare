// 获取 query string
export const queryString = () => {
  const { search } = window.location; // 获取url中"?"符后的字串
  const theRequest: any = {};
  if (search.indexOf("?") !== -1) {
    const str = search.substr(1);
    const strs = str.split("&");
    for (let i = 0; i < strs.length; i += 1) {
      theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}

export function getCookie(cName: string) {
  if (document.cookie.length > 0) {
    let cStart = document.cookie.indexOf(`${cName}=`);
    if (cStart !== -1) {
      cStart = cStart + cName.length + 1;
      let cEnd = document.cookie.indexOf(';', cStart);
      if (cEnd === -1) cEnd = document.cookie.length;
      return unescape(document.cookie.substring(cStart, cEnd))
    }
  }
  return ''
}