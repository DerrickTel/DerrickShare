/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-return-await */
import { Toast } from 'antd-mobile'
import Qs from 'qs'
import { REQUEST_URL } from './config'
import { getCookie, decrypt } from './util'

export enum ContentType {
  json = 'application/json;charset=UTF-8',
  form = 'application/x-www-form-urlencoded;charset=UTF-8',
  formData = 'multipart/form-data'
}

export enum HttpMethod {
  get = 'GET',
  post = 'POST',
  put = 'PUT',
  delete = 'DELETE'
}

export interface ReqConfig {
  // TODO: params类型定义
  params?: any;
  method?: string;
  headers?: Header;
  token?: string;
  contentType?: ContentType;
  baseUrl?: string | undefined;
  auth?: boolean;
}

export interface Header {
  [propName: string]: any;
}

export const createHttpHeaders = (contentType: ContentType = ContentType.json) => {
  const header = new Headers()

  header.set('Content-Type', contentType)

  // let token_id = '';
  // let user_id = ''
  
  // const  userInfoStr = getCookie('mLBUser');
  // const decrytedString = decrypt( decodeURIComponent( userInfoStr ) );
  // if(decrytedString){
  //   const decrytedJson = JSON.parse(decrytedString);
  //   if(decrytedJson){
  //     // eslint-disable-next-line
  //     token_id = decrytedJson.token_id; user_id = decrytedJson.user_id
  //   }
  // }
  // header.set('user_id', '1114405')
  // header.set('token_id', '492597ec-c628-48f8-ba60-42ae32c5ef01')
  // header.set('user_id', user_id)
  // header.set('token_id', token_id)
  // 部署时记得注释
  /*   if (VUE_APP_ENV === 'dev' || VUE_APP_ENV === 'test') {
    header.set('user_id', '1113813')
    header.set('token_id', '6a07aaa9-6648-4af0-9a6c-70ca09b45229')
  } */

  return header
}

const $req = async (
  url: string,
  {
    params = {},
    method = HttpMethod.get,
    headers,
    contentType = ContentType.json,
    baseUrl,
    auth = true
  }: ReqConfig
) => {
  // body
  let body: any
  // path
  let path: string = baseUrl ? baseUrl + url : REQUEST_URL + url
  // header
  const basicHeaders: Headers = createHttpHeaders(contentType)

  if (headers !== undefined) {
    Object.keys(headers).forEach((val) => {
      basicHeaders.set(val, `${headers[val]}`)
    })
  }

  if (method === HttpMethod.get) {
    // fetch的get请求  body不能有东西, 不然会报错, 亲测
    const query = Qs.stringify(params)
    path += query ? `?${query}` : ''
    body = undefined
  } else if (contentType === ContentType.form) {
    // body = Qs.stringify(params)
    const { payloadInUrl } = params
    if (payloadInUrl) {
      delete params.payloadInUrl
      const query = Qs.stringify(params)
      path += query ? `?${query}` : ''
      body = undefined
    } else {
      delete params.payloadInUrl
      body = Qs.stringify(params)
    }
  } else if (contentType === ContentType.formData) {
    const formData = new FormData()
    formData.append('file', params.blob, 'image.png')
    body = formData
  } else if (contentType === ContentType.json) {
    const { payloadInUrl } = params
    if (payloadInUrl) {
      delete params.payloadInUrl
      const query = Qs.stringify(params)
      path += query ? `?${query}` : ''
      body = undefined
    } else {
      delete params.payloadInUrl
      body = JSON.stringify(params)
    }
  } else {
    body = JSON.stringify(params)
  }

  // fetch返回值是一个Promise
  const promise: Response = await fetch(path, {
    // 好像是这个图片上传接口那边有点问题 要去掉header
    headers: contentType === ContentType.formData ? undefined : basicHeaders,
    body,
    method,
    // credentials: 'include', // 携带cookie
    credentials: 'omit', // 携带cookie
    mode: 'cors' // 跨域, 虽然基本上都是后端限制的
  })
  return handleRes(promise)
}

const handleRes = async (res: Response) => {
  const parsedRes = await parseRes(res)
  // 如果res.ok，则请求成功
  if (res.ok) {
    if (parsedRes.rc === 8) {
      Toast.fail('请登录后操作')

      // const returnUrl = window.location.href
      // const host = window.location.origin

      // window.location.href = `${host}/login/?returnUrl=${returnUrl}`
      return {}
    }
    // 首页出现感叹号暂时不知为何
    // 因为被mock捕获了, 所以你看不到请求, 我已经修复了
    if (parsedRes.rc !== 0 && parsedRes.rc) {
      Toast.fail(parsedRes.msg)
    }
    return parsedRes
  }

  // 请求失败，返回解析之后的失败的数据
  const error = parsedRes
  throw error
}

const parseRes = async (res: Response) => {
  const contentType = res.headers.get('Content-Type')
  // 判定返回的内容类型，做不同的处理
  if (contentType) {
    if (contentType.indexOf('json') > -1) {
      return await res.json()
    }
    if (contentType.indexOf('text') > -1) {
      return await res.text()
    }
    if (contentType.indexOf('form') > -1) {
      return await res.formData()
    }
    if (contentType.indexOf('video') > -1) {
      return await res.blob()
    }
  }
  return await res.json()
}

export default $req


