
import CryptoJS from 'crypto-js'

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

// 百度坐标转高德（传入经度、纬度）
export function bdToGd(bd_lng: number, bd_lat: number) {
  const X_PI = Math.PI * 3000.0 / 180.0;
  const x = bd_lng - 0.0065;
  const y = bd_lat - 0.006;
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
  const gg_lng = z * Math.cos(theta);
  const gg_lat = z * Math.sin(theta);
  return { longitude: gg_lng, latitude: gg_lat }
}
// 高德坐标转百度（传入经度、纬度）
export function gdToBd(gg_lng: number, gg_lat: number) {
  const X_PI = Math.PI * 3000.0 / 180.0;
  const x = gg_lng; const y = gg_lat;
  const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
  const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
  const bd_lng = z * Math.cos(theta) + 0.0065;
  const bd_lat = z * Math.sin(theta) + 0.006;
  return {
    longitude: bd_lng, latitude: bd_lat
  };
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


export const decrypt = (content: any) => {
  const key = CryptoJS.enc.Utf8.parse(CryptoJS.MD5('www.laobai.com!@#$%^&*%!123').toString());
  const decryptedData = CryptoJS.AES.decrypt(content, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return decryptedData.toString(CryptoJS.enc.Utf8)
}