import request from '@/utils/request'
import { SEVER_KEY } from '@/utils/config'

interface PlaceAround {
  location: string;
  page: number;
  keywords?: string;
}

interface InputTips {
  keywords?: string;
}

// 获取附近地址信息
export const placeAround = ({
  ...rest
}: PlaceAround) => {
  return request('/v3/place/around', {
    baseUrl: 'https://restapi.amap.com',
    params: {
      key: SEVER_KEY,
      offset: 10, // 每页记录数据
      ...rest
    },
    auth: false
  })
}

// 输入文字
export const inputTips = ({
  ...rest
}: InputTips) => {
  return request('/v3/assistant/inputtips', {
    baseUrl: 'https://restapi.amap.com',
    params: {
      key: SEVER_KEY,
      ...rest
    },
    auth: false
  })
}